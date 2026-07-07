-- ============================================================================
-- Migration: careers (인재채용 지원/문의 제출 · 수신 이메일 설정)
-- ============================================================================
-- 인재채용 공개 폼(CareersForm) 제출을 저장하고, 관리자가 지정한 수신 주소로
-- Resend 이메일을 발송하기 위한 두 테이블.
--
--   - public.careers_submissions : 방문자 지원/문의 제출 내역(다건). 관리자 목록 확인.
--   - public.careers_settings    : 수신 이메일 설정(싱글톤 id=1). 발송 대상/발신 주소.
--
-- 접근 모델:
--   - 공개 폼 제출(anon)      : careers_submissions INSERT 만 허용(공개 write 표면 최소화).
--   - 관리자(authenticated)   : submissions 전량 SELECT/UPDATE/DELETE, settings SELECT/UPDATE.
--   - Route Handler(서버 전용) : settings 읽기 · (필요 시) email_sent 기록은 service_role 로 수행.
--                                service_role 은 RLS 를 우회한다. 키는 서버 전용, 클라 노출 금지.
--
-- email_sent 확정 방식(채택):
--   Route Handler 가 [Resend 발송 → 성공 여부 판정 → 그 결과를 email_sent 로 확정해 INSERT 1회].
--   즉 삽입 후 UPDATE 하는 2단계가 아니라, 발송 결과를 담아 단 한 번 INSERT 한다.
--   따라서 anon UPDATE 정책은 두지 않는다(anon write = INSERT 뿐). UPDATE 는 관리자(authenticated)
--   가 목록에서 발송 여부를 수동 정정할 때만 쓰인다. 상세는 careers-schema.md "삽입·발송 흐름" 참조.
--
-- settings 읽기 방식(채택 = b):
--   recipient_email/from_email 은 anon SELECT 를 허용하지 않는다(수신 주소 비노출).
--   Route Handler(anon 세션 롤)는 service_role 클라이언트로 settings 를 읽는다(RLS 우회).
--   관리자 콘솔 getter 는 authenticated 세션으로 읽으므로 authenticated SELECT 는 허용.
--
-- 실행 방법: Supabase 대시보드 > SQL Editor 에 그대로 붙여넣어 실행.
--   SQL Editor 는 owner(postgres) 컨텍스트로 동작하므로 RLS 를 우회한다.
--   따라서 아래 seed insert 는 정책 정의 순서와 무관하게 성공한다.
--   (RLS 는 owner 를 통과시키며, 정책은 anon/authenticated 등 일반 롤에만 적용됨)
-- 재실행 안전(idempotent): 테이블/트리거/정책/seed 모두 존재 검사 후 생성.
-- ============================================================================

-- ============================================================================
-- A) careers_submissions (방문자 지원/문의 제출 내역, 다건)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- A-1) 테이블 생성
--    - email_sent: Route Handler 가 Resend 발송 성공 여부를 확정해 INSERT 시 기록.
--                  관리자 목록에서 발송 여부 확인용.
-- ----------------------------------------------------------------------------
create table if not exists public.careers_submissions (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  message     text not null,
  email_sent  boolean not null default false,
  created_at  timestamptz not null default now()
);

comment on table public.careers_submissions is
  '인재채용 공개 폼 제출 내역(다건). anon INSERT, 관리자 SELECT/UPDATE/DELETE.';
comment on column public.careers_submissions.email_sent is
  'Resend 발송 성공 여부. Route Handler 가 발송 결과를 확정해 INSERT 시 기록(권장) 또는 관리자가 정정.';

-- ----------------------------------------------------------------------------
-- A-2) 조회 정렬 인덱스 (관리자 목록은 최신순: created_at desc)
-- ----------------------------------------------------------------------------
create index if not exists idx_careers_submissions_created_at
  on public.careers_submissions (created_at desc);

-- ----------------------------------------------------------------------------
-- A-3) RLS 활성화 (필수)
-- ----------------------------------------------------------------------------
alter table public.careers_submissions enable row level security;

-- A-3-1) INSERT: anon + authenticated 허용 (공개 폼이 Route Handler(anon 롤)에서 삽입)
--   전제: Route Handler 가 zod 검증 후 삽입한다.
drop policy if exists "public_insert" on public.careers_submissions;
create policy "public_insert"
  on public.careers_submissions
  for insert
  to anon, authenticated
  with check (true);

