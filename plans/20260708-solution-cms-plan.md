# 솔루션 캐러셀 레이아웃 재배치 + 랜딩페이지 관리(CMS) 설계

## 배경

기존 `20260708-business-carousel-plan.md`로 구현된 3단 중앙 강조 캐러셀의 레이아웃을 사용자 제공 레퍼런스 이미지 기준으로 재배치하고, 데이터를 하드코딩 상수에서 Supabase 기반으로 옮겨 관리자가 콘솔에서 직접 편집할 수 있게 한다.

## 목표

1. 캐러셀 레이아웃: title을 활성 슬라이드 이미지 좌측 하단에 오버레이, 브랜드 강조, 번호(01 등) 제거, description은 기존 title 자리(무대 아래)로 이동.
2. 관리자 CMS: "랜딩페이지 관리" 콘솔 섹션 신설(확장 가능한 구조) — 이번 이터레이션은 솔루션 캐러셀 슬라이드 CRUD만 구현.

## 범위

- 수정: `src/views/landing/ui/SolutionCarousel.tsx`, `BusinessSection.tsx`, `business-solutions.data.ts`(fallback으로 재활용)
- 신규: `supabase/migrations/20260708120000_solution_slides.sql`
- 신규: `src/features/solution/**` (api/model/ui, news 슬라이스와 동일 패턴)
- 신규: `src/app/(admin)/console/(dashboard)/landing/page.tsx` (허브)
- 신규: `src/app/(admin)/console/(dashboard)/landing/solutions/page.tsx`
- 신규: `src/app/(admin)/console/(dashboard)/landing/solutions/new/page.tsx`
- 신규: `src/app/(admin)/console/(dashboard)/landing/solutions/[id]/edit/page.tsx`
- 수정: `ConsoleDashboardLayout`의 `CONSOLE_NAV`에 "랜딩페이지" 항목 추가

## 결정 사항 (사용자 확인 완료)

- 관리 범위: "랜딩페이지 관리"는 향후 Hero 등으로 확장 가능한 허브로 설계하되, 이번엔 솔루션 캐러셀만 구현.
- 이미지: Supabase Storage 업로드(news의 `uploadNewsImage` 패턴 그대로, 버킷은 `landing-images`로 신설해 향후 다른 랜딩 자산도 수용).
- 제목: `title`(기본) + `titleAccent`(브랜드 강조) 두 필드로 분리 저장. 관리자가 각각 입력.
- 번호(no): 완전 제거.

## Section 1 — 공개 캐러셀 레이아웃

`SolutionCarousel.tsx`:

- 활성 카드에만 이미지 좌측 하단 타이틀 오버레이 추가. 가독성용 스크림: `bg-linear-to-t from-ink/90 via-ink/40 to-transparent`, 좌측 하단 정렬.
  - `title`은 `text-white`, `titleAccent`는 `text-brand`로 강조.
  - 번호 표시 없음.
- 기존 "설명 hover/모바일 오버레이"(이미지 위 어둡게 덮는 방식)는 제거.
- 무대 아래 영역(현재 no/title이 있던 자리)에 활성 슬라이드의 `description`을 중앙정렬로 렌더 (`text-body-sm text-ink-soft`, `max-w-xl mx-auto`).
- 화살표(좌측 아웃라인 원형 / 우측 `bg-brand` 채움, 무대 세로 중앙 양옆)는 기존 구조 유지 — 레퍼런스와 이미 부합.
- `key`를 `solution.no` → `solution.id`로 변경.

데이터 shape 변경: `{ no, title, description, imageSrc? }` → `{ id, title, titleAccent, description, imageSrc? }`.

## Section 2 — DB 스키마 (schema.md 참조)

`plans/20260708-solution-cms-schema.md`에 상세 계약 정의. 요약:

- 테이블 `public.solution_slides` (sort_order, title, title_accent, description, image_url, is_active, created_at/updated_at)
- RLS: anon은 `is_active = true`만, authenticated는 CRUD 전체.
- Storage 버킷 `landing-images` (public read / authenticated write), 업로드 경로 `solution/{uuid}.{ext}`.
- Seed: 기존 3개 슬라이드(ENVIRONMENT + SI/R&D/CONSULTING) 이관, 기존 `/images/solution-slideN.png` 경로 그대로 사용.

## Section 3 — features/solution 슬라이스

`news` 슬라이스와 동일한 배럴 경계 원칙(서버 전용 getter/Server Action은 배럴 경유 서버 컴포넌트에서만, 클라 컴포넌트는 하위 파일 직접 import).

