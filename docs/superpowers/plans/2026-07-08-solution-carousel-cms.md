# Solution Carousel Layout + Landing CMS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reposition the solution carousel's title/description overlay per the reference layout (title bottom-left on the active slide with brand-accented text, number removed, description moved to the sub-stage slot) and move the carousel's data from a hardcoded constant to a Supabase-backed CMS manageable at `/console/landing`.

**Architecture:** A new `solution_slides` table (RLS + `landing-images` Storage bucket) backs a `features/solution` slice built to mirror the existing `features/news` slice exactly (server-only getters + `"use server"` mutations behind a `unstable_cache`/`revalidateTag` pair, a Zod form schema, and two client components). `BusinessSection` becomes an async server component that fetches slides and falls back to a reshaped local constant if the table is empty or unreachable. The console gets a `/console/landing` hub page (extensible to future blocks) linking to `/console/landing/solutions` for full CRUD + reordering.

**Tech Stack:** Next.js 16 App Router (Server Components + Server Actions), Supabase (Postgres + RLS + Storage + `@supabase/ssr`), TanStack Query (`useMutation` in client forms), Zod, Tailwind v4 design tokens, `motion/react`.

## Global Constraints

- No test runner exists in this repo (`package.json` has no jest/vitest/playwright) — verification per task is `npx tsc --noEmit` + `npm run lint` (already wired as a PostToolUse hook on Edit/Write) plus a concrete manual check (SQL query or browser observation). Treat these as the task's test cycle.
- No hardcoded design tokens (`bg-[#...]`, arbitrary px) — Tailwind tokens only.
- `any` is forbidden; use `unknown` + narrowing where needed.
- Component props are typed via `interface`, never inline object types.
- FSD import direction is one-way: `app → views → widgets → features → shared`. `views` may only consume `features/solution` via its `index.ts` barrel.
- Every slice barrel (`features/solution/index.ts`) bundles server-only code (`next/headers`, `"use server"`); only server components import it. Client components (`SolutionForm`, `SolutionAdminTable`) import directly from sibling files, never the barrel.
- Every new table gets RLS enabled explicitly — Supabase defaults to RLS off.
- `SUPABASE_SERVICE_ROLE_KEY` is never used in this feature (all access is anon-read / authenticated-session-write, matching `news`).
- Preserve the three existing solution copy blocks verbatim (title/description text) when moving them into the seed and fallback constant.
- Create new commits per task; do not amend.

---

### Task 1: `solution_slides` migration (schema + RLS + Storage + seed)

**Files:**
- Create: `supabase/migrations/20260708120000_solution_slides.sql`

**Interfaces:**
- Produces: table `public.solution_slides(id uuid, sort_order int, title text, title_accent text, description text, image_url text|null, is_active boolean, created_at timestamptz, updated_at timestamptz)`, RLS policies `public_read`/`admin_read`/`admin_insert`/`admin_update`/`admin_delete`, Storage bucket `landing-images` with policies `landing_images_public_read`/`landing_images_admin_insert`/`landing_images_admin_update`/`landing_images_admin_delete`. All later tasks' Supabase queries assume this exact shape.

- [ ] **Step 1: Write the migration file**

```sql
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
```

- [ ] **Step 2: Apply the migration in Supabase**

This project's migrations are applied manually (see `supabase/migrations/20260707120000_news.sql` header comment) — paste the file contents into the Supabase Dashboard SQL Editor and run it. Not automatable from this session; do this before Task 3 onward will show real data (Tasks 2 and everything through Task 11 still typecheck/lint fine without it, thanks to the Task 11 fallback).

- [ ] **Step 3: Verify in SQL Editor**

Run:
```sql
select sort_order, title, title_accent, is_active from public.solution_slides order by sort_order;
```
Expected: 3 rows — `(0, 'ENVIRONMENT', 'SI', true)`, `(1, 'ENVIRONMENT', 'R&D', true)`, `(2, 'ENVIRONMENT', 'CONSULTING', true)`.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260708120000_solution_slides.sql
git commit -m "feat: add solution_slides table, RLS, and landing-images bucket"
```

---

### Task 2: `features/solution` model layer

**Files:**
- Create: `src/features/solution/model/types.ts`
- Create: `src/features/solution/model/schema.ts`
- Create: `src/features/solution/model/index.ts`

**Interfaces:**
- Consumes: nothing (pure types/schema).
- Produces: `SolutionSlide { id, title, titleAccent, description, imageUrl }`, `SolutionAdminItem extends SolutionSlide { sortOrder, isActive }`, `SolutionRow` (snake_case DB row), `SolutionListRow` (subset for public select), `SolutionMutationResult`, `UploadSolutionImageResult`, `solutionFormSchema` (Zod) and its inferred `SolutionFormValues { title, titleAccent, description, imageUrl, isActive }`. Every later task in this plan imports these exact names.

- [ ] **Step 1: Write `model/types.ts`**

```ts
import type { SolutionFormValues } from "./schema";

/**
 * 공개 솔루션 슬라이드 shape (snake_case row → camelCase).
 */
export interface SolutionSlide {
  id: string;
  title: string;
  titleAccent: string;
  description: string;
  imageUrl: string | null;
}

/**
 * 관리자 목록 테이블용 shape(비활성 포함, 정렬/노출 정보 노출).
 */
export interface SolutionAdminItem extends SolutionSlide {
  sortOrder: number;
  isActive: boolean;
}

/**
 * `solution_slides` row(DB snake_case). gen types 도입 전 수동 정의 —
 * select 컬럼 계약과 일치.
 */
export interface SolutionRow {
  id: string;
  sort_order: number;
  title: string;
  title_accent: string;
  description: string;
  image_url: string | null;
  is_active: boolean;
}

/** 공개 목록 쿼리 결과(sort_order/is_active 제외 — 정렬/필터는 쿼리에서 이미 처리). */
export type SolutionListRow = Pick<
  SolutionRow,
  "id" | "title" | "title_accent" | "description" | "image_url"
>;

export type CreateSolutionInput = SolutionFormValues;
export type UpdateSolutionInput = SolutionFormValues;

/** Server Action(create/update/delete/reorder) 결과 shape. */
export type SolutionMutationResult =
  | { ok: true }
  | { ok: false; message: string };

/** 이미지 업로드 결과 shape. 성공 시 public URL 반환. */
export type UploadSolutionImageResult =
  | { ok: true; url: string }
  | { ok: false; message: string };
```

- [ ] **Step 2: Write `model/schema.ts`**

```ts
import { z } from "zod";

/**
 * Solution 슬라이드 폼 검증 스키마 (클라이언트 폼 · Server Action 공유 계약).
 * - title / titleAccent / description: 필수.
 * - imageUrl: 선택(빈 문자열 허용) — 저장 시 "" → null 매핑.
 * - isActive: 공개 노출 여부.
 */
export const solutionFormSchema = z.object({
  title: z.string().trim().min(1, "제목을 입력하세요"),
  titleAccent: z.string().trim().min(1, "강조 텍스트를 입력하세요"),
  description: z.string().trim().min(1, "설명을 입력하세요"),
  imageUrl: z.union([
    z.literal(""),
    z.string().url("올바른 이미지 URL 형식이 아닙니다"),
  ]),
  isActive: z.boolean(),
});

export type SolutionFormValues = z.infer<typeof solutionFormSchema>;
```

- [ ] **Step 3: Write `model/index.ts`**

```ts
export type {
  SolutionSlide,
  SolutionAdminItem,
  SolutionRow,
  SolutionListRow,
  CreateSolutionInput,
  UpdateSolutionInput,
  SolutionMutationResult,
  UploadSolutionImageResult,
} from "./types";

