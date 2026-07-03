---
name: applying-fsd-architecture
description: 이 프로젝트의 커스텀 FSD 아키텍처 규칙. entities 제거, views/widgets/features/shared 4레이어 구조. implementer가 구현 전, reviewer가 검토 시 자동 로드. 슬라이스/세그먼트 생성 및 컴플라이언스 체크 포함.
---

# 커스텀 FSD 아키텍처

`entities` 레이어를 제거한 4+1 구조. 레이어는 아래 방향으로만 import한다.

```
app → views → widgets → features → shared
```

> 공식 FSD 문서: https://feature-sliced.design/kr/docs/get-started/overview

---

## 레이어 정의

### `app/`

Next.js App Router 진입점. 슬라이스 구조 없음.

```
app/
  (marketing)/        일반 방문자 라우트 그룹 (인증 불필요)
  (admin)/            관리자 전용 라우트 그룹 (middleware 보호)
  api/                Route Handlers
  layout.tsx
  middleware.ts       /admin/* Supabase 세션 검증
```

---

### `views/`

특정 페이지에서만 사용되는 섹션 조합 컴포넌트.

```
views/
  {page-name}/          ← kebab-case
    ui/
      {PageName}View.tsx ← PascalCase
    index.ts
```

**있어야 할 것**: 하위 레이어 슬라이스를 import해서 조합하는 코드만.

**있으면 안 되는 것**:

```
❌ useQuery / useMutation 직접 작성
❌ supabaseClient 직접 import
❌ 50줄 이상 단일 JSX 블록
❌ 비즈니스 로직
```

---

### `widgets/`

2개 이상의 뷰에서 재사용되는 독립적인 UI 블록.

```
widgets/
  {block-name}/         ← kebab-case
    ui/
      {BlockName}Widget.tsx ← PascalCase
    index.ts
```

**판단 기준**: "이 블록이 다른 페이지에서도 그대로 쓰일 수 있는가?" → Yes면 widget.

데이터는 props로 받거나 내부에서 `useQuery(featureQueryOptions())`로만 소비. supabaseClient 직접 import 금지.

---

### `features/`

사용자 액션, 뮤테이션, 폼, API 호출 함수.

```
features/
  {action-name}/        ← kebab-case
    api/
      {action}Api.ts    ← queryOptions, useMutation hook
    ui/
      {Action}Form.tsx  ← 폼, 버튼 등 사용자 액션 컴포넌트
    model/
      {action}Store.ts  ← zustand slice (필요한 경우)
      {action}Schema.ts ← zod 스키마 (폼 검증)
    index.ts
```

#### api/ 패턴

```ts
// ✅ GET — queryOptions 팩토리 + query key factory
export const postKeys = {
  all: ["posts"] as const,
  list: () => [...postKeys.all, "list"] as const,
  detail: (id: string) => [...postKeys.all, id] as const,
};

export const postListOptions = () =>
  queryOptions({
    queryKey: postKeys.list(),
    queryFn: async () => {
      const { data, error } = await supabase.from("posts").select();
      if (error) throw new ApiError(error);
      return data;
    },
  });

// ✅ POST/PATCH/DELETE — useMutation hook
export function useCreatePostMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePostDto) =>
      supabase.from("posts").insert(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: postKeys.list() }),
  });
}
```

#### model/ 패턴

```ts
// zustand slice — features/*/model/{name}Store.ts
interface PostStore {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const usePostStore = create<PostStore>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));

// zod 스키마 — features/*/model/{name}Schema.ts
export const createPostSchema = z.object({
  title: z.string().min(1, "제목을 입력하세요"),
  content: z.string().min(1, "내용을 입력하세요"),
});
export type CreatePostDto = z.infer<typeof createPostSchema>;
```

#### 에러 처리 원칙

```ts
// shared/api에서 단 한 번 정의된 것을 import — 슬라이스마다 재정의 금지
import { ApiError, authAwareRetry } from "@/shared/api";

// ❌ 슬라이스마다 재정의 절대 금지
// status 체크, isAuthError, retry 로직 복붙 금지
```

---

### `shared/`

레이어 경계 없이 어디서나 import 가능한 공용 자원.

```
shared/
  api/
    supabaseClient.ts   ← createBrowserClient / createServerClient
    axiosInstance.ts    ← Route Handler 호출용
    ApiError.ts         ← 공통 에러 클래스
    authAwareRetry.ts   ← TanStack Query retry 정책
  ui/
    Button.tsx
    Input.tsx
    SectionHeader.tsx
    index.ts            ← 모든 공용 컴포넌트 export
  lib/
    utils.ts
    format.ts
  types/
    supabase.ts         ← supabase gen types 자동 생성
    common.ts
  constants/
    site.ts             ← 브랜드명, URL, 연락처 전역 상수
```

---

## 네이밍 규칙

