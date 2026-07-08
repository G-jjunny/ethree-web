# solution_slides 스키마 계약

`20260708-solution-cms-plan.md`의 Section 2 상세. FE(features/solution)가 참조하는 DB 계약.

## 테이블: `public.solution_slides`

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | uuid | pk, default gen_random_uuid() | |
| sort_order | int | not null, default 0 | 캐러셀 노출 순서(오름차순) |
| title | text | not null | 기본 제목 (예: "ENVIRONMENT") |
| title_accent | text | not null, default '' | 브랜드 강조 제목 (예: "SI", "R&D", "CONSULTING") |
| description | text | not null | 슬라이드 설명 문구 |
| image_url | text | nullable | Storage public URL. null이면 공개 카드에 placeholder 유지 |
| is_active | boolean | not null, default true | false면 공개 사이트 미노출(soft hide) |
| created_at | timestamptz | not null, default now() | |
| updated_at | timestamptz | not null, default now() | 트리거로 자동 갱신 |

인덱스:
- `idx_solution_slides_active_sort` on `(is_active, sort_order)` — 공개 목록 조회 최적화.

트리거:
- `set_solution_slides_updated_at` — `news`의 `set_news_updated_at`과 동일 패턴, before update.

## RLS

- `enable row level security` 필수.
- `public_read` (to anon): `using (is_active = true)`.
- `admin_read` (to authenticated): `using (true)` — 비활성 포함 전체.
- `admin_insert` / `admin_update` / `admin_delete` (to authenticated): `using/with check (true)`.

## Storage 버킷: `landing-images`

- `public: true` (버킷 생성, 재실행 안전 `on conflict do nothing`).
- 업로드 경로 컨벤션: `solution/{uuid}.{ext}` (슬라이스별 하위 폴더 — 향후 `hero/{uuid}.{ext}` 등 확장 가능).
- 정책 (news-images와 동일 구조, 버킷명만 교체):
  - `landing_images_public_read` (anon, authenticated / select) — `bucket_id = 'landing-images'`
  - `landing_images_admin_insert` (authenticated / insert)
  - `landing_images_admin_update` (authenticated / update)
  - `landing_images_admin_delete` (authenticated / delete)

## Seed

기존 `BUSINESS_SOLUTIONS` 3건을 `sort_order` 0/1/2로 이관, `title`/`title_accent` 분리, 기존 이미지 경로 그대로 `image_url`에 채워 시각적 변화 없이 전환:

| sort_order | title | title_accent | image_url |
|---|---|---|---|
| 0 | ENVIRONMENT | SI | /images/solution-slide1.png |
| 1 | ENVIRONMENT | R&D | /images/solution-slide2.png |
| 2 | ENVIRONMENT | CONSULTING | /images/solution-slide3.png |

description은 기존 문구 원문 그대로(business-solutions.data.ts 참조). `is_active = true` 전체. `on conflict do nothing` 조건은 slug 같은 unique 키가 없으므로 **테이블이 비어있을 때만 insert**하는 방식으로 idempotent 보장:

```sql
insert into public.solution_slides (sort_order, title, title_accent, description, image_url)
select * from (values
  (0, 'ENVIRONMENT', 'SI', '...', '/images/solution-slide1.png'),
  (1, 'ENVIRONMENT', 'R&D', '...', '/images/solution-slide2.png'),
  (2, 'ENVIRONMENT', 'CONSULTING', '...', '/images/solution-slide3.png')
) as seed(sort_order, title, title_accent, description, image_url)
where not exists (select 1 from public.solution_slides);
```

## FE 타입 매핑 (features/solution/model/types.ts)

```ts
export interface SolutionSlide {
  id: string;
  title: string;
  titleAccent: string;
  description: string;
  imageUrl: string | null;
}

export interface SolutionAdminItem extends SolutionSlide {
  sortOrder: number;
  isActive: boolean;
}
```

`getSolutionSlides()`는 `is_active = true` 행만 `sort_order asc`로, `SolutionSlide[]`로 매핑(camelCase 변환은 news의 `mapListRow`와 동일 방식).