export { solutionFormSchema } from "./schema";
export type { SolutionFormValues } from "./schema";
```

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors referencing `src/features/solution/model/*`.

- [ ] **Step 5: Commit**

```bash
git add src/features/solution/model
git commit -m "feat: add features/solution model types and zod schema"
```

---

### Task 3: Public getter + cache tag

**Files:**
- Create: `src/features/solution/api/solutionTag.ts`
- Create: `src/features/solution/api/getSolutionSlides.ts`

**Interfaces:**
- Consumes: `SolutionSlide`, `SolutionListRow` from Task 2.
- Produces: `SOLUTION_TAG` (string constant), `getSolutionSlides(): Promise<SolutionSlide[]>`. Task 11 (`BusinessSection`) and Tasks 4–7 (mutations' `revalidateTag`) depend on these exact names.

- [ ] **Step 1: Write `api/solutionTag.ts`**

```ts
/**
 * Solution 캐시 태그(SSOT). 공개 getter의 `unstable_cache` 태그와
 * Server Action의 `revalidateTag` 대상이 이 상수를 공유한다.
 * next/headers를 import하지 않는 순수 상수 — 서버 어디서나 안전하게 참조.
 */
export const SOLUTION_TAG = "solution-slides";
```

- [ ] **Step 2: Write `api/getSolutionSlides.ts`**

```ts
import { createServerClient } from "@supabase/ssr";
import { unstable_cache } from "next/cache";
import type { SolutionListRow, SolutionSlide } from "../model/types";
import { SOLUTION_TAG } from "./solutionTag";

/**
 * 공개 Solution 슬라이드 목록 서버 getter.
 *
 * 캐싱: news getter와 동일 전략 — `unstable_cache` + 태그 `solution-slides`.
 * Server Action의 `revalidateTag(SOLUTION_TAG)`로 무효화된다.
 *
 * 세션 없는 anon 클라이언트로 읽는다(no-op 쿠키 → next/headers 미접촉 → 캐시 스코프 안전).
 * RLS `public_read`가 is_active=true만 반환하지만 방어적으로 `.eq('is_active', true)`도 건다.
 *
 * fallback: 테이블 미존재/키 미연결/쿼리 에러 시 빈 배열 반환 —
 * 호출부(BusinessSection)가 로컬 상수로 폴백한다.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

const SELECT_LIST = "id, title, title_accent, description, image_url";

function createAnonReadClient() {
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return [];
      },
      setAll() {
        /* 읽기 전용 anon 클라이언트 — 쿠키 설정 불필요 */
      },
    },
  });
}

function mapRow(row: SolutionListRow): SolutionSlide {
  return {
    id: row.id,
    title: row.title,
    titleAccent: row.title_accent,
    description: row.description,
    imageUrl: row.image_url,
  };
}

const cachedSolutionSlides = unstable_cache(
  async (): Promise<SolutionSlide[]> => {
    try {
      const supabase = createAnonReadClient();
      const { data, error } = await supabase
        .from("solution_slides")
        .select(SELECT_LIST)
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .returns<SolutionListRow[]>();

      if (error || !data) return [];

      return data.map(mapRow);
    } catch {
      return [];
    }
  },
  ["solution-slides-list"],
  { tags: [SOLUTION_TAG] },
);

export async function getSolutionSlides(): Promise<SolutionSlide[]> {
  return cachedSolutionSlides();
}
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/features/solution/api/solutionTag.ts src/features/solution/api/getSolutionSlides.ts
git commit -m "feat: add public getSolutionSlides getter with cache tag"
```

---

### Task 4: Admin read getters

**Files:**
- Create: `src/features/solution/api/getAdminSolutionSlides.ts`
- Create: `src/features/solution/api/getAdminSolutionSlideById.ts`

**Interfaces:**
- Consumes: `SolutionAdminItem`, `SolutionRow`, `SolutionFormValues` from Task 2; `createServerSupabaseClient` from `@/shared/api/supabaseServerClient`.
- Produces: `getAdminSolutionSlides(): Promise<SolutionAdminItem[]>`, `getAdminSolutionSlideById(id: string): Promise<SolutionFormValues | null>`. Consumed by Task 13's console pages.

- [ ] **Step 1: Write `api/getAdminSolutionSlides.ts`**

```ts
import { createServerSupabaseClient } from "@/shared/api/supabaseServerClient";
import type { SolutionAdminItem, SolutionRow } from "../model/types";

/**
 * 관리자 콘솔 Solution 목록 getter(비활성 포함 전체).
 *
 * 공개 getter와 달리 로그인 세션 클라이언트를 쓴다 → RLS `admin_read`로
 * authenticated 롤이 비활성 슬라이드까지 전체 조회한다. 관리 목록은 항상 최신을
 * 보여야 하므로 unstable_cache로 감싸지 않는다(요청마다 조회).
 *
 * fallback: 에러/미연결 시 빈 배열 반환(관리 화면이 깨지지 않도록).
 */
export async function getAdminSolutionSlides(): Promise<SolutionAdminItem[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("solution_slides")
      .select(
        "id, sort_order, title, title_accent, description, image_url, is_active",
      )
      .order("sort_order", { ascending: true })
      .returns<SolutionRow[]>();

    if (error || !data) return [];

    return data.map((row) => ({
      id: row.id,
      title: row.title,
      titleAccent: row.title_accent,
      description: row.description,
      imageUrl: row.image_url,
      sortOrder: row.sort_order,
      isActive: row.is_active,
    }));
  } catch {
    return [];
  }
}
```

- [ ] **Step 2: Write `api/getAdminSolutionSlideById.ts`**

```ts
import { createServerSupabaseClient } from "@/shared/api/supabaseServerClient";
import type { SolutionFormValues } from "../model/types";

/**
 * 관리자 수정 폼 초기값 getter(비활성 포함, id 기준).
 *
 * 로그인 세션 클라이언트 → RLS `admin_read`로 비활성 슬라이드까지 단건 조회.
 * 반환은 폼 값 형태(SolutionFormValues)로 매핑해 SolutionForm 프리필에 바로 사용한다
 * (null 컬럼은 빈 문자열로 폴백).
 *
 * fallback: 미존재/에러/미연결 시 null 반환 — 호출부(edit page)가 notFound() 처리.
 */

interface AdminDetailRow {
  title: string;
  title_accent: string;
  description: string;
  image_url: string | null;
  is_active: boolean;
}

export async function getAdminSolutionSlideById(
  id: string,
): Promise<SolutionFormValues | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("solution_slides")
      .select("title, title_accent, description, image_url, is_active")
      .eq("id", id)
      .single<AdminDetailRow>();

    if (error || !data) return null;

    return {
      title: data.title,
      titleAccent: data.title_accent,
      description: data.description,
      imageUrl: data.image_url ?? "",
      isActive: data.is_active,
    };
  } catch {
    return null;
  }
}
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/features/solution/api/getAdminSolutionSlides.ts src/features/solution/api/getAdminSolutionSlideById.ts
git commit -m "feat: add admin getSolutionSlides list and by-id getters"
```

---

### Task 5: Create/update/delete mutations

**Files:**
- Create: `src/features/solution/api/createSolutionSlide.ts`
- Create: `src/features/solution/api/updateSolutionSlide.ts`
- Create: `src/features/solution/api/deleteSolutionSlide.ts`

**Interfaces:**
- Consumes: `solutionFormSchema`, `CreateSolutionInput`, `UpdateSolutionInput`, `SolutionMutationResult` from Task 2; `SOLUTION_TAG` from Task 3.
- Produces: `createSolutionSlide(input): Promise<SolutionMutationResult>`, `updateSolutionSlide(id, input): Promise<SolutionMutationResult>`, `deleteSolutionSlide(id): Promise<SolutionMutationResult>`. Consumed by Task 8 (`SolutionForm`) and Task 9 (`SolutionAdminTable`).

- [ ] **Step 1: Write `api/createSolutionSlide.ts`**

```ts
"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { createServerSupabaseClient } from "@/shared/api/supabaseServerClient";
import { solutionFormSchema } from "../model/schema";
import type {
  CreateSolutionInput,
  SolutionMutationResult,
} from "../model/types";
import { SOLUTION_TAG } from "./solutionTag";

