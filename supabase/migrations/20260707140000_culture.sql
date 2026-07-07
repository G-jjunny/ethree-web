-- ============================================================================
-- Migration: culture (기업문화 콘텐츠 — 인재상 · 핵심가치 · 복지)
-- ============================================================================
-- 공개 사이트가 노출하는 기업문화 콘텐츠를 정적 상수(support-culture.data.ts)에서
-- 동적 테이블로 전환한다. 관리자는 항목 단위로 추가/수정/삭제 + 이미지 업로드가 가능하다.
--
-- 데이터 모델:
--   단일 테이블 public.culture_items 에 세 섹션(+복지 인트로)을 group 컬럼으로 구분해 담는다.
--     - group='talent'        인재상 항목 (화면: 인재상 섹션)
--     - group='value'         핵심가치 항목 (화면: 핵심가치 IconCard 그리드)
--     - group='welfare'       복지·근무환경 benefit 항목 (화면: 복지 섹션 카드)
--     - group='welfare_intro' 복지 섹션 헤더 텍스트 1행 (화면: 복지 섹션 인트로 title/description)
--   섹션 내 정렬은 sort_order, 표시 배지(talent 'no' / value 'label')는 label 컬럼으로 흡수.
--
-- WELFARE 인트로 처리 결정: 별도 소테이블(culture_sections) 대신 culture_items 에
--   전용 group='welfare_intro' 단일 행으로 흡수한다.
--   근거: (1) 사용자 요구("각 내용을 관리자가 수정")를 만족하려면 인트로도 편집 가능해야 함.
--         (2) news/company_info 의 단일 테이블 톤을 유지하고 RLS/정책 표면을 늘리지 않기 위해
--             소테이블 신설(중복 트리거·RLS)을 피한다. group CHECK 로 값만 확장.
--
-- 접근 모델:
--   - 공개 사이트(anon)     : 전량 읽기(초안 개념 없음, using true).
--   - 관리자(authenticated) : 읽기 + 생성/수정/삭제.
--   - 이미지                 : Storage 버킷 culture-images (public read, 인증 write).
--
-- 실행 방법: Supabase 대시보드 > SQL Editor 에 그대로 붙여넣어 실행.
--   SQL Editor 는 owner(postgres) 컨텍스트로 동작하므로 RLS 를 우회한다.
--   따라서 아래 seed insert 는 정책 정의 순서와 무관하게 성공한다.
--   (RLS 는 owner 를 통과시키며, 정책은 anon/authenticated 등 일반 롤에만 적용됨)
-- 재실행 안전(idempotent): 테이블/트리거/정책/버킷/seed 모두 존재 검사 후 생성.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1) 테이블 생성
--    - "group" 은 SQL 예약어이므로 항상 큰따옴표로 인용한다.
--    - description 은 현재 모든 항목이 값을 보유하므로 NOT NULL.
--    - label / image_url 은 optional(nullable).
-- ----------------------------------------------------------------------------
create table if not exists public.culture_items (
  id          uuid primary key default gen_random_uuid(),
  "group"     text not null,
  sort_order  int  not null default 0,
  title       text not null,
  description text not null,
  label       text,
  image_url   text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  -- 허용 group 값 제한
  constraint culture_items_group_check
    check ("group" in ('talent', 'value', 'welfare', 'welfare_intro')),
  -- (group, sort_order) 는 유일 — 정렬 안정성 + seed 충돌 키로 사용
  constraint culture_items_group_sort_unique
    unique ("group", sort_order)
);

comment on table public.culture_items is
  '기업문화 콘텐츠. group 으로 인재상(talent)/핵심가치(value)/복지(welfare)/복지인트로(welfare_intro) 구분.';
comment on column public.culture_items."group" is
  '섹션 구분: talent | value | welfare | welfare_intro. CHECK 제약.';
comment on column public.culture_items.sort_order is
  'group 내 정렬 순서(1-based). (group, sort_order) 유일.';
comment on column public.culture_items.label is
  '표시 배지. talent="01".. / value="VALUE 01".. / welfare·welfare_intro=NULL.';
comment on column public.culture_items.image_url is
  'Storage(culture-images) public URL. seed 는 NULL.';

-- ----------------------------------------------------------------------------
-- 2) 조회/정렬 인덱스
--    - (group, sort_order) 유일 제약이 이미 동일 컬럼 조합의 인덱스를 제공하므로
--      섹션별 정렬 조회(where "group"=? order by sort_order)에 그대로 사용된다.
--      별도 인덱스는 중복이라 생성하지 않는다.
-- ----------------------------------------------------------------------------

-- ----------------------------------------------------------------------------
-- 3) updated_at 자동 갱신 트리거 (news/company_info 와 동일 방식)
-- ----------------------------------------------------------------------------
create or replace function public.set_culture_items_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_culture_items_updated_at on public.culture_items;
create trigger trg_culture_items_updated_at
  before update on public.culture_items
  for each row
  execute function public.set_culture_items_updated_at();

-- ----------------------------------------------------------------------------
-- 4) RLS 활성화 (필수)
-- ----------------------------------------------------------------------------
alter table public.culture_items enable row level security;

