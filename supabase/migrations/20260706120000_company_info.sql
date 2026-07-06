-- ============================================================================
-- Migration: company_info (싱글톤 회사 메타정보)
-- ============================================================================
-- 관리자가 화면 노출 회사 정보를 한 곳에서 편집하기 위한 단일 행 테이블.
-- 공개 사이트(anon)는 읽기만, 인증된 관리자(authenticated)만 수정 가능.
--
-- 실행 방법: Supabase 대시보드 > SQL Editor 에 그대로 붙여넣어 실행.
--   SQL Editor 는 owner(postgres) 컨텍스트로 동작하므로 RLS 를 우회한다.
--   따라서 아래 seed insert 는 정책 정의 순서와 무관하게 성공한다.
--   (RLS 는 owner 를 통과시키며, 정책은 anon/authenticated 등 일반 롤에만 적용됨)
-- 재실행 안전(idempotent): 테이블/트리거/정책 모두 존재 검사 후 생성.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1) 테이블 생성 (싱글톤: id 는 항상 1)
-- ----------------------------------------------------------------------------
create table if not exists public.company_info (
  id            int primary key default 1,
  name          text not null default '',
  name_en       text not null default '',
  legal_name    text not null default '',
  ceo           text not null default '',
  url           text not null default '',
  tagline       text not null default '',
  description   text not null default '',
  address_line1 text not null default '',
  address_line2 text not null default '',
  tel           text not null default '',
  fax           text not null default '',
  email         text not null default '',
  copyright     text not null default '',
  updated_at    timestamptz not null default now(),
  -- 싱글톤 강제: 오직 id=1 행만 존재 가능
  constraint company_info_singleton check (id = 1)
);

comment on table public.company_info is '화면 노출용 회사 메타정보 (싱글톤, id=1 고정).';

-- ----------------------------------------------------------------------------
-- 2) updated_at 자동 갱신 트리거
-- ----------------------------------------------------------------------------
create or replace function public.set_company_info_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_company_info_updated_at on public.company_info;
create trigger trg_company_info_updated_at
  before update on public.company_info
  for each row
  execute function public.set_company_info_updated_at();

-- ----------------------------------------------------------------------------
-- 3) RLS 활성화 (필수)
-- ----------------------------------------------------------------------------
alter table public.company_info enable row level security;

-- 3-1) SELECT: 공개 — anon + authenticated 모두 허용 (공개 사이트가 읽음)
drop policy if exists "public_read" on public.company_info;
create policy "public_read"
  on public.company_info
  for select
  to anon, authenticated
  using (true);

-- 3-2) UPDATE: authenticated 롤만 허용 (관리자 편집)
drop policy if exists "admin_update" on public.company_info;
create policy "admin_update"
  on public.company_info
  for update
  to authenticated
  using (true)
  with check (id = 1);

-- 3-3) INSERT / DELETE 정책: 없음(의도적)
--   - insert 정책이 없으므로 anon/authenticated 의 런타임 insert 는 모두 거부된다.
--     => 싱글톤 유지: 신규 행 추가 불가.
--   - delete 정책이 없으므로 런타임 delete 도 모두 거부된다. => 삭제 불가.
--   - 아래 seed insert 는 SQL Editor 의 owner 컨텍스트(RLS 우회)에서 실행되므로 성공.

-- ----------------------------------------------------------------------------
-- 4) seed (id=1 한 행) — SITE 상수 전사, 재실행 안전
-- ----------------------------------------------------------------------------
insert into public.company_info (
  id, name, name_en, legal_name, ceo, url, tagline, description,
  address_line1, address_line2, tel, fax, email, copyright
) values (
  1,
  '이쓰리',
  'E3',
  '(주) 이쓰리',
  '조흔우',
  'https://ethree.co.kr',
  'ENVIRONMENT IT SOLUTION GROUP',
  '이쓰리는 10년 이상 환경 IT 분야의 전문가들이 만든 환경 IT 융합서비스 으뜸 기업입니다.',
  '서울시 성동구 아차산로 17길 49',
  '생각공장 데시앙플렉스 816호',
  '02-552-1947',
  '02-552-1948',
  '',
  'COPYRIGHT©2014 E3. ALL RIGHT RESERVED'
)
on conflict (id) do nothing;