/**
 * Solution 슬라이드 생성 Server Action.
 *
 * 인가: 세션 클라이언트로 `getUser()` 확인(미인증 거부). service_role 금지 —
 *   RLS `admin_insert`가 authenticated 세션을 검증한다.
 * 검증: 클라 입력을 신뢰하지 않고 zod로 재파싱.
 * sort_order: 현재 최대값 + 1(목록 맨 뒤에 추가). 순서 변경은 reorderSolutionSlides가 담당.
 * 무효화: 성공 시 태그 + 랜딩 경로 revalidate.
 */
export async function createSolutionSlide(
  input: CreateSolutionInput,
): Promise<SolutionMutationResult> {
  const parsed = solutionFormSchema.safeParse(input);
  if (!parsed.success) {
    const first =
      parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다.";
    return { ok: false, message: first };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { ok: false, message: "인증이 필요합니다. 다시 로그인해 주세요." };
  }

  const { data: last } = await supabase
    .from("solution_slides")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle<{ sort_order: number }>();

  const nextSortOrder = (last?.sort_order ?? -1) + 1;

  const v = parsed.data;
  const { error } = await supabase.from("solution_slides").insert({
    sort_order: nextSortOrder,
    title: v.title,
    title_accent: v.titleAccent,
    description: v.description,
    image_url: v.imageUrl ? v.imageUrl : null,
    is_active: v.isActive,
  });

  if (error) {
    return { ok: false, message: "저장에 실패했습니다. 잠시 후 다시 시도해 주세요." };
  }

  revalidateTag(SOLUTION_TAG, "max");
  revalidatePath("/");

  return { ok: true };
}
```

- [ ] **Step 2: Write `api/updateSolutionSlide.ts`**

```ts
"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { createServerSupabaseClient } from "@/shared/api/supabaseServerClient";
import { solutionFormSchema } from "../model/schema";
import type {
  SolutionMutationResult,
  UpdateSolutionInput,
} from "../model/types";
import { SOLUTION_TAG } from "./solutionTag";

/**
 * Solution 슬라이드 수정 Server Action(id 기준).
 *
 * 인가: 세션 클라이언트 `getUser()`(미인증 거부). service_role 금지 — RLS `admin_update`.
 * 검증: zod 재파싱. sort_order는 건드리지 않는다(reorderSolutionSlides 전담).
 * 무효화: 태그 + 랜딩 경로 revalidate.
 */
export async function updateSolutionSlide(
  id: string,
  input: UpdateSolutionInput,
): Promise<SolutionMutationResult> {
  const parsed = solutionFormSchema.safeParse(input);
  if (!parsed.success) {
    const first =
      parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다.";
    return { ok: false, message: first };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { ok: false, message: "인증이 필요합니다. 다시 로그인해 주세요." };
  }

  const v = parsed.data;
  const { error } = await supabase
    .from("solution_slides")
    .update({
      title: v.title,
      title_accent: v.titleAccent,
      description: v.description,
      image_url: v.imageUrl ? v.imageUrl : null,
      is_active: v.isActive,
    })
    .eq("id", id);

  if (error) {
    return { ok: false, message: "저장에 실패했습니다. 잠시 후 다시 시도해 주세요." };
  }

  revalidateTag(SOLUTION_TAG, "max");
  revalidatePath("/");

  return { ok: true };
}
```

- [ ] **Step 3: Write `api/deleteSolutionSlide.ts`**

```ts
"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { createServerSupabaseClient } from "@/shared/api/supabaseServerClient";
import type { SolutionMutationResult } from "../model/types";
import { SOLUTION_TAG } from "./solutionTag";

/**
 * Solution 슬라이드 삭제 Server Action(id 기준).
 *
 * 인가: 세션 클라이언트 `getUser()`(미인증 거부). service_role 금지 — RLS `admin_delete`.
 * 무효화: 태그 + 랜딩 경로 revalidate.
 */
export async function deleteSolutionSlide(
  id: string,
): Promise<SolutionMutationResult> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { ok: false, message: "인증이 필요합니다. 다시 로그인해 주세요." };
  }

  const { error } = await supabase
    .from("solution_slides")
    .delete()
    .eq("id", id);

  if (error) {
    return { ok: false, message: "삭제에 실패했습니다. 잠시 후 다시 시도해 주세요." };
  }

  revalidateTag(SOLUTION_TAG, "max");
  revalidatePath("/");

  return { ok: true };
}
```

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/features/solution/api/createSolutionSlide.ts src/features/solution/api/updateSolutionSlide.ts src/features/solution/api/deleteSolutionSlide.ts
git commit -m "feat: add create/update/delete Server Actions for solution slides"
```

---

### Task 6: Reorder mutation

**Files:**
- Create: `src/features/solution/api/reorderSolutionSlides.ts`

