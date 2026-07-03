# 랜딩페이지 보완 작업 계획 (refine)

PR #2 (`feat/#1-landing`)의 랜딩 구현에서 누락된 구조/인터랙션/반응형을 보완한다. **같은 브랜치에 이어서 커밋.**

## 목표

디자인 자체는 Claude Design 원본대로 잘 구현됨. 아래 3가지 "퍼블리싱만 되고 빠진" 부분을 보완한다.

## 보완 항목

### 1. Hero 레이아웃 정렬 (다른 섹션과 불일치 해소)

- **문제**: `HeroSection`의 콘텐츠 래퍼가 `px-16 + max-w-4xl` 좌측 정렬. 다른 섹션은 `content-container`(max-w 1280 중앙). → 화면이 넓어지면 히어로 콘텐츠만 좌측 뷰포트에 붙어 정렬선이 어긋남.
- **해결**: 히어로 콘텐츠 하단 블록을 `content-container` 기반으로 감싸 다른 섹션과 좌측 정렬선을 맞춘다. 카피 컬럼 폭 제한(max-w-*)은 content-container 내부에서 유지. `px-16` 직접 사용 제거.

### 2. GNB(헤더) 뷰포트 고정 + 스크롤 효과

- **문제**: 헤더가 `HeroSection` 내부 `relative`라 페이지 최상단에만 존재 → 스크롤하면 사라짐.
- **해결**:
  - `SiteHeader`를 `HeroSection`에서 분리해 `LandingView` 최상단에서 렌더하고 **`fixed inset-x-0 top-0 z-50`** 로 뷰포트 고정.
  - **스크롤 효과**: 최상단(히어로 위)에서는 배경 투명, 스크롤(`scrollY > ~24px`)하면 다크 배경(`bg-ink/90`) + `backdrop-blur` + 하단 hairline(`border-b border-white/10`)이 부드럽게 페이드인. transition 적용.
  - 스크롤 상태 감지를 위해 `SiteHeader`를 **client 컴포넌트("use client")** 로 전환, `useState`+`scroll` 리스너(passive, cleanup 필수).
  - 헤더가 fixed 오버레이가 되므로 히어로는 그대로(콘텐츠 하단 정렬). 헤더 텍스트는 두 상태(투명/다크) 모두 다크 배경 위이므로 흰색 유지.

### 3. 반응형 레이아웃 (현재 데스크톱 1280 고정)

브레이크포인트: Tailwind 기본. **데스크톱 레이아웃은 `lg`(1024)+**, 그 이하는 스택/축소. `content-container`가 이미 수평 패딩 반응형(1.25rem→lg:4rem) 제공하므로 이를 활용.

- **헤더**: `lg` 미만에서 데스크톱 내비/전화번호 숨김 → **햄버거 버튼** 노출. 클릭 시 드롭다운/드로어 패널(내비 링크 + 전화 + 문의하기). 열림 상태 client state. 접근성(aria-expanded, esc/외부클릭 닫기 권장).
- **Hero**: 타이포 축소(`text-hero`는 데스크톱, 모바일은 더 작게 `text-4xl`~`text-5xl` 정도), 세로 여백/`min-h` 축소, CTA 버튼 모바일 정렬 확인.
- **Who We Are**: `grid-cols-2` → 모바일 `grid-cols-1`. 장식 원형은 모바일에서 넘침 방지(overflow-hidden 유지).
- **About Business**: `grid-cols-3` → `sm:grid-cols-2`? → 모바일 `grid-cols-1`, `lg:grid-cols-3`.
- **About Service**: 에디토리얼 `grid-cols-[110px_1fr_1fr]` → 모바일 세로 스택(번호/텍스트/이미지). 짝수 행 order 교차는 `lg`+에서만 적용.
- **Footer**: `grid-cols-[1.3fr_1fr_1fr_1fr]` → 모바일 `grid-cols-2`(또는 1), `lg`+ 원래 4열.
- 섹션 세로 패딩(`py-25/30`)도 모바일에서 과하지 않게 축소 검토.

## 규칙 (엄수)

- 하드코딩 색상/토큰 금지. 기존 토큰(`docs/design.md`)만. 반응형은 Tailwind 브레이크포인트 프리픽스(`sm:`/`md:`/`lg:`)로.
- `content-container` 강제(직접 `max-w-* mx-auto px-*` 금지). 헤더 fixed는 예외적으로 내부에 content-container로 정렬.
- 슬라이스 public API(index.ts) 유지. 레이어 방향 유지.
- Props interface, `any` 금지. client 컴포넌트는 필요한 곳만(SiteHeader).
- 스크롤 리스너는 passive + cleanup. 불필요 리렌더 최소화.

## 위임 순서

1. **implementer** — 위 3항목 전부 구현 (SiteHeader client 전환+fixed+스크롤, 햄버거 반응형, Hero 정렬, 전 섹션 반응형).
2. **design (polish)** — 반응형 클래스/토큰 준수 정리, 스크롤 transition 토큰화, 하드코딩 점검.
3. **reviewer** — 의미론적 검토(토큰·FSD·client 최소화·접근성).

## 참조

- `plans/20260703-landing-design.md` — 토큰/컴포넌트 계약
- `docs/design.md` — 토큰 SSOT
- 대상: `src/widgets/site-header/*`, `src/views/landing/ui/*`(Hero/WhoWeAre/News/Business/Service/LandingView)