-- 4-1) SELECT: anon + authenticated 전량 공개 (초안 개념 없음)
drop policy if exists "public_read" on public.culture_items;
create policy "public_read"
  on public.culture_items
  for select
  to anon, authenticated
  using (true);

-- 4-2) INSERT: authenticated 롤만 허용
drop policy if exists "admin_insert" on public.culture_items;
create policy "admin_insert"
  on public.culture_items
  for insert
  to authenticated
  with check (true);

-- 4-3) UPDATE: authenticated 롤만 허용
drop policy if exists "admin_update" on public.culture_items;
create policy "admin_update"
  on public.culture_items
  for update
  to authenticated
  using (true)
  with check (true);

-- 4-4) DELETE: authenticated 롤만 허용
drop policy if exists "admin_delete" on public.culture_items;
create policy "admin_delete"
  on public.culture_items
  for delete
  to authenticated
  using (true);

-- ----------------------------------------------------------------------------
-- 5) Storage 버킷 culture-images (public read, 인증 write) — news-images 정책 미러
-- ----------------------------------------------------------------------------
-- 5-1) 버킷 생성 (재실행 안전)
insert into storage.buckets (id, name, public)
values ('culture-images', 'culture-images', true)
on conflict (id) do nothing;

-- 5-2) SELECT: 공개 read (anon + authenticated), culture-images 버킷으로 스코프
drop policy if exists "culture_images_public_read" on storage.objects;
create policy "culture_images_public_read"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'culture-images');

-- 5-3) INSERT: authenticated 만 업로드
drop policy if exists "culture_images_admin_insert" on storage.objects;
create policy "culture_images_admin_insert"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'culture-images');

-- 5-4) UPDATE: authenticated 만 수정(덮어쓰기/메타 변경)
drop policy if exists "culture_images_admin_update" on storage.objects;
create policy "culture_images_admin_update"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'culture-images')
  with check (bucket_id = 'culture-images');

-- 5-5) DELETE: authenticated 만 삭제
drop policy if exists "culture_images_admin_delete" on storage.objects;
create policy "culture_images_admin_delete"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'culture-images');

-- ----------------------------------------------------------------------------
-- 6) seed — support-culture.data.ts 현재 값 전량 이관, image_url 은 NULL.
--    재실행 안전: 충돌 키 (group, sort_order) 로 on conflict do nothing.
--      TALENT_TRAITS 3 + CULTURE_VALUES 3 + WELFARE.benefits 4 + WELFARE 인트로 1 = 11행.
-- ----------------------------------------------------------------------------
insert into public.culture_items ("group", sort_order, label, title, description) values
  -- 인재상 (TALENT_TRAITS, no → label)
  ('talent', 1, '01', '환경을 생각하는 사람',
    '기술로 더 나은 환경을 만든다는 사명에 공감하고, 자신의 일이 사회에 미치는 가치를 고민하는 인재를 지향합니다.'),
  ('talent', 2, '02', '함께 성장하는 사람',
    '동료와 지식을 나누고 서로의 성장을 응원하며, 협업 속에서 더 나은 결과를 만들어 가는 태도를 중요하게 생각합니다.'),
  ('talent', 3, '03', '끊임없이 배우는 사람',
    '변화하는 기술과 환경에 열린 마음으로 도전하고, 스스로 학습하며 전문성을 키워 가는 자세를 응원합니다.'),

  -- 핵심가치 (CULTURE_VALUES, label 유지)
  ('value', 1, 'VALUE 01', '신뢰',
    '고객과 동료 사이의 약속을 지키고, 투명하게 소통하며 신뢰를 바탕으로 협업합니다.'),
  ('value', 2, 'VALUE 02', '전문성',
    '환경IT 분야의 축적된 경험과 지속적인 학습으로 각자의 전문성을 깊이 있게 다집니다.'),
  ('value', 3, 'VALUE 03', '도전',
    '새로운 기술과 방식에 열려 있고, 실패를 배움으로 삼아 더 나은 해법을 찾아 나섭니다.'),

  -- 복지·근무환경 인트로 (WELFARE.title / WELFARE.description)
  ('welfare_intro', 1, null, '몰입할 수 있는 근무환경',
    '구성원이 일과 삶의 균형을 지키며 자신의 역량에 온전히 몰입할 수 있도록 다양한 제도와 문화를 만들어 가고 있습니다.'),

  -- 복지·근무환경 benefit (WELFARE.benefits)
  ('welfare', 1, null, '일과 삶의 균형',
    '유연한 근무 문화를 통해 구성원이 각자의 리듬으로 최고의 성과를 낼 수 있도록 지원합니다.'),
  ('welfare', 2, null, '성장 지원',
    '교육·세미나 참여와 자기계발을 장려하여 구성원의 지속적인 성장을 함께합니다.'),
  ('welfare', 3, null, '함께하는 문화',
    '수평적인 소통과 다양한 사내 활동으로 서로를 이해하고 협업하는 문화를 지향합니다.'),
  ('welfare', 4, null, '건강한 일터',
    '구성원의 건강과 안정을 위한 복리후생으로 안심하고 일할 수 있는 환경을 갖춰 갑니다.')
on conflict ("group", sort_order) do nothing;
