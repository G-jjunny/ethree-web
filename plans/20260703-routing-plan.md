# 라우팅 구조 작업 계획

기존 ethree.co.kr IA(`docs/legacy-site-reference.md`) + 현재 `NAV_GROUPS`(`src/shared/constants/site.ts`) 기준으로 전체 라우팅 구조를 스캐폴딩한다. 페이지 콘텐츠/디자인은 후속 작업 — 이번 범위는 **라우팅 구조 + SEO 메타데이터 인프라 + 관리자 보호 경로**.

## 결정된 사항 (사용자 확인)

- 관리자 비밀 슬러그: **`console`** → 코드에 하드코딩하지 않고 `shared/constants/admin.ts`의 `ADMIN_BASE_PATH` 단일 소스로 관리(추후 변경 용이하게).
- NEWS 상세 페이지(`/support/news/[slug]`) 포함, placeholder 데이터 함수로 시작 → 추후 Supabase 교체 대비.

## 최종 라우트 목록

### `(marketing)` — 신설 라우트 그룹, 공용 layout(SiteHeader/SiteFooter)

| 라우트 | 설명 | 상태 |
|---|---|---|
| `/` | 랜딩 | 기존 `src/app/page.tsx` → 그룹으로 이동 |
| `/about` | About E3 허브 (하위 3개 링크) | 신규 |
| `/about/greeting` | 인사말 | 신규 |
| `/about/history` | 연혁 및 비전 | 신규 |
| `/about/location` | 오시는 길 | 신규 |
| `/business` | 사업소개 | 신규 |
| `/business/service` | 서비스소개 | 신규 |
| `/support` | Customer Support 허브 | 신규 |
| `/support/news` | NEWS 목록 | 신규 |
| `/support/news/[slug]` | NEWS 상세 (동적) | 신규, placeholder 데이터 |
| `/support/culture` | 기업문화 | 신규 |
| `/support/careers` | 인재채용 | 신규 |

허브(`/about`, `/support`)는 하위 항목 카드 링크만 있는 최소 페이지. `/business`는 그 자체가 "사업소개" 콘텐츠라 허브 불필요.

콘텐츠 없는 8개 서브페이지(허브 2개 제외)는 **placeholder 위젯**(제목/eyebrow/"콘텐츠 준비 중" 안내)으로 스캐폴딩. 실제 콘텐츠는 별도 후속 작업.

### `(admin)` — 신설 라우트 그룹, middleware로 보호

| 라우트 | 설명 |
|---|---|
| `/console/login` | 관리자 로그인 (미보호) |
| `/console` | 대시보드 placeholder (보호 대상) |

### 루트 신규 파일

- `src/middleware.ts` — `/console/*`(login 제외) Supabase 세션 검증. **주의**: CLAUDE.md 다이어그램은 `app/middleware.ts`로 표기했지만 Next.js 규칙상 middleware는 `app/` 밖, `src/` 루트(또는 프로젝트 루트)에 위치해야 함 — 이번 작업에서 올바른 위치로 구현.
- `src/app/sitemap.ts` — marketing 라우트만 포함
- `src/app/robots.ts` — `/console`, `/api` disallow
- `.env.example` — 필요한 환경변수 이름만 문서화(값 없음): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

## 신규 shared/features 인프라

- `shared/lib/metadata.ts` — `buildMetadata({ title, description, path, noIndex? })`: SITE 상수 기반 title/description/OpenGraph/Twitter/canonical 자동 조립. 각 `page.tsx`는 이걸 호출해 `export const metadata`(또는 동적 라우트는 `generateMetadata`) 선언.
- 루트 `layout.tsx`: `metadataBase: new URL(SITE.url)` 추가, 홈페이지에 JSON-LD Organization 스키마.
- `shared/constants/admin.ts` — `ADMIN_BASE_PATH = "/console"` 단일 소스. middleware·로그인 페이지·향후 대시보드 링크가 전부 이걸 참조.
- `shared/api/supabaseClient.ts` — `createBrowserSupabaseClient()` / `createServerSupabaseClient()` (`@supabase/ssr` 기반, CLAUDE.md 패턴).
- `shared/api/ApiError.ts`, `shared/api/authAwareRetry.ts` — CLAUDE.md 명시된 공용 에러/재시도 정책(최초 생성, 이후 재정의 금지).
- `features/admin-login/` — `ui/LoginForm.tsx`(이메일/비밀번호 폼), `api/useLoginMutation.ts`(`supabase.auth.signInWithPassword`), `index.ts`. **Supabase 프로젝트 키가 아직 없어 실제 로그인은 동작하지 않음** — 구조만 준비, 키 연결 시 바로 동작.
- `widgets/placeholder-page/` (가칭, 최종 네이밍은 design 판단) — 8개 콘텐츠 없는 서브페이지에서 재사용하는 안내 블록(eyebrow/title/description/"콘텐츠 준비 중").

