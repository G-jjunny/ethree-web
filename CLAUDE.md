@AGENTS.md

# CLAUDE.md

> 모든 에이전트와 세션은 이 파일을 가장 먼저 읽는다. 여기에 정의된 규칙이 최우선이다.

---

## 프로젝트 개요

마케팅/브랜드 사이트 + 관리자 페이지. 일반 유저는 인증 없이 브랜드 사이트를 방문하고, 관리자는 로그인 후 `/admin/*`에서 콘텐츠를 관리한다.

```
Frontend    Next.js 16 (App Router) · Tailwind CSS v4 · TanStack Query · Zustand · Axios
BaaS        Supabase (PostgreSQL · Auth · Storage)
Language    TypeScript (strict)
Lint        ESLint + Prettier
```

---

## 에이전트 구조

```
orchestrator          작업 분해 · 에이전트 위임 · GitHub 워크플로우. 코드 직접 작성 안 함.
├── design            docs/design.md 토큰 기준 마크업/className 담당
├── implementer       views/widgets/features/shared 구현. Route Handlers 포함.
├── supabase-agent    DB 스키마 · RLS 정책 · Storage 버킷 설계 및 마이그레이션
└── reviewer          의미론적 리뷰만 (디자인 준수 · 아키텍처 규칙 · API 계약)

[Hook] PostToolUse(Edit|Write) → npm run lint && npx tsc --noEmit
```

**핸드오프 프로토콜**: 에이전트 간 컨텍스트는 프롬프트가 아닌 파일로 전달한다.

```
plans/
  YYYYMMDD-{feature}-plan.md       orchestrator 작성. 작업 범위·순서 정의.
  YYYYMMDD-{feature}-schema.md     supabase-agent 작성. FE가 참조하는 DB 계약.
  YYYYMMDD-{feature}-design.md     design 에이전트 작성. 신규 토큰/컴포넌트 정의.
```

---

## 아키텍처: 커스텀 FSD

`entities` 레이어를 제거한 4+1 구조. 각 레이어는 아래 방향으로만 import한다.

```
app → views → widgets → features → shared
```

### 레이어 책임

```
app/
  (marketing)/      일반 방문자용 라우트 그룹
  (admin)/          관리자 전용 라우트 그룹. middleware로 보호.
  api/              Route Handlers (Supabase 직접 처리 불가한 로직만)
  layout.tsx
  middleware.ts     /admin/* Supabase 세션 검증

views/
  {page}/
    ui/             페이지 조합 컴포넌트 (섹션 import해서 조립)
    index.ts

widgets/
  {block}/
    ui/             2개 이상 뷰에서 재사용되는 독립 UI 블록
    index.ts

features/
  {action}/
    api/            useMutation hooks, queryOptions (GET)
    ui/             폼, 버튼 등 사용자 액션 컴포넌트
    model/          zustand slice, zod schema
    index.ts

shared/
  api/              axiosInstance, supabaseClient, ApiError, authAwareRetry
  ui/               공용 UI 컴포넌트 (Button, Input, SectionHeader 등)
  lib/              유틸 함수
  types/            전역 타입
  constants/        site.ts 등 상수
```

### 레이어 배치 판단 기준

| 해당하는 경우                           | 배치                                |
| --------------------------------------- | ----------------------------------- |
| 사용자 액션 (폼, 뮤테이션, 버튼 핸들러) | `features/*/ui`, `features/*/model` |
| API 호출 함수, queryOptions             | `features/*/api`                    |
| 2개 이상 뷰에서 재사용되는 UI 블록      | `widgets/*/ui`                      |
| 특정 페이지에서만 사용, 섹션 조합       | `views/*/ui`                        |
| 전역 공용 컴포넌트, 유틸, 타입          | `shared/`                           |

**`views`에 남아야 할 것**: 섹션/위젯을 import해서 조합하는 코드만. 비즈니스 로직·API 호출·50줄 이상 단일 JSX가 views에 있으면 상위 레이어 분리 대상.

### Public API 규칙

각 슬라이스는 `index.ts`로만 외부에 노출한다. 슬라이스 내부 파일을 직접 import하는 것은 금지.

```ts
// ✅
import { HeroWidget } from "@/widgets/hero";
// ❌
import { HeroWidget } from "@/widgets/hero/ui/HeroWidget";
```

---

## API 통신 규칙

### Supabase 직접 호출 vs Route Handler 기준

```
Supabase 직접 (클라이언트)   단순 CRUD, 파일 업로드/조회, 인증 상태 확인
Route Handler (/api/*)       외부 API 연동, 서버 전용 비즈니스 로직, 민감 키 보호
```

### TanStack Query 패턴

