-- ============================================================================
-- Migration: news (블로그형 뉴스 콘텐츠 + TipTap 본문 + 커버 이미지)
-- ============================================================================
-- 공개 사이트가 노출하는 News 콘텐츠를 정적 상수에서 동적 테이블로 전환한다.
-- 본문(body)은 TipTap 에디터의 doc JSON 을 그대로 저장하고, 렌더 시점에
-- 서버에서 HTML 로 변환 + 새니타이즈한다(XSS 방지, 저장 원본은 JSON 유지).
--
-- 접근 모델:
--   - 공개 사이트(anon)      : published = true 인 행만 읽기.
--   - 관리자(authenticated)  : 초안 포함 전체 읽기 + 생성/수정/삭제.
--   - 커버/본문 이미지        : Storage 버킷 news-images (public read, 인증 write).
--
-- 실행 방법: Supabase 대시보드 > SQL Editor 에 그대로 붙여넣어 실행.
--   SQL Editor 는 owner(postgres) 컨텍스트로 동작하므로 RLS 를 우회한다.
--   따라서 아래 seed insert 는 정책 정의 순서와 무관하게 성공한다.
--   (RLS 는 owner 를 통과시키며, 정책은 anon/authenticated 등 일반 롤에만 적용됨)
-- 재실행 안전(idempotent): 테이블/트리거/정책/버킷/seed 모두 존재 검사 후 생성.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1) 테이블 생성
-- ----------------------------------------------------------------------------
create table if not exists public.news (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  title           text not null,
  excerpt         text,
  -- TipTap doc JSON. 최소 유효 형태: {"type":"doc","content":[{"type":"paragraph"}]}
  body            jsonb not null default '{}'::jsonb,
  cover_image_url text,
  published       boolean not null default false,
  published_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table public.news is '블로그형 뉴스 콘텐츠. body 는 TipTap doc JSON.';
comment on column public.news.body is 'TipTap 에디터 doc JSON. 렌더 시 서버에서 HTML 변환 + 새니타이즈.';
comment on column public.news.published is 'true 일 때만 공개 사이트(anon)에 노출.';

-- ----------------------------------------------------------------------------
-- 2) 조회/정렬 인덱스
--    - slug 는 unique 제약으로 이미 인덱스 존재.
--    - 공개 목록은 published + published_at 기준 최신순 조회가 잦으므로 인덱스 추가.
-- ----------------------------------------------------------------------------
create index if not exists idx_news_published_at
  on public.news (published_at desc);

create index if not exists idx_news_published_published_at
  on public.news (published, published_at desc);

-- ----------------------------------------------------------------------------
-- 3) updated_at 자동 갱신 트리거 (company_info 와 동일 방식)
-- ----------------------------------------------------------------------------
create or replace function public.set_news_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_news_updated_at on public.news;
create trigger trg_news_updated_at
  before update on public.news
  for each row
  execute function public.set_news_updated_at();

-- ----------------------------------------------------------------------------
-- 4) RLS 활성화 (필수)
-- ----------------------------------------------------------------------------
alter table public.news enable row level security;

-- 4-1) SELECT (anon): 공개된 행만 노출
drop policy if exists "public_read" on public.news;
create policy "public_read"
  on public.news
  for select
  to anon
  using (published = true);

-- 4-2) SELECT (authenticated): 초안 포함 전체 조회 (관리자 콘솔)
drop policy if exists "admin_read" on public.news;
create policy "admin_read"
  on public.news
  for select
  to authenticated
  using (true);

-- 4-3) INSERT: authenticated 롤만 허용
drop policy if exists "admin_insert" on public.news;
create policy "admin_insert"
  on public.news
  for insert
  to authenticated
  with check (true);

-- 4-4) UPDATE: authenticated 롤만 허용
drop policy if exists "admin_update" on public.news;
create policy "admin_update"
  on public.news
  for update
  to authenticated
  using (true)
  with check (true);

-- 4-5) DELETE: authenticated 롤만 허용
drop policy if exists "admin_delete" on public.news;
create policy "admin_delete"
  on public.news
  for delete
  to authenticated
  using (true);

-- ----------------------------------------------------------------------------
-- 5) Storage 버킷 news-images (public read, 인증 write)
-- ----------------------------------------------------------------------------
-- 5-1) 버킷 생성 (재실행 안전)
insert into storage.buckets (id, name, public)
values ('news-images', 'news-images', true)
on conflict (id) do nothing;

-- 5-2) SELECT: 공개 read (anon + authenticated), news-images 버킷으로 스코프
drop policy if exists "news_images_public_read" on storage.objects;
create policy "news_images_public_read"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'news-images');

-- 5-3) INSERT: authenticated 만 업로드
drop policy if exists "news_images_admin_insert" on storage.objects;
create policy "news_images_admin_insert"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'news-images');

-- 5-4) UPDATE: authenticated 만 수정(덮어쓰기/메타 변경)
drop policy if exists "news_images_admin_update" on storage.objects;
create policy "news_images_admin_update"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'news-images')
  with check (bucket_id = 'news-images');

-- 5-5) DELETE: authenticated 만 삭제
drop policy if exists "news_images_admin_delete" on storage.objects;
create policy "news_images_admin_delete"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'news-images');

-- ----------------------------------------------------------------------------
-- 6) seed — 기존 정적 NEWS_ITEMS 3건 이관, 재실행 안전(slug 충돌 시 do nothing)
--    body 는 최소 유효 TipTap doc JSON, excerpt/cover_image_url 은 NULL.
--    published=true, published_at = 기존 date.
-- ----------------------------------------------------------------------------
insert into public.news (slug, title, body, published, published_at)
values
  (
    'chemical-safety-mou',
    '서울대학교 보건대학원 이쓰리「화학물질 안전관리 특성화대학원 산학협력 MOU 체결식」체결',
    '{"type":"doc","content":[{"type":"paragraph"}]}'::jsonb,
    true,
    '2026-06-10T00:00:00+09:00'
  ),
  (
    '8th-climate-seminar-completed',
    '[완료] 이쓰리 8차 기후세미나 완료',
    '{"type":"doc","content":[{"type":"paragraph"}]}'::jsonb,
    true,
    '2025-10-01T00:00:00+09:00'
  ),
  (
    '8th-climate-seminar-notice',
    '[공지] 2025.09.30(화) 8차 기후세미나 진행 공지',
    '{"type":"doc","content":[{"type":"paragraph"}]}'::jsonb,
    true,
    '2025-09-18T00:00:00+09:00'
  )
on conflict (slug) do nothing;