## 개선 사항 (기존 구조 대비)

1. 랜딩을 `(marketing)` 그룹으로 이동 + `SiteHeader`/`SiteFooter`를 그룹 `layout.tsx`로 승격(현재 `LandingView`가 직접 포함 → 페이지 늘어나면 중복). `LandingView`는 섹션 조합만 남긴다.
2. NEWS 상세 동적 라우트 선반영(placeholder 함수) — Supabase 전환 시 함수 내부만 교체.
3. SEO 메타데이터 공용 헬더(`buildMetadata`)로 중복 방지 + `sitemap.ts`/`robots.ts`/JSON-LD 신설.
4. 관리자 보호: 비밀 슬러그(`console`, 단일 소스 상수) + middleware 세션 검증 이중화. Next.js 규칙에 맞는 위치로 middleware 배치.

## 위임 순서

1. **design (Pre)** — `widgets/placeholder-page` 생성 (8개 서브페이지 공용). 기존 토큰만 사용.
2. **implementer** — 라우팅 전체 스캐폴딩, `(marketing)` 그룹 이동+layout 승격, SEO 인프라, admin 인프라(`shared/api/*`, `shared/constants/admin.ts`, `features/admin-login`, middleware, sitemap/robots, `.env.example`).
3. **design (polish)** — 토큰 준수 정리.
4. **reviewer** — 의미론적 검토(+ 미들웨어 위치, fail-closed 인증 동작, SEO 메타데이터 정합 포함).

## 참조

- `docs/legacy-site-reference.md`, `src/shared/constants/site.ts`(NAV_GROUPS/SITE)
- CLAUDE.md API/인증/Supabase 규칙

## `widgets/placeholder-page` — 최종 API (design 완료)

용도 2가지를 컴포넌트 2개로 분리했다(`PlaceholderPage` / `PlaceholderHub`). 둘 다 헤더 블록(`PlaceholderHeader`, 내부 전용·비export)을 공유하며 서버 컴포넌트(상호작용 없음, `"use client"` 불필요)로 사용 가능.

```ts
// src/widgets/placeholder-page/index.ts
export interface PlaceholderPageProps {
  eyebrow: string;      // 예: "ABOUT E3"
  title: string;        // 예: "인사말"
  description?: string; // 선택
}
export function PlaceholderPage(props: PlaceholderPageProps): JSX.Element;

export interface PlaceholderHubLink {
  label: string;
  href: string;
}
export interface PlaceholderHubProps {
  eyebrow: string;
  title: string;
  description?: string;
  links: readonly PlaceholderHubLink[]; // NAV_GROUPS[n].children 그대로 전달 가능
}
export function PlaceholderHub(props: PlaceholderHubProps): JSX.Element;
```

**8개 콘텐츠 없는 서브페이지 → `PlaceholderPage`**

```tsx
// 예: src/app/(marketing)/about/greeting/page.tsx
import { PlaceholderPage } from "@/widgets/placeholder-page";

export default function GreetingPage() {
  return (
    <PlaceholderPage
      eyebrow="ABOUT E3"
      title="인사말"
      description="이쓰리를 찾아주셔서 감사합니다."
    />
  );
}
```

대상: `/about/greeting`, `/about/history`, `/about/location`, `/business/service`, `/support/news`(목록), `/support/news/[slug]`(상세 — placeholder 데이터 함수와 별개로 콘텐츠 뷰 자체는 이 위젯 사용 가능), `/support/culture`, `/support/careers`.

**허브 2개(`/about`, `/support`) → `PlaceholderHub`**, `links`는 `NAV_GROUPS`에서 해당 그룹의 `children`을 그대로 전달.

```tsx
// 예: src/app/(marketing)/about/page.tsx
import { PlaceholderHub } from "@/widgets/placeholder-page";
import { NAV_GROUPS } from "@/shared/constants";

export default function AboutHubPage() {
  const group = NAV_GROUPS.find((g) => g.href === "/about")!;
  return (
    <PlaceholderHub
      eyebrow="ABOUT E3"
      title="About E3"
      links={group.children}
    />
  );
}
```

`/support` 허브는 동일 패턴으로 `NAV_GROUPS`에서 `href === "/support"` 그룹을 사용.

사용 토큰: `bg-surface`/`bg-surface-white`, `SectionLabel(color="olive")`, `text-h1`/`text-body-sm`/`text-detail`/`text-meta`/`text-item`, `rounded-card`, `border-hairline`(+`border-dashed` 유틸), `content-container`. 신규 토큰 추가 없음 — 기존 토큰만 재사용.