-- A-3-2) SELECT: authenticated 만 (관리자 목록 확인)
drop policy if exists "admin_read" on public.careers_submissions;
create policy "admin_read"
  on public.careers_submissions
  for select
  to authenticated
  using (true);

-- A-3-3) UPDATE: authenticated 만 (관리자 정정용; anon UPDATE 는 정책 없음 → 거부)
--   기본 발송 기록은 INSERT 시 email_sent 확정으로 처리하므로 런타임 UPDATE 는 관리자만.
drop policy if exists "admin_update" on public.careers_submissions;
create policy "admin_update"
  on public.careers_submissions
  for update
  to authenticated
  using (true)
  with check (true);

-- A-3-4) DELETE: authenticated 만
drop policy if exists "admin_delete" on public.careers_submissions;
create policy "admin_delete"
  on public.careers_submissions
  for delete
  to authenticated
  using (true);

-- ============================================================================
-- B) careers_settings (수신 이메일 설정, 싱글톤 id=1)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- B-1) 테이블 생성 (싱글톤: id 는 항상 1)
--    - recipient_email: 관리자가 설정하는 발송 수신 주소. 초기값 빈 문자열.
--    - from_email     : 발신 도메인 인증된 주소(선택). 미설정 시 Route Handler 가
--                       env(CAREERS_FROM_EMAIL)/테스트 발신 주소 사용.
-- ----------------------------------------------------------------------------
create table if not exists public.careers_settings (
  id              int primary key default 1,
  recipient_email text not null default '',
  from_email      text,
  updated_at      timestamptz not null default now(),
  -- 싱글톤 강제: 오직 id=1 행만 존재 가능
  constraint careers_settings_singleton check (id = 1)
);

comment on table public.careers_settings is
  '인재채용 수신 이메일 설정(싱글톤, id=1 고정). 관리자만 편집.';
comment on column public.careers_settings.recipient_email is
  '발송 수신 주소. Route Handler 가 service_role 로 읽는다(anon SELECT 미허용). 초기 빈 문자열.';
comment on column public.careers_settings.from_email is
  '발신 주소(선택, nullable). 미설정 시 Route Handler 가 env/테스트 발신 사용.';

-- ----------------------------------------------------------------------------
-- B-2) updated_at 자동 갱신 트리거 (company_info/culture 트리거 패턴 미러)
-- ----------------------------------------------------------------------------
create or replace function public.set_careers_settings_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_careers_settings_updated_at on public.careers_settings;
create trigger trg_careers_settings_updated_at
  before update on public.careers_settings
  for each row
  execute function public.set_careers_settings_updated_at();

-- ----------------------------------------------------------------------------
-- B-3) RLS 활성화 (필수)
-- ----------------------------------------------------------------------------
alter table public.careers_settings enable row level security;

-- B-3-1) SELECT: authenticated 만 (관리자 콘솔 getter).
--   anon SELECT 미허용 → 수신 주소 비노출. Route Handler 는 service_role 로 읽음(RLS 우회).
drop policy if exists "admin_read" on public.careers_settings;
create policy "admin_read"
  on public.careers_settings
  for select
  to authenticated
  using (true);

-- B-3-2) UPDATE: authenticated 만 (관리자 수신 설정 저장). id=1 고정.
drop policy if exists "admin_update" on public.careers_settings;
create policy "admin_update"
  on public.careers_settings
  for update
  to authenticated
  using (true)
  with check (id = 1);

-- B-3-3) INSERT / DELETE 정책: 없음(의도적)
--   - insert 정책이 없으므로 anon/authenticated 런타임 insert 는 모두 거부 → 싱글톤 유지.
--   - delete 정책이 없으므로 런타임 delete 도 거부 → 삭제 불가.
--   - 아래 seed insert 는 SQL Editor owner 컨텍스트(RLS 우회)에서 실행되므로 성공.

-- ----------------------------------------------------------------------------
-- B-4) seed (id=1 한 행) — 빈 수신 주소로 초기화, 재실행 안전.
--   관리자가 콘솔에서 recipient_email 을 채우기 전까지 발송 대상은 비어 있다.
--   참고값: company_info.email(현재 '') 을 초기 수신 주소로 쓰고 싶다면 관리자가 콘솔에서 입력.
-- ----------------------------------------------------------------------------
insert into public.careers_settings (id, recipient_email, from_email)
values (1, '', null)
on conflict (id) do nothing;