```ts
// ✅ features/*/api — GET: queryOptions 팩토리
export const postKeys = {
  all: ["posts"] as const,
  detail: (id: string) => [...postKeys.all, id] as const,
};
export const postDetailOptions = (id: string) =>
  queryOptions({
    queryKey: postKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select()
        .eq("id", id)
        .single();
      if (error) throw new ApiError(error);
      return data;
    },
  });

// ✅ features/*/api — POST/PATCH/DELETE: useMutation hook
export function useUpdatePostMutation(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdatePostDto) =>
      supabase.from("posts").update(payload).eq("id", id),
    onSuccess: () => qc.invalidateQueries({ queryKey: postKeys.detail(id) }),
  });
}

// ✅ views/widgets — 소비
const { data } = useQuery(postDetailOptions(id));
const update = useUpdatePostMutation(id);
```

**절대 금지**

```ts
❌ fetch() 직접 호출
❌ useEffect + useState 데이터 페칭
❌ views/widgets에서 supabaseClient 직접 import (features를 통해서만)
```

### 에러 처리

```ts
// shared/api/ApiError.ts에 단 한 번 정의 — 슬라이스마다 재정의 금지
import { ApiError, authAwareRetry } from "@/shared/api";

export const myQueryOptions = () =>
  queryOptions({ /* ... */ retry: authAwareRetry });
```

---

## 인증 / 관리자 보호

```ts
// app/middleware.ts — /admin/* 전체 보호
// Supabase SSR 세션 검증 → 미인증 시 /login 리다이렉트

// 규칙
// - 관리자 계정은 Supabase Auth 이메일/패스워드만 사용
// - 회원가입 플로우 없음 (Supabase 대시보드에서 수동 생성)
// - RLS 정책으로 인증된 사용자만 write 허용
// - 클라이언트 코드에서 관리자 여부를 role 체크로 이중 확인
```

---

## 디자인 시스템

- **토큰 SSOT**: `docs/design.md` — 색상, 타이포, 스페이싱, 쉐도우 전부 여기서만 정의
- **공용 컴포넌트 목록**: `src/shared/ui/index.ts` — 작업 전 반드시 읽는다
- **Tailwind 토큰 강제**: 하드코딩 절대 금지

```ts
❌ bg-[#0057ff]  text-[#1d1d1f]  p-[24px]
✅ bg-brand-blue  text-heading  p-6
```

- **content-container 강제**: 섹션 내부 래퍼에 `max-w-* mx-auto px-*` 직접 사용 금지

```ts
❌ className="max-w-[1200px] mx-auto px-5"
✅ className="content-container"
```

- **재사용 우선 순서**: 기존 토큰 재사용 → shared/ui 컴포넌트 재사용 → 3곳 이상 반복이면 shared/ui 추가 → 그래도 없으면 design.md 갱신 후 구현

---

## Supabase 규칙

```
- 모든 테이블에 RLS 활성화 (기본값: 비활성이므로 명시적으로 켜야 함)
- 마이그레이션은 supabase/migrations/ 에 SQL 파일로 관리
- 스키마 변경 시 plans/{date}-{feature}-schema.md 갱신 후 구현
- Storage 버킷 정책: public 버킷은 read-only, write는 인증 필요
- 환경변수: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
- service role key는 서버 전용 (Route Handler, middleware). 클라이언트 코드 노출 금지.
```

---

## 상수 관리

브랜드명, 주소, 연락처, 메타 정보 등 전역 상수는 `src/shared/constants/site.ts` 한 곳에서만 정의한다. 컴포넌트에 문자열 직접 하드코딩 금지.

```ts
// ✅ src/shared/constants/site.ts
export const SITE = {
  name: "...",
  url: "...",
  contact: { email: "...", phone: "..." },
} as const;
```

---

## TypeScript 규칙

```jsonc
// tsconfig.json
{ "compilerOptions": { "strict": true } }
```

- `any` 사용 금지. 불가피하면 `unknown` + type guard.
- 컴포넌트 Props는 `interface`로 명시. 인라인 타입 금지.
- Supabase 자동 생성 타입 (`supabase gen types typescript`) 활용.

---

## Next.js 15 규칙

```ts
// ✅ params/searchParams는 async로 받는다
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
}

// ✅ 서버 컴포넌트에서 데이터 페칭 시 Suspense 래핑
<Suspense fallback={<Skeleton />}>
  <AsyncComponent />
</Suspense>

// ✅ 캐시 제어
'use cache'        // 정적 캐시
cacheLife('hours') // 캐시 수명
revalidateTag()    // 태그 기반 무효화
```

---

## 금지 사항 (전 에이전트 공통)

```
❌ 디자인 토큰 하드코딩
❌ fetch() 직접 호출 (shared/api 또는 supabaseClient 경유)
❌ 레이어 역방향 import (shared → features 등)
❌ 슬라이스 내부 파일 직접 import (index.ts 경유 필수)
❌ service role key 클라이언트 노출
❌ RLS 비활성 테이블 생성
❌ any 타입 사용
❌ npm 패키지 무단 설치 (implementer → orchestrator 승인 후)
```
