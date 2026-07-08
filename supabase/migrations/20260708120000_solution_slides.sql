-- ============================================================================
-- Migration: solution_slides (About Business 솔루션 캐러셀 슬라이드)
-- ============================================================================
-- 랜딩 About Business 섹션의 솔루션 캐러셀(SI/R&D/Consulting)을 정적 상수에서
-- 동적 테이블로 전환해 관리자 콘솔(/console/landing/solutions)에서 CRUD·순서변경·
-- 이미지 업로드가 가능하도록 한다.
--
-- 접근 모델:
--   - 공개 사이트(anon)      : is_active = true 인 행만 읽기.
--   - 관리자(authenticated)  : 비활성 포함 전체 읽기 + 생성/수정/삭제.
--   - 슬라이드 이미지        : Storage 버킷 landing-images (public read, 인증 write).
--                              향후 다른 랜딩 블록(Hero 등)도 이 버킷을 하위 폴더로 공유 가능.
--
-- 실행 방법: Supabase 대시보드 > SQL Editor 에 그대로 붙여넣어 실행.
-- 재실행 안전(idempotent): 테이블/트리거/정책/버킷/seed 모두 존재 검사 후 생성.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1) 테이블 생성
-- ----------------------------------------------------------------------------
create table if not exists public.solution_slides (
  id            uuid primary key default gen_random_uuid(),
  sort_order    int not null default 0,
  title         text not null,
  title_accent  text not null default '',
  description   text not null,
  image_url     text,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table public.solution_slides is
  'About Business 솔루션 캐러셀 슬라이드. sort_order 오름차순으로 노출.';
comment on column public.solution_slides.title_accent is
  '제목 중 브랜드 색상으로 강조할 부분(예: SI, R&D, CONSULTING).';
comment on column public.solution_slides.is_active is
  'true일 때만 공개 사이트(anon)에 노출. false면 소프트 숨김(삭제 아님).';

-- ----------------------------------------------------------------------------
-- 2) 조회 정렬 인덱스 (공개 목록은 is_active + sort_order 기준 조회)
-- ----------------------------------------------------------------------------
create index if not exists idx_solution_slides_active_sort
  on public.solution_slides (is_active, sort_order);

-- ----------------------------------------------------------------------------
-- 3) updated_at 자동 갱신 트리거 (news와 동일 방식)
-- ----------------------------------------------------------------------------
create or replace function public.set_solution_slides_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_solution_slides_updated_at on public.solution_slides;
create trigger trg_solution_slides_updated_at
  before update on public.solution_slides
  for each row
  execute function public.set_solution_slides_updated_at();

-- ----------------------------------------------------------------------------
-- 4) RLS 활성화 (필수)
-- ----------------------------------------------------------------------------
alter table public.solution_slides enable row level security;

-- 4-1) SELECT (anon): 활성 슬라이드만 노출
drop policy if exists "public_read" on public.solution_slides;
create policy "public_read"
  on public.solution_slides
  for select
  to anon
  using (is_active = true);

-- 4-2) SELECT (authenticated): 비활성 포함 전체 조회 (관리자 콘솔)
drop policy if exists "admin_read" on public.solution_slides;
create policy "admin_read"
  on public.solution_slides
  for select
  to authenticated
  using (true);

-- 4-3) INSERT: authenticated 롤만 허용
drop policy if exists "admin_insert" on public.solution_slides;
create policy "admin_insert"
  on public.solution_slides
  for insert
  to authenticated
  with check (true);

-- 4-4) UPDATE: authenticated 롤만 허용
drop policy if exists "admin_update" on public.solution_slides;
create policy "admin_update"
  on public.solution_slides
  for update
  to authenticated
  using (true)
  with check (true);

-- 4-5) DELETE: authenticated 롤만 허용
drop policy if exists "admin_delete" on public.solution_slides;
create policy "admin_delete"
  on public.solution_slides
  for delete
  to authenticated
  using (true);

-- ----------------------------------------------------------------------------
-- 5) Storage 버킷 landing-images (public read, 인증 write)
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('landing-images', 'landing-images', true)
on conflict (id) do nothing;

drop policy if exists "landing_images_public_read" on storage.objects;
create policy "landing_images_public_read"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'landing-images');

drop policy if exists "landing_images_admin_insert" on storage.objects;
create policy "landing_images_admin_insert"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'landing-images');

drop policy if exists "landing_images_admin_update" on storage.objects;
create policy "landing_images_admin_update"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'landing-images')
  with check (bucket_id = 'landing-images');

drop policy if exists "landing_images_admin_delete" on storage.objects;
create policy "landing_images_admin_delete"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'landing-images');

-- ----------------------------------------------------------------------------
-- 6) seed — 기존 BUSINESS_SOLUTIONS 3건 이관, 테이블이 비어있을 때만 삽입(idempotent)
-- ----------------------------------------------------------------------------
insert into public.solution_slides (sort_order, title, title_accent, description, image_url)
select * from (values
  (0, 'ENVIRONMENT', 'SI',
   '환경IT서비스 전문기업으로 대국민 서비스, 행정업무 통합관리 등 효율적인 시스템 구축과 환경 정보시스템에 관한 기획에서부터 개발과 구축, 운영까지의 모든 서비스를 제공합니다.',
   '/images/solution-slide1.png'),
  (1, 'ENVIRONMENT', 'R&D',
   '환경의 변화, 그것에 대응하는 기초연구와 응용화 연구를 통한 환경IT 관련 기술개발의 리스크를 줄이고 성공 가능성을 높이기 위해 전문가 그룹이 끊임없이 연구합니다.',
   '/images/solution-slide2.png'),
  (2, 'ENVIRONMENT', 'CONSULTING',
   '환경IT 관련 기술개발 프로젝트 수행 경험이 풍부한 전문 그룹과 조직을 바탕으로 차별화된 컨설팅을 제공, 다양한 환경 분야 프로젝트에 최적화된 사업 수행을 제공합니다.',
   '/images/solution-slide3.png')
) as seed(sort_order, title, title_accent, description, image_url)
where not exists (select 1 from public.solution_slides);
