# 섹션 서브내비게이션 작업 계획

## 배경 / 문제

현재 라우팅은 `Home → 섹션 허브(/about, /business, /support) → 하위 페이지` 흐름만 있다. 허브에서는 `PlaceholderHub`가 하위 항목 링크를 보여주지만, **하위 페이지에 진입한 후에는 형제 하위 페이지로 이동할 방법이 없다**(허브로 돌아가야만 다른 하위 페이지 접근 가능).

지난 작업(`/business` 허브 누락 수정)과 같은 종류의 일관성 문제 — 이번엔 3개 섹션(About E3 / About Business / Customer Support) 전체에 동일하게 적용해 한 번에 해결한다(사용자 확인 완료).

## 목표

각 섹션의 **leaf 페이지**(허브 제외, 실제 콘텐츠 placeholder 페이지)에 **형제 페이지로 바로 이동하는 서브내비게이션**을 추가한다.

## 대상 페이지 (9개, 허브 3개는 대상 아님)

| 섹션 | leaf 페이지 | 형제 목록 |
|---|---|---|
| About E3 | `/about/greeting`, `/about/history`, `/about/location` | 인사말 / 연혁 및 비전 / 오시는길 |
| About Business | `/business/intro`, `/business/service` | 사업소개 / 서비스소개 |
| Customer Support | `/support/news`, `/support/culture`, `/support/careers` | NEWS / 기업문화 / 인재채용 |

**허브(`/about`, `/business`, `/support`)와 `/support/news/[slug]`(뉴스 상세)는 대상 아님** — 허브는 이미 그 자체가 내비게이션이고, 뉴스 상세는 형제 집합(NEWS/기업문화/인재채용)의 리스트 페이지 하위 항목이라 섹션 서브내비 대상이 아니다.

## 구현 방식

기존 `widgets/placeholder-page`의 `PlaceholderPage` 컴포넌트를 확장한다(신규 위젯 분리보다 기존 위젯 확장이 재사용 원칙에 부합).

```ts
export interface PlaceholderPageProps {
  eyebrow: string;
  title: string;
  description?: string;
  // 신규
  siblings?: readonly { label: string; href: string }[];
  activeHref?: string; // 현재 페이지 href — siblings 중 어떤 게 active인지 표시
}
```

- `siblings`가 있으면 헤더 아래(또는 지정 위치)에 탭/필 형태의 내비게이션 행을 렌더링. `activeHref`와 일치하는 항목은 강조 스타일(예: 채워진 배경), 나머지는 링크 스타일.
- `siblings`/`activeHref` 없으면 기존과 동일하게 동작(하위 호환) — 다른 곳에서 이미 쓰고 있을 경우가 없으므로 사실상 이번에 9곳 전부 채워 넣는다.
- 서버 컴포넌트 유지 — `activeHref`는 각 `page.tsx`가 자기 경로를 문자열로 직접 넘긴다(usePathname 등 클라이언트 훅 불필요).
- 각 leaf `page.tsx`는 `NAV_GROUPS`에서 해당 그룹을 찾아 `children`을 그대로 `siblings`로 전달.

```tsx
// 예: src/app/(marketing)/about/greeting/page.tsx
import { NAV_GROUPS } from "@/shared/constants";

const group = NAV_GROUPS.find((g) => g.href === "/about")!;

<PlaceholderPage
  eyebrow="ABOUT E3"
  title="인사말"
  description="..."
  siblings={group.children}
  activeHref="/about/greeting"
/>
```

## 위임 순서

1. **design (Pre/확장)** — `PlaceholderPage` 확장(siblings/activeHref prop + 탭 UI), 기존 토큰만 사용. **완료.**
2. **implementer** — 9개 leaf page.tsx에 siblings/activeHref 전달.
3. **design (polish)** — 토큰 준수 정리.
4. **reviewer** — 의미론적 검토.

## 참조

- `src/widgets/placeholder-page/*` (design 기존 작성)
- `src/shared/constants/site.ts` (NAV_GROUPS)
- `plans/20260703-routing-plan.md` (라우팅 전체 배경)

## 구현 완료 — 최종 API

`PlaceholderPage`(`src/widgets/placeholder-page/ui/PlaceholderPage.tsx`)에 `siblings`/`activeHref` optional prop을 추가했다. 내부적으로 신규 내부 전용 컴포넌트 `PlaceholderSubNav`(`src/widgets/placeholder-page/ui/PlaceholderSubNav.tsx`, `PlaceholderHeader`처럼 `index.ts`로 export하지 않음)를 사용해 헤더 바로 아래 탭 내비게이션을 렌더링한다.

```ts
export interface PlaceholderPageProps {
  eyebrow: string;
  title: string;
  description?: string;
  siblings?: readonly { label: string; href: string }[]; // 신규, optional
  activeHref?: string; // 신규, optional — siblings 중 현재 페이지
}
```

- `siblings` 미전달 시 기존과 완전히 동일하게 동작(하위 호환 유지).
- `siblings` 전달 시: hairline 보더 + `bg-surface-white`로 감싼 pill 트랙 안에 항목별 탭 렌더링. `activeHref`와 일치하는 항목은 `bg-ink text-white` 필 강조, 나머지는 `text-ink-soft` + `hover:text-olive-label` 링크 스타일. 2~3개 항목 모두 `flex flex-wrap justify-center`로 자연스럽게 대응.
- 서버 컴포넌트 유지(`next/link`의 `Link`만 사용, 클라이언트 훅 없음). `activeHref`는 각 `page.tsx`가 자신의 경로 문자열을 직접 전달.
- 사용된 토큰: `rounded-pill`, `border-hairline`, `bg-surface-white`, `bg-ink`, `text-white`, `text-ink-soft`, `text-olive-label`, `duration-fast`, `ease-out` — 전부 기존 `docs/design.md` 토큰. 신규 토큰 추가 없음.

### 사용 예시 (implementer가 9개 leaf page.tsx에 적용)

```tsx
// src/app/(marketing)/about/greeting/page.tsx
import { PlaceholderPage } from "@/widgets/placeholder-page";
import { NAV_GROUPS } from "@/shared/constants";

const group = NAV_GROUPS.find((g) => g.href === "/about")!;

export default function Page() {
  return (
    <PlaceholderPage
      eyebrow="ABOUT E3"
      title="인사말"
      description="..."
      siblings={group.children}
      activeHref="/about/greeting"
    />
  );
}
```

동일 패턴을 `/business/*`(그룹 `/business`), `/support/news`, `/support/culture`, `/support/careers`(그룹 `/support`)에 적용하면 된다. 허브(`/about`, `/business`, `/support`)와 `/support/news/[slug]`는 대상에서 제외.

**추가 결정(구현 중)**: `/support/news`는 뉴스 리스트라 `PlaceholderPage` 구조를 쓰지 않고 `SectionLabel`+커스텀 마크업으로 직접 작성된 페이지라, `PlaceholderSubNav`를 두 번째 소비처로 두기 위해 `PlaceholderSubNav`/`PlaceholderSubNavProps`/`PlaceholderSubNavItem`을 `src/widgets/placeholder-page/index.ts`의 공개 API로 승격했다(컴포넌트 구현 변경 없음, export만 추가). `/support/news/page.tsx`에서 `<PlaceholderSubNav siblings={group.children} activeHref="/support/news" />`처럼 직접 import해 사용하면 된다.