**Interfaces:**
- Consumes: `SolutionMutationResult` from Task 2; `SOLUTION_TAG` from Task 3.
- Produces: `reorderSolutionSlides(orderedIds: readonly string[]): Promise<SolutionMutationResult>`. Consumed by Task 9 (`SolutionAdminTable`'s up/down buttons).

- [ ] **Step 1: Write `api/reorderSolutionSlides.ts`**

```ts
"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { createServerSupabaseClient } from "@/shared/api/supabaseServerClient";
import type { SolutionMutationResult } from "../model/types";
import { SOLUTION_TAG } from "./solutionTag";

/**
 * 슬라이드 순서 일괄 갱신 Server Action.
 * orderedIds는 원하는 최종 순서의 id 배열 — 배열 인덱스를 그대로 sort_order로 저장한다.
 * 인가: 세션 클라이언트 `getUser()`(미인증 거부). service_role 금지 — RLS `admin_update`.
 */
export async function reorderSolutionSlides(
  orderedIds: readonly string[],
): Promise<SolutionMutationResult> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { ok: false, message: "인증이 필요합니다. 다시 로그인해 주세요." };
  }

  const results = await Promise.all(
    orderedIds.map((id, index) =>
      supabase
        .from("solution_slides")
        .update({ sort_order: index })
        .eq("id", id),
    ),
  );

  const failed = results.find((r) => r.error);
  if (failed) {
    return { ok: false, message: "순서 변경에 실패했습니다. 잠시 후 다시 시도해 주세요." };
  }

  revalidateTag(SOLUTION_TAG, "max");
  revalidatePath("/");

  return { ok: true };
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/features/solution/api/reorderSolutionSlides.ts
git commit -m "feat: add reorderSolutionSlides Server Action"
```

---

### Task 7: Image upload Server Action

**Files:**
- Create: `src/features/solution/api/uploadSolutionImage.ts`

**Interfaces:**
- Consumes: `UploadSolutionImageResult` from Task 2.
- Produces: `uploadSolutionImage(formData: FormData): Promise<UploadSolutionImageResult>`. Consumed by Task 8 (`SolutionForm`).

- [ ] **Step 1: Write `api/uploadSolutionImage.ts`**

```ts
"use server";

import { createServerSupabaseClient } from "@/shared/api/supabaseServerClient";
import type { UploadSolutionImageResult } from "../model/types";

/**
 * Solution 슬라이드 이미지 업로드 Server Action.
 *
 * 인가: 세션 클라이언트 `getUser()`(미인증 거부). service_role 금지 —
 *   Storage `landing-images` write 정책이 authenticated 롤을 요구한다.
 * 경로: `solution/{uuid}.{ext}` — 원본 파일명 대신 새 uuid로 생성(충돌·경로주입 방지).
 * ext 화이트리스트로 제한. 성공 시 getPublicUrl로 public URL 반환.
 */

const ALLOWED_EXT = ["png", "jpg", "jpeg", "webp", "gif", "avif"] as const;
const MIME_TO_EXT: Record<string, (typeof ALLOWED_EXT)[number]> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

function resolveExt(file: File): string | null {
  const nameExt = file.name.split(".").pop()?.toLowerCase() ?? "";
  if ((ALLOWED_EXT as readonly string[]).includes(nameExt)) return nameExt;
  return MIME_TO_EXT[file.type] ?? null;
}

export async function uploadSolutionImage(
  formData: FormData,
): Promise<UploadSolutionImageResult> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "업로드할 이미지 파일이 필요합니다." };
  }

  const ext = resolveExt(file);
  if (!ext) {
    return {
      ok: false,
      message: "지원하지 않는 이미지 형식입니다. (png, jpg, webp, gif, avif)",
    };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { ok: false, message: "인증이 필요합니다. 다시 로그인해 주세요." };
  }

  const path = `solution/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from("landing-images")
    .upload(path, file, { upsert: false, contentType: file.type });

  if (error) {
    return {
      ok: false,
      message: "이미지 업로드에 실패했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }

  const { data } = supabase.storage.from("landing-images").getPublicUrl(path);
  return { ok: true, url: data.publicUrl };
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/features/solution/api/uploadSolutionImage.ts
git commit -m "feat: add uploadSolutionImage Server Action for landing-images bucket"
```

---

### Task 8: `SolutionForm` client component

**Files:**
- Create: `src/features/solution/ui/SolutionForm.tsx`

**Interfaces:**
- Consumes (direct file imports, not barrel): `solutionFormSchema`, `SolutionFormValues` from `../model/schema`; `createSolutionSlide` from `../api/createSolutionSlide`; `updateSolutionSlide` from `../api/updateSolutionSlide`; `uploadSolutionImage` from `../api/uploadSolutionImage`; `Button`, `SectionLabel` from `@/shared/ui`; `ADMIN_BASE_PATH` from `@/shared/constants`.
- Produces: `SolutionForm({ mode, slideId?, initialValues? })` component and `SolutionFormProps` type. Consumed by Task 13's new/edit console pages.

- [ ] **Step 1: Write `ui/SolutionForm.tsx`**

```tsx
"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { Button, SectionLabel } from "@/shared/ui";
import { ADMIN_BASE_PATH } from "@/shared/constants";
// 배럴 서버유출 방지: 클라 컴포넌트이므로 features/solution 배럴 대신 하위 파일에서 직접 import.
import { solutionFormSchema, type SolutionFormValues } from "../model/schema";
import { createSolutionSlide } from "../api/createSolutionSlide";
import { updateSolutionSlide } from "../api/updateSolutionSlide";
import { uploadSolutionImage } from "../api/uploadSolutionImage";

export interface SolutionFormProps {
  /** create: 신규 등록 / update: 기존 슬라이드 수정. */
  mode: "create" | "update";
  /** update 모드에서 대상 슬라이드 id. */
  slideId?: string;
  /** update 모드 프리필 값. */
  initialValues?: SolutionFormValues;
}

const INPUT_CLASS =
  "w-full rounded-card border border-hairline bg-surface px-4 py-3 text-sm text-ink outline-none transition-colors duration-fast ease-out placeholder:text-muted focus:border-brand";
const LABEL_CLASS = "text-detail font-medium text-ink-soft";
const MESSAGE_ERROR_CLASS =
  "rounded-card border border-hairline px-4 py-3 text-detail text-danger";

function emptyValues(): SolutionFormValues {
  return {
    title: "",
    titleAccent: "",
    description: "",
    imageUrl: "",
    isActive: true,
  };
}

/**
 * Solution 슬라이드 등록/수정 폼("use client").
 * 제목·강조 텍스트·설명·이미지 업로드·노출 토글을 조합하고 create/update
 * Server Action을 호출한다. 성공 시 관리 목록으로 라우팅한다.
 */
export function SolutionForm({
  mode,
  slideId,
  initialValues,
}: SolutionFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<SolutionFormValues>(
    () => initialValues ?? emptyValues(),
  );
  const [validationError, setValidationError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: (payload: SolutionFormValues) =>
      mode === "update" && slideId
        ? updateSolutionSlide(slideId, payload)
        : createSolutionSlide(payload),
    onSuccess: (result) => {
      if (result.ok) {
        router.push(`${ADMIN_BASE_PATH}/landing/solutions`);
        router.refresh();
      }
    },
  });

  const setField = <K extends keyof SolutionFormValues>(
    name: K,
    value: SolutionFormValues[K],
  ) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setImageError(null);
    setIsImageUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadSolutionImage(formData);
      if (!result.ok) {
        setImageError(result.message);
        return;
      }
      setField("imageUrl", result.url);
    } catch {
      setImageError("이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setIsImageUploading(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError(null);

    const parsed = solutionFormSchema.safeParse(values);
    if (!parsed.success) {
      setValidationError(
        parsed.error.issues[0]?.message ?? "입력값을 확인해 주세요.",
      );
      return;
    }

    mutation.mutate(parsed.data);
  };

  const result = mutation.data;
  const isServerError = result?.ok === false;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <fieldset className="border-0 p-0">
        <legend className="mb-5 p-0">
          <SectionLabel color="olive" size="sm">
            기본 정보
          </SectionLabel>
        </legend>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="solution-title" className={LABEL_CLASS}>
              제목
              <span className="text-danger" aria-hidden>
                {" *"}
              </span>
            </label>
            <input
              id="solution-title"
              name="title"
              required
              value={values.title}
              onChange={(e) => setField("title", e.target.value)}
              placeholder="예: ENVIRONMENT"
              className={INPUT_CLASS}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="solution-title-accent" className={LABEL_CLASS}>
              강조 텍스트 (브랜드 색상)
              <span className="text-danger" aria-hidden>
                {" *"}
              </span>
            </label>
            <input
              id="solution-title-accent"
              name="titleAccent"
              required
              value={values.titleAccent}
              onChange={(e) => setField("titleAccent", e.target.value)}
              placeholder="예: SI"
              className={INPUT_CLASS}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="solution-description" className={LABEL_CLASS}>
              설명
              <span className="text-danger" aria-hidden>
                {" *"}
              </span>
            </label>
            <textarea
              id="solution-description"
              name="description"
              required
              rows={4}
              value={values.description}
              onChange={(e) => setField("description", e.target.value)}
              className={`${INPUT_CLASS} resize-y`}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="border-0 p-0">
        <legend className="mb-5 p-0">
          <SectionLabel color="olive" size="sm">
            이미지
          </SectionLabel>
        </legend>

        <div className="flex flex-col gap-3">
          {values.imageUrl ? (
            <div className="relative aspect-4/3 w-full max-w-md overflow-hidden rounded-card border border-hairline">
              <Image
                src={values.imageUrl}
                alt="슬라이드 이미지 미리보기"
                fill
                sizes="(max-width: 448px) 100vw, 448px"
                className="object-cover"
                unoptimized
              />
            </div>
          ) : null}

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline-light"
              size="sm"
              disabled={isImageUploading}
              onClick={() => imageInputRef.current?.click()}
            >
              {isImageUploading ? "업로드 중..." : "이미지 업로드"}
            </Button>
            {values.imageUrl ? (
              <Button
                type="button"
                variant="outline-light"
                size="sm"
                onClick={() => setField("imageUrl", "")}
              >
                제거
              </Button>
            ) : null}
          </div>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
            className="hidden"
            onChange={handleImageChange}
          />
          {imageError && (
            <p role="alert" className="text-detail text-danger">
              {imageError}
            </p>
          )}
        </div>
      </fieldset>

      <fieldset className="border-0 p-0">
        <legend className="mb-5 p-0">
          <SectionLabel color="olive" size="sm">
            노출
          </SectionLabel>
        </legend>
        <label className="flex items-center gap-3 text-sm text-ink">
          <input
            type="checkbox"
            checked={values.isActive}
            onChange={(e) => setField("isActive", e.target.checked)}
            className="size-4"
          />
          공개 사이트에 노출 (체크 해제 시 숨김)
        </label>
      </fieldset>

      {validationError && (
        <p role="alert" className={MESSAGE_ERROR_CLASS}>
          {validationError}
        </p>
      )}
      {isServerError && (
        <p role="alert" className={MESSAGE_ERROR_CLASS}>
          {result.message}
        </p>
      )}
      {mutation.isError && (
        <p role="alert" className={MESSAGE_ERROR_CLASS}>
          저장 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
        </p>
      )}

      <div className="flex items-center gap-4 border-t border-hairline pt-6">
        <Button
          type="submit"
          variant="dark"
          size="md"
          disabled={mutation.isPending}
        >
          {mutation.isPending
            ? "저장 중..."
            : mode === "update"
              ? "수정 저장"
              : "등록"}
        </Button>
        <Button
          type="button"
          variant="outline-light"
          size="sm"
          onClick={() => router.push(`${ADMIN_BASE_PATH}/landing/solutions`)}
        >
          취소
        </Button>
      </div>
    </form>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/features/solution/ui/SolutionForm.tsx
git commit -m "feat: add SolutionForm client component"
```

---

### Task 9: `SolutionAdminTable` client component

**Files:**
- Create: `src/features/solution/ui/SolutionAdminTable.tsx`

**Interfaces:**
- Consumes (direct file imports): `SolutionAdminItem` from `../model/types`; `deleteSolutionSlide` from `../api/deleteSolutionSlide`; `reorderSolutionSlides` from `../api/reorderSolutionSlides`; `Badge` from `@/shared/ui`; `ADMIN_BASE_PATH` from `@/shared/constants`.
- Produces: `SolutionAdminTable({ items })` component and `SolutionAdminTableProps` type. Consumed by Task 13's list console page.

- [ ] **Step 1: Write `ui/SolutionAdminTable.tsx`**

```tsx
"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ADMIN_BASE_PATH } from "@/shared/constants";
import { Badge } from "@/shared/ui";
// 배럴 서버유출 방지: 클라 컴포넌트이므로 하위 파일에서 직접 import.
import type { SolutionAdminItem } from "../model/types";
import { deleteSolutionSlide } from "../api/deleteSolutionSlide";
import { reorderSolutionSlides } from "../api/reorderSolutionSlides";

export interface SolutionAdminTableProps {
  items: readonly SolutionAdminItem[];
}

const CELL_CLASS = "px-4 py-3 text-sm text-ink";
const HEAD_CLASS = "px-4 py-3 text-detail font-medium text-ink-soft text-left";
const ACTION_LINK_CLASS =
  "text-detail font-medium text-olive-label transition-colors duration-fast ease-out hover:text-ink";
const ORDER_BUTTON_CLASS =
  "flex size-7 items-center justify-center rounded-card border border-hairline text-ink-soft transition-colors duration-fast ease-out hover:border-brand hover:text-brand disabled:opacity-30 disabled:pointer-events-none";

/**
 * 관리자 Solution 슬라이드 목록 테이블("use client").
 * 순서(위/아래 이동)·제목(강조 텍스트 포함)·노출상태·수정 링크·삭제를 렌더한다.
 * 순서 변경/삭제는 Server Action 호출 후 router.refresh로 목록을 갱신한다.
 */
export function SolutionAdminTable({ items }: SolutionAdminTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sorted = [...items].sort((a, b) => a.sortOrder - b.sortOrder);

  const handleDelete = (item: SolutionAdminItem) => {
    const confirmed = window.confirm(
      `"${item.title} ${item.titleAccent}" 슬라이드를 삭제하시겠습니까? 되돌릴 수 없습니다.`,
    );
    if (!confirmed) return;

    setError(null);
    setBusyId(item.id);
    startTransition(async () => {
      const result = await deleteSolutionSlide(item.id);
      setBusyId(null);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      router.refresh();
    });
  };

  const handleMove = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;

    const nextOrder = [...sorted];
    const [moved] = nextOrder.splice(index, 1);
    nextOrder.splice(targetIndex, 0, moved);

    setError(null);
    setBusyId(moved.id);
    startTransition(async () => {
      const result = await reorderSolutionSlides(nextOrder.map((s) => s.id));
      setBusyId(null);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      router.refresh();
    });
  };

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-card border border-dashed border-hairline bg-surface-white px-8 py-14 text-center">
        <span className="text-detail font-medium text-ink-soft">
          등록된 슬라이드가 없습니다.
        </span>
        <span className="text-meta text-muted">
          우측 상단의 &quot;새 슬라이드&quot; 버튼으로 첫 슬라이드를 등록하세요.
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {error && (
        <p role="alert" className="text-detail text-danger">
          {error}
        </p>
      )}
      <div className="overflow-x-auto rounded-card border border-hairline bg-surface-white">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-hairline">
              <th className={HEAD_CLASS}>순서</th>
              <th className={HEAD_CLASS}>제목</th>
              <th className={HEAD_CLASS}>노출</th>
              <th className={`${HEAD_CLASS} text-right`}>관리</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((item, index) => (
              <tr
                key={item.id}
                className="border-b border-hairline last:border-b-0"
              >
                <td className={CELL_CLASS}>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      aria-label="위로 이동"
                      disabled={index === 0 || (isPending && busyId === item.id)}
                      onClick={() => handleMove(index, -1)}
                      className={ORDER_BUTTON_CLASS}
                    >
                      &#8593;
                    </button>
                    <button
                      type="button"
                      aria-label="아래로 이동"
                      disabled={
                        index === sorted.length - 1 ||
                        (isPending && busyId === item.id)
                      }
                      onClick={() => handleMove(index, 1)}
                      className={ORDER_BUTTON_CLASS}
                    >
                      &#8595;
                    </button>
                  </div>
                </td>
                <td className={CELL_CLASS}>
                  <span className="font-medium">
                    {item.title}{" "}
                    <span className="text-brand">{item.titleAccent}</span>
                  </span>
                </td>
                <td className={CELL_CLASS}>
                  <Badge variant={item.isActive ? "active" : "muted"}>
                    {item.isActive ? "노출" : "숨김"}
                  </Badge>
                </td>
                <td className={`${CELL_CLASS} text-right`}>
                  <div className="inline-flex items-center gap-4">
                    <Link
                      href={`${ADMIN_BASE_PATH}/landing/solutions/${item.id}/edit`}
                      className={ACTION_LINK_CLASS}
                    >
                      수정
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      disabled={isPending && busyId === item.id}
                      className="text-detail font-medium text-danger transition-colors duration-fast ease-out hover:opacity-80 disabled:opacity-50"
                    >
                      {isPending && busyId === item.id ? "처리 중..." : "삭제"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/features/solution/ui/SolutionAdminTable.tsx
git commit -m "feat: add SolutionAdminTable client component with reorder controls"
```

---

### Task 10: `features/solution` public barrel

**Files:**
- Create: `src/features/solution/index.ts`

**Interfaces:**
- Consumes: every export from Tasks 2–9.
- Produces: the slice's public API. Consumed by Task 11 (`BusinessSection`, type-only) and Task 13 (console pages, server-only).

- [ ] **Step 1: Write `index.ts`**

```ts
/**
 * features/solution Public API.
 *
 * ⚠️ 배럴 서버/클라 유출 경계 (news/index.ts 주석과 동일 원리)
 * 이 배럴은 서버 전용 getter(unstable_cache · next/headers · anon/세션 서버 클라이언트),
 * Server Action('use server'), 그리고 클라이언트 컴포넌트(SolutionForm/SolutionAdminTable)를
 * 함께 노출한다. 배럴에서 무엇이든 import하면 번들러가 배럴 모듈 그래프 전체(=서버 전용 코드)를
 * 끌어오므로, **이 배럴은 서버 컴포넌트(page/view)에서만 소비한다.**
 *
 * 클라이언트 컴포넌트(SolutionForm/SolutionAdminTable)는 이 배럴을 import하지 않고
 * 필요한 model/Server Action을 하위 파일에서 직접 import한다(각 파일 상단 주석 참조).
 * 뷰 레이어의 fallback 상수(business-solutions.data.ts)는 타입만 필요하므로
 * `import type`으로 `./model/types`를 직접 참조한다(런타임 코드 미포함, 배럴 우회).
 */

// 서버 전용 getter (next/headers · unstable_cache 경유) — 서버 컴포넌트에서만 소비
export { getSolutionSlides } from "./api/getSolutionSlides";
export { getAdminSolutionSlides } from "./api/getAdminSolutionSlides";
export { getAdminSolutionSlideById } from "./api/getAdminSolutionSlideById";

// Server Actions ('use server')
export { createSolutionSlide } from "./api/createSolutionSlide";
export { updateSolutionSlide } from "./api/updateSolutionSlide";
export { deleteSolutionSlide } from "./api/deleteSolutionSlide";
export { reorderSolutionSlides } from "./api/reorderSolutionSlides";
export { uploadSolutionImage } from "./api/uploadSolutionImage";

// 클라이언트 컴포넌트 — 서버 컴포넌트(page)에서 렌더 지점에 배치
export { SolutionForm } from "./ui/SolutionForm";
export type { SolutionFormProps } from "./ui/SolutionForm";
export { SolutionAdminTable } from "./ui/SolutionAdminTable";
export type { SolutionAdminTableProps } from "./ui/SolutionAdminTable";

// model 타입/스키마 (순수 · 클라/서버 안전)
export type {
  SolutionSlide,
  SolutionAdminItem,
  SolutionFormValues,
  SolutionMutationResult,
  UploadSolutionImageResult,
} from "./model";
export { solutionFormSchema } from "./model";
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/features/solution/index.ts
git commit -m "feat: add features/solution public barrel"
```

---

### Task 11: Reshape carousel data + rework `SolutionCarousel` layout

**Files:**
- Modify: `src/views/landing/ui/business-solutions.data.ts`
- Modify: `src/views/landing/ui/SolutionCarousel.tsx`

**Interfaces:**
- Consumes: `SolutionSlide` type from `@/features/solution/model/types` (type-only import, no runtime barrel pull).
- Produces: `BUSINESS_SOLUTIONS: readonly SolutionSlide[]` (fallback constant, reshaped: `no` removed, `titleAccent` added, `imageSrc` renamed to `imageUrl` to match `SolutionSlide`); `SolutionCarousel({ solutions: readonly SolutionSlide[] })` with the new bottom-left title overlay + sub-stage description. Consumed by Task 12 (`BusinessSection`).

- [ ] **Step 1: Rewrite `business-solutions.data.ts`**

```ts
/**
 * About Business 솔루션 캐러셀 fallback 데이터 (뷰-로컬 상수).
 * Supabase `solution_slides` 테이블이 비어있거나(마이그레이션 미적용) 조회 실패 시
 * BusinessSection이 이 상수로 폴백한다. 관리자 콘솔(/console/landing/solutions)에서
 * 실제 데이터를 관리하며, 이 상수는 최초 seed와 동일한 문구를 보존한다.
 */
import type { SolutionSlide } from "@/features/solution/model/types";

export const BUSINESS_SOLUTIONS: readonly SolutionSlide[] = [
  {
    id: "fallback-si",
    title: "ENVIRONMENT",
    titleAccent: "SI",
    description:
      "환경IT서비스 전문기업으로 대국민 서비스, 행정업무 통합관리 등 효율적인 시스템 구축과 환경 정보시스템에 관한 기획에서부터 개발과 구축, 운영까지의 모든 서비스를 제공합니다.",
    imageUrl: "/images/solution-slide1.png",
  },
  {
    id: "fallback-rd",
    title: "ENVIRONMENT",
    titleAccent: "R&D",
    description:
      "환경의 변화, 그것에 대응하는 기초연구와 응용화 연구를 통한 환경IT 관련 기술개발의 리스크를 줄이고 성공 가능성을 높이기 위해 전문가 그룹이 끊임없이 연구합니다.",
    imageUrl: "/images/solution-slide2.png",
  },
  {
    id: "fallback-consulting",
    title: "ENVIRONMENT",
    titleAccent: "CONSULTING",
    description:
      "환경IT 관련 기술개발 프로젝트 수행 경험이 풍부한 전문 그룹과 조직을 바탕으로 차별화된 컨설팅을 제공, 다양한 환경 분야 프로젝트에 최적화된 사업 수행을 제공합니다.",
    imageUrl: "/images/solution-slide3.png",
  },
];
```

- [ ] **Step 2: Rewrite `SolutionCarousel.tsx`**

```tsx
"use client";

import Image from "next/image";
import { useCallback, useState, useSyncExternalStore } from "react";
import { motion } from "motion/react";

import type { SolutionSlide } from "@/features/solution/model/types";

export interface SolutionCarouselProps {
  solutions: readonly SolutionSlide[];
}

/**
 * 솔루션별 배경 구분 틴트 — 실제 이미지(imageUrl) 미확보 시 카드 이미지 영역을
 * 가시화하기 위한 placeholder. imageUrl을 채우면 next/image가 이 위를 덮으므로
 * 실제 이미지로 자연스럽게 대체된다. 기존 토큰만 사용.
 */
const SOLUTION_BG_TINT = [
  "bg-linear-to-tr from-brand/25 via-transparent to-transparent",
  "bg-linear-to-tl from-accent/20 via-transparent to-transparent",
  "bg-linear-to-t from-olive/30 via-transparent to-transparent",
];

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/** matchMedia 구독 — reduced-motion 변경 시 리렌더 트리거. */
function subscribeReducedMotion(onChange: () => void) {
  const mql = window.matchMedia(REDUCED_MOTION_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/** SSR 스냅샷 — 서버에서는 모션 허용을 기본값으로. */
function getReducedMotionServerSnapshot() {
  return false;
}

/** active 기준 원형 상대 오프셋(-1: 좌, 0: 중앙, 1: 우)으로 정규화. */
function getRelativeOffset(index: number, active: number, len: number) {
  const half = Math.floor(len / 2);
  let offset = index - active;
  if (offset > half) offset -= len;
  if (offset < -half) offset += len;
  return offset;
}

/**
 * 솔루션 3단 중앙 강조 캐러셀 (수동 화살표 전용, autoplay 없음).
 * - activeIndex state + prev/next 무한 루프((i + len) % len).
 * - active 카드 중앙 크게, 좌우 인접 카드는 축소·저대비·부분 노출(peek).
 * - active 카드에만 이미지 좌측 하단 title 오버레이(강조 텍스트 titleAccent는 브랜드 색상).
 * - 설명(description)은 무대 아래 활성 슬라이드 기준으로 중앙 노출.
 * - prefers-reduced-motion 시 전환 애니메이션 무모션 처리.
 */
export function SolutionCarousel({ solutions }: SolutionCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const len = solutions.length;

  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + len) % len);
  }, [len]);

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i + 1) % len);
  }, [len]);

  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const };

  const activeSolution = solutions[activeIndex];

  return (
    <div className="relative mx-auto max-w-5xl">
      {/* 카드 무대 — overflow-hidden으로 좌우 peek 카드를 부분 노출(clip). 화살표는 무대 세로 중앙 양옆 */}
      <div className="relative h-60 overflow-hidden sm:h-72 lg:h-88">
        {solutions.map((solution, index) => {
          const offset = getRelativeOffset(index, activeIndex, len);
          const isActive = offset === 0;
          const tint = SOLUTION_BG_TINT[index % SOLUTION_BG_TINT.length] ?? "";
          return (
            <motion.article
              key={solution.id}
              className="absolute top-1/2 left-1/2 w-72 origin-center sm:w-80 lg:w-96"
              style={{ zIndex: len - Math.abs(offset) }}
              initial={false}
              animate={{
                x: `${-50 + offset * 58}%`,
                y: "-50%",
                scale: isActive ? 1 : 0.82,
                opacity: isActive ? 1 : 0.35,
              }}
              transition={transition}
            >
              {/* 이미지 영역 — placeholder 배경 + imageUrl 있으면 next/image로 덮음 */}
              <div className="relative aspect-4/3 overflow-hidden rounded-image bg-ink">
                <div className={`absolute inset-0 ${tint}`} aria-hidden />
                {solution.imageUrl && (
                  <Image
                    src={solution.imageUrl}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 24rem, (min-width: 640px) 20rem, 18rem"
                    className="object-cover"
                  />
                )}

                {/* 타이틀 오버레이 — active 카드에만 노출, 좌측 하단, 가독성 스크림 */}
                {isActive && (
                  <div className="absolute inset-0 flex items-end bg-linear-to-t from-ink/90 via-ink/40 to-transparent p-5 sm:p-6">
                    <h3 className="font-display text-lg font-bold tracking-headline text-white sm:text-xl">
                      {solution.title}{" "}
                      <span className="text-brand">
                        {solution.titleAccent}
                      </span>
                    </h3>
                  </div>
                )}
              </div>
            </motion.article>
          );
        })}

        {/* 이전/다음 원형 화살표 — 무대(이미지) 세로 중앙 양옆. 다음은 brand 채움(레퍼런스) */}
        <button
          type="button"
          onClick={goPrev}
          aria-label="이전 솔루션"
          className="absolute top-1/2 left-0 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-hairline bg-surface-white text-ink shadow-sm transition-colors duration-fast ease-out hover:border-brand hover:text-brand focus-visible:border-brand focus-visible:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 sm:left-3"
        >
          <ChevronIcon direction="left" />
        </button>
        <button
          type="button"
          onClick={goNext}
          aria-label="다음 솔루션"
          className="absolute top-1/2 right-0 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-brand text-brand-ink shadow-sm transition-colors duration-fast ease-out hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface sm:right-3"
        >
          <ChevronIcon direction="right" />
        </button>
      </div>

      {/* 활성 솔루션 설명 — 무대 아래 중앙(기존 title/no 자리를 description이 대체) */}
      <div className="mt-8 text-center">
        <p className="mx-auto max-w-xl text-body-sm text-ink-soft">
          {activeSolution.description}
        </p>
      </div>
    </div>
  );
}