| 대상            | 규칙       | 예시                                     |
| --------------- | ---------- | ---------------------------------------- |
| 슬라이스 폴더   | kebab-case | `user-profile`, `auth-form`              |
| 컴포넌트 파일   | PascalCase | `UserCard.tsx`, `HeroWidget.tsx`         |
| 유틸/훅/스토어  | camelCase  | `formatDate.ts`, `usePostStore.ts`       |
| API 함수 파일   | camelCase  | `postApi.ts`, `useCreatePostMutation.ts` |
| zod 스키마 파일 | camelCase  | `postSchema.ts`                          |

---

## Import 규칙

### 방향 규칙

```
✅ 허용
  views    → widgets, features, shared
  widgets  → features, shared
  features → shared
  shared   → (외부 라이브러리만)

❌ 금지 (역방향)
  shared   → features, widgets, views
  features → widgets, views
  widgets  → views

❌ 금지 (cross-slice)
  features/post → features/auth  (같은 레이어 슬라이스 간 직접 import)
```

### Public API 규칙

모든 슬라이스는 `index.ts`로만 외부에 노출한다.

```ts
// ✅
import { HeroWidget } from "@/widgets/hero";
import { useCreatePostMutation, postListOptions } from "@/features/post";
import { Button } from "@/shared/ui";

// ❌ 내부 파일 직접 import
import { HeroWidget } from "@/widgets/hero/ui/HeroWidget";
import { useCreatePostMutation } from "@/features/post/api/postApi";
```

---

## 레이어 배치 판단 플로우

```
코드 작성 전 반드시 아래 질문을 순서대로 확인한다.

Q1. Next.js 라우트, 레이아웃, 미들웨어인가?
    → YES: app/

Q2. 전역 공통 유틸/컴포넌트/타입/상수인가?
    → YES: shared/

Q3. 사용자 액션, API 호출, 폼, 뮤테이션인가?
    → YES: features/{action-name}/

Q4. 2개 이상 뷰에서 재사용되는 독립 UI 블록인가?
    → YES: widgets/{block-name}/

Q5. 특정 페이지에서만 사용되는 섹션 조합인가?
    → YES: views/{page-name}/
```

---

## 슬라이스 생성 템플릿

새 슬라이스 생성 시 아래 구조를 기준으로 만든다. 필요한 세그먼트만 포함한다.

### features/{name}/ 템플릿

```
features/{name}/
  api/
    {name}Api.ts     ← queryOptions, mutation hooks
  ui/
    {Name}Form.tsx   ← 폼/액션 컴포넌트 (필요한 경우)
  model/
    {name}Schema.ts  ← zod 스키마 (폼 있는 경우)
    {name}Store.ts   ← zustand slice (전역 상태 필요한 경우)
  index.ts
```

```ts
// features/{name}/index.ts — Public API
export { use{Name}Mutation, {name}QueryOptions, {name}Keys } from './api/{name}Api'
export { {Name}Form } from './ui/{Name}Form'
export type { {Name}Dto } from './model/{name}Schema'
```

### widgets/{name}/ 템플릿

```
widgets/{name}/
  ui/
    {Name}Widget.tsx
  index.ts
```

```ts
// widgets/{name}/index.ts
export { {Name}Widget } from './ui/{Name}Widget'
```

### views/{name}/ 템플릿

```
views/{name}/
  ui/
    {Name}View.tsx
  index.ts
```

```ts
// views/{name}/index.ts
export { {Name}View } from './ui/{Name}View'
```

---

## 컴플라이언스 체크 기준

reviewer가 FSD 규칙을 검토할 때 아래 포맷으로 보고한다.

```
FSD Compliance Report
=====================

✅ Layer Structure
  - app      ✓
  - views    ✓
  - widgets  ✓
  - features ✓
  - shared   ✓

❌ Dependency Violations
  ERROR: src/views/home/ui/HomeView.tsx
    - supabaseClient 직접 import (features 경유 필수)

  ERROR: src/features/post/api/postApi.ts
    - @/features/auth 직접 import (cross-slice 금지)

⚠️  Warnings
  WARNING: src/widgets/hero/ui/HeroWidget.tsx
    - Public API 우회: @/features/post/api/postApi (index.ts 경유 필수)

📋 Summary: N errors, N warnings
```

**Fix 방향**:

- 역방향 import → 상위 레이어에서 조합하거나 shared로 이동
- Cross-slice → widgets에서 조합하거나 props로 의존성 주입
- Public API 우회 → `index.ts`를 통한 import로 수정

---

## 자주 하는 실수

```
❌ views에 useQuery/useMutation 직접 작성
   → features/*/api에 queryOptions 정의 후 소비

❌ supabaseClient를 views/widgets에서 직접 import
   → features/*/api를 통해서만 접근

❌ 같은 마크업을 views마다 중복 작성
   → 2~3곳 반복이면 widgets/로 분리

❌ 슬라이스 내부 파일 직접 import
   → 반드시 index.ts 경유

❌ 같은 레이어 슬라이스 간 직접 import
   → 공통 로직은 shared로 이동하거나 상위 레이어에서 조합

❌ index.ts 없이 슬라이스 생성
   → 반드시 index.ts에서 Public API 명시적 export
```