```
features/solution/
  api/
    getSolutionSlides.ts        공개 getter. unstable_cache + tag "solution-slides". is_active=true만, sort_order asc.
    getAdminSolutionSlides.ts   관리자 getter. 세션 클라이언트, 전체 조회(비활성 포함), sort_order asc.
    getAdminSolutionSlideById.ts
    createSolutionSlide.ts      "use server". revalidateTag.
    updateSolutionSlide.ts      "use server". revalidateTag.
    deleteSolutionSlide.ts      "use server". revalidateTag.
    reorderSolutionSlides.ts    "use server". sort_order 일괄 갱신. revalidateTag.
    uploadSolutionImage.ts      "use server". news의 uploadNewsImage 패턴(ext 화이트리스트, uuid 경로, authenticated 확인).
    solutionTag.ts              export const SOLUTION_TAG = "solution-slides"
  model/
    schema.ts    solutionFormSchema(zod): title/titleAccent/description required, imageUrl optional, isActive boolean
    types.ts     SolutionSlide, SolutionAdminItem, SolutionFormValues, SolutionMutationResult, UploadSolutionImageResult
    index.ts
  ui/
    SolutionForm.tsx        news의 NewsForm 구조 차용: title/titleAccent/description 입력 + 이미지 업로드 + 활성 토글
    SolutionAdminTable.tsx  목록 + 위/아래 순서 이동 버튼 + 수정/삭제 링크
  index.ts   공개 배럴 (news/index.ts와 동일한 서버/클라 유출 경계 주석 포함)
```

`BusinessSection.tsx`를 `async`로 전환해 `getSolutionSlides()`를 호출하고, **빈 배열이면 fallback으로 `BUSINESS_SOLUTIONS`(business-solutions.data.ts, no 제거·titleAccent 추가된 형태로 유지)** 를 사용 — 마이그레이션 미적용 상태에서도 랜딩이 깨지지 않도록.

## Section 4 — 콘솔 페이지

`ConsoleDashboardLayout`의 `CONSOLE_NAV`에 `{ label: "랜딩페이지", href: \`${ADMIN_BASE_PATH}/landing\` }` 추가.

- `/console/landing` — "랜딩페이지 관리" 허브. `ConsoleScaffold`류의 카드 레이아웃 대신, 관리 가능한 블록 목록(현재는 "솔루션 캐러셀" 카드 1개 → `/console/landing/solutions`로 링크)을 보여주는 간단한 서버 컴포넌트. 향후 Hero 등 추가 시 카드만 늘리면 됨.
- `/console/landing/solutions` — `ConsoleNewsPage`와 동일한 패턴: `getAdminSolutionSlides()` 호출 + `SolutionAdminTable` + "새 슬라이드" 버튼.
- `/console/landing/solutions/new`, `/console/landing/solutions/[id]/edit` — `SolutionForm` 배치(news의 new/edit page.tsx 패턴).

## 규칙 준수

- 토큰 하드코딩 0, `any` 금지, Props interface, FSD 정방향 import, 슬라이스는 index.ts 경유.
- RLS 전 테이블 활성화, service role key 클라이언트 미노출.
- 기존 문구(솔루션 설명 3종) 보존, seed로 그대로 이관.
- 배럴 서버 유출 경계: features/solution/index.ts는 서버 컴포넌트에서만 소비, 클라 컴포넌트(SolutionForm/SolutionAdminTable)는 하위 파일 직접 import.

## 검증

1. `npm run lint && npx tsc --noEmit` (Hook 자동 실행)
2. 마이그레이션은 사용자가 Supabase SQL Editor에서 직접 적용(news 마이그레이션과 동일 워크플로우) — 적용 전에는 fallback 데이터로 정상 렌더 확인.
3. 브라우저로 랜딩 확인: 타이틀 좌측 하단 오버레이 + 브랜드 강조 + 번호 없음, 무대 아래 description, 화살표 동작.
4. 콘솔에서 슬라이드 생성/수정/삭제/순서변경/이미지 업로드 후 공개 랜딩에 반영되는지 확인(revalidateTag 동작 확인).

## 참조 파일

- `src/features/news/**` (전체 CRUD 슬라이스 패턴 원본)
- `supabase/migrations/20260707120000_news.sql` (RLS/Storage/트리거 원본)
- `src/app/(admin)/console/(dashboard)/news/page.tsx`, `news/new/page.tsx`, `news/[id]/edit/page.tsx`
- `src/app/(admin)/console/(dashboard)/layout.tsx` (CONSOLE_NAV)
- `src/views/landing/ui/SolutionCarousel.tsx`, `BusinessSection.tsx`, `business-solutions.data.ts`