interface ChevronIconProps {
  direction: "left" | "right";
}

function ChevronIcon({ direction }: ChevronIconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={direction === "left" ? "rotate-0" : "rotate-180"}
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors. (`BusinessSection.tsx` will still reference the old `imageSrc`/no-`titleAccent` shape until Task 12 — that's fine, Task 12 fixes the one remaining caller in the same work session; if executing tasks with review gates between them, expect a transient type error in `BusinessSection.tsx` until Task 12 lands.)

- [ ] **Step 4: Commit**

```bash
git add src/views/landing/ui/business-solutions.data.ts src/views/landing/ui/SolutionCarousel.tsx
git commit -m "feat: reposition solution carousel title/description overlay"
```

---

### Task 12: Wire `BusinessSection` to Supabase with fallback

**Files:**
- Modify: `src/views/landing/ui/BusinessSection.tsx`

**Interfaces:**
- Consumes: `getSolutionSlides` from `@/features/solution` (barrel — this is a server component); `BUSINESS_SOLUTIONS` from `./business-solutions.data`; `SolutionCarousel` from `./SolutionCarousel`.
- Produces: `BusinessSection` as an `async` server component. No other task depends on this file.

- [ ] **Step 1: Rewrite `BusinessSection.tsx`**

```tsx
import { Button, SectionHeader } from "@/shared/ui";
import { getSolutionSlides } from "@/features/solution";

import { BUSINESS_SOLUTIONS } from "./business-solutions.data";
import { SolutionCarousel } from "./SolutionCarousel";

/**
 * About Business 섹션(서버).
 * Supabase `solution_slides`(getSolutionSlides)에서 활성 슬라이드를 가져오고,
 * 비어있으면(마이그레이션 미적용/데이터 없음) 로컬 fallback 상수를 사용한다.
 */
export async function BusinessSection() {
  const slides = await getSolutionSlides();
  const solutions = slides.length > 0 ? slides : BUSINESS_SOLUTIONS;

  return (
    <section className="bg-surface py-16 lg:py-30">
      <div className="content-container">
        {/* 중앙정렬 헤딩 + 서브타이틀(기존 우측 설명 문단 이동, 문구 보존) */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <SectionHeader
            tone="light"
            eyebrow="ABOUT BUSINESS"
            title={
              <>
                환경과 융합된
                <br />
                다양한 솔루션 개발
              </>
            }
          />
          <p className="mx-auto mt-6 max-w-xl text-body-sm text-ink-soft">
            대국민 서비스, 행정업무 통합관리 등 효율적인 시스템 구축과 환경
            정보시스템에 관한 기획부터 개발, 구축, 운영까지 — 이쓰리가 모든
            과정을 책임집니다.
          </p>
        </div>

        {/* 상호작용(캐러셀)만 클라이언트 경계로 분리 */}
        <SolutionCarousel solutions={solutions} />

        <div className="mt-14 flex justify-center">
          <Button variant="dark">E3 BUSINESS 자세히보기</Button>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Manual verification (fallback path, before migration is applied)**

Run: `npm run dev`, open `http://localhost:3000`, scroll to "ABOUT BUSINESS".
Expected: carousel renders 3 slides from `BUSINESS_SOLUTIONS` (SI/R&D/CONSULTING), active card shows bottom-left title with the accent word in brand color, no number, description centered below the stage, arrows work.

- [ ] **Step 4: Commit**

```bash
git add src/views/landing/ui/BusinessSection.tsx
git commit -m "feat: fetch solution slides from Supabase with local fallback"
```

---

### Task 13: Console nav entry + `/console/landing` hub page

**Files:**
- Modify: `src/app/(admin)/console/(dashboard)/layout.tsx`
- Create: `src/app/(admin)/console/(dashboard)/landing/page.tsx`

**Interfaces:**
- Consumes: `ADMIN_BASE_PATH` from `@/shared/constants`; `SectionLabel` from `@/shared/ui`; `buildMetadata` from `@/shared/lib`.
- Produces: `/console/landing` route reachable from the console nav. Task 14 adds the `/solutions` sub-route this page links to.

- [ ] **Step 1: Add the nav entry in `layout.tsx`**

In `src/app/(admin)/console/(dashboard)/layout.tsx`, update `CONSOLE_NAV`:

```ts
const CONSOLE_NAV = [
  { label: "대시보드", href: ADMIN_BASE_PATH },
  { label: "회사 정보", href: `${ADMIN_BASE_PATH}/company` },
  { label: "랜딩페이지", href: `${ADMIN_BASE_PATH}/landing` },
  { label: "NEWS", href: `${ADMIN_BASE_PATH}/news` },
  { label: "기업문화", href: `${ADMIN_BASE_PATH}/culture` },
  { label: "인재채용", href: `${ADMIN_BASE_PATH}/careers` },
] as const;
```

- [ ] **Step 2: Write `landing/page.tsx`**

```tsx
import Link from "next/link";
import { SectionLabel } from "@/shared/ui";
import { buildMetadata } from "@/shared/lib";
import { ADMIN_BASE_PATH } from "@/shared/constants";

export const metadata = buildMetadata({
  title: "랜딩페이지 관리",
  description: "이쓰리 랜딩페이지 콘텐츠 관리",
  path: "/console/landing",
  noIndex: true,
});

const LANDING_BLOCKS = [
  {
    title: "솔루션 캐러셀",
    description:
      "About Business 섹션의 솔루션 슬라이드(제목·설명·이미지·순서)를 관리합니다.",
    href: `${ADMIN_BASE_PATH}/landing/solutions`,
  },
] as const;

/**
 * "랜딩페이지 관리" 허브(서버 컴포넌트).
 * 랜딩 페이지의 관리 가능한 콘텐츠 블록을 카드로 노출한다. 현재는 솔루션 캐러셀만
 * 연결되어 있고, 향후 다른 블록이 추가되면 LANDING_BLOCKS에 항목만 늘리면 된다.
 */
export default function ConsoleLandingPage() {
  return (
    <section className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <SectionLabel color="olive">Console</SectionLabel>
        <h1 className="font-display text-h2 font-extrabold text-ink">
          랜딩페이지 관리
        </h1>
        <p className="text-body-sm text-ink-soft">
          공개 랜딩 페이지에 노출되는 콘텐츠 블록을 관리합니다.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {LANDING_BLOCKS.map((block) => (
          <Link
            key={block.href}
            href={block.href}
            className="flex flex-col gap-2 rounded-card border border-hairline bg-surface-white p-6 transition-colors duration-fast ease-out hover:border-brand"
          >
            <h2 className="font-display text-lg font-bold text-ink">
              {block.title}
            </h2>
            <p className="text-body-sm text-ink-soft">{block.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Manual verification**

Run: `npm run dev`, log into `/console/login`, confirm "랜딩페이지" appears in the top nav between "회사 정보" and "NEWS", click it, confirm `/console/landing` renders the "솔루션 캐러셀" card (its link will 404 until Task 14).

- [ ] **Step 5: Commit**

```bash
git add "src/app/(admin)/console/(dashboard)/layout.tsx" "src/app/(admin)/console/(dashboard)/landing/page.tsx"
git commit -m "feat: add landing management nav entry and hub page"
```

---

### Task 14: `/console/landing/solutions` CRUD pages

**Files:**
- Create: `src/app/(admin)/console/(dashboard)/landing/solutions/page.tsx`
- Create: `src/app/(admin)/console/(dashboard)/landing/solutions/new/page.tsx`
- Create: `src/app/(admin)/console/(dashboard)/landing/solutions/[id]/edit/page.tsx`

**Interfaces:**
- Consumes: `getAdminSolutionSlides`, `getAdminSolutionSlideById`, `SolutionForm`, `SolutionAdminTable` from `@/features/solution` (barrel, server components only); `buildMetadata` from `@/shared/lib`; `ADMIN_BASE_PATH` from `@/shared/constants`; `SectionLabel` from `@/shared/ui`.
- Produces: the full admin CRUD surface for solution slides, linked from Task 13's hub page.

- [ ] **Step 1: Write `landing/solutions/page.tsx`**

```tsx
import Link from "next/link";
import { SectionLabel } from "@/shared/ui";
import { buildMetadata } from "@/shared/lib";
import { ADMIN_BASE_PATH } from "@/shared/constants";
import { getAdminSolutionSlides, SolutionAdminTable } from "@/features/solution";

export const metadata = buildMetadata({
  title: "솔루션 캐러셀 관리",
  description: "이쓰리 솔루션 캐러셀 콘텐츠 관리",
  path: "/console/landing/solutions",
  noIndex: true,
});

/**
 * 솔루션 캐러셀 관리 목록(서버 컴포넌트).
 * getAdminSolutionSlides()로 비활성 포함 전체를 로드해 SolutionAdminTable에 전달한다.
 * "새 슬라이드" 버튼으로 작성 페이지(/console/landing/solutions/new)로 이동한다.
 */
export default async function ConsoleLandingSolutionsPage() {
  const items = await getAdminSolutionSlides();

  return (
    <section className="flex flex-col gap-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-3">
          <SectionLabel color="olive">Console</SectionLabel>
          <h1 className="font-display text-h2 font-extrabold text-ink">
            솔루션 캐러셀 관리
          </h1>
          <p className="text-body-sm text-ink-soft">
            About Business 섹션의 솔루션 슬라이드를 등록·수정·삭제·순서변경합니다.
          </p>
        </div>
        <Link
          href={`${ADMIN_BASE_PATH}/landing/solutions/new`}
          className="inline-flex items-center justify-center rounded-pill bg-ink px-7 py-3.5 font-display text-sm font-bold text-white transition-colors duration-fast ease-out hover:opacity-90"
        >
          새 슬라이드
        </Link>
      </div>

      <SolutionAdminTable items={items} />
    </section>
  );
}
```

- [ ] **Step 2: Write `landing/solutions/new/page.tsx`**

```tsx
import { SectionLabel } from "@/shared/ui";
import { buildMetadata } from "@/shared/lib";
import { SolutionForm } from "@/features/solution";

export const metadata = buildMetadata({
  title: "새 솔루션 슬라이드 등록",
  description: "이쓰리 솔루션 캐러셀 새 슬라이드 등록",
  path: "/console/landing/solutions/new",
  noIndex: true,
});

/**
 * 솔루션 슬라이드 새 등록 페이지(서버 컴포넌트).
 * SolutionForm을 create 모드로 렌더한다.
 */
export default function ConsoleLandingSolutionsNewPage() {
  return (
    <section className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <SectionLabel color="olive">Console</SectionLabel>
        <h1 className="font-display text-h2 font-extrabold text-ink">
          새 솔루션 슬라이드 등록
        </h1>
        <p className="text-body-sm text-ink-soft">
          제목·강조 텍스트·설명·이미지를 등록하고 노출 여부를 선택합니다.
        </p>
      </div>

      <div className="rounded-card border border-hairline bg-surface-white p-8">
        <SolutionForm mode="create" />
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Write `landing/solutions/[id]/edit/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import { SectionLabel } from "@/shared/ui";
import { buildMetadata } from "@/shared/lib";
import { getAdminSolutionSlideById, SolutionForm } from "@/features/solution";

export const metadata = buildMetadata({
  title: "솔루션 슬라이드 수정",
  description: "이쓰리 솔루션 캐러셀 슬라이드 수정",
  path: "/console/landing/solutions",
  noIndex: true,
});

interface ConsoleLandingSolutionsEditPageProps {
  params: Promise<{ id: string }>;
}

/**
 * 솔루션 슬라이드 수정 페이지(서버 컴포넌트).
 * id로 비활성 포함 단건을 조회해 SolutionForm을 update 모드로 프리필한다.
 * 없으면 notFound().
 */
export default async function ConsoleLandingSolutionsEditPage({
  params,
}: ConsoleLandingSolutionsEditPageProps) {
  const { id } = await params;
  const initialValues = await getAdminSolutionSlideById(id);

  if (!initialValues) {
    notFound();
  }

  return (
    <section className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <SectionLabel color="olive">Console</SectionLabel>
        <h1 className="font-display text-h2 font-extrabold text-ink">
          솔루션 슬라이드 수정
        </h1>
        <p className="text-body-sm text-ink-soft">
          제목·강조 텍스트·설명·이미지를 수정하고 노출 여부를 변경합니다.
        </p>
      </div>

      <div className="rounded-card border border-hairline bg-surface-white p-8">
        <SolutionForm mode="update" slideId={id} initialValues={initialValues} />
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Manual verification (requires Task 1's migration applied)**

Run: `npm run dev`, log into `/console`, go to 랜딩페이지 → 솔루션 캐러셀 관리.
Expected:
1. List shows the 3 seeded slides in order (SI, R&D, CONSULTING) with "노출" badges.
2. Click "새 슬라이드" → fill title/accent/description, upload an image, submit → redirects to list, new row appears at the bottom.
3. Click "수정" on a row → change description → save → list reflects the change.
4. Click ↑ on the last row → order updates and persists after a page refresh.
5. Toggle 노출 off on a slide, save → reload the public landing page (`/`) → that slide no longer appears in the carousel; toggle back on → it reappears (allow for cache revalidation via the `revalidateTag`/`revalidatePath` calls in Tasks 5–6).
6. Click "삭제" on a slide → confirm → row disappears from the list and from the public carousel.

- [ ] **Step 6: Commit**

```bash
git add "src/app/(admin)/console/(dashboard)/landing/solutions"
git commit -m "feat: add solution slide admin CRUD pages"
```

---

## Self-Review Notes

- **Spec coverage:** Task 1 → schema.md contract. Tasks 2–10 → features/solution slice (plan.md Section 3). Tasks 11–12 → carousel layout + wiring (plan.md Sections 1 & 4, including the fallback requirement). Tasks 13–14 → console hub + CRUD (plan.md Section 3's console layout). All plan.md/schema.md requirements are covered.
- **Placeholder scan:** no TBD/TODO; every step has complete, runnable code.
- **Type consistency:** `SolutionSlide.imageUrl` (not `imageSrc`) is used consistently across Task 2 (types), Task 3 (getter mapping), Task 11 (fallback data + carousel), and Task 12. `titleAccent` (camelCase) vs `title_accent` (DB) mapping is consistent in every getter/mutation. `SolutionAdminItem` fields (`sortOrder`, `isActive`) match what Task 9's table and Task 6's reorder action expect.
