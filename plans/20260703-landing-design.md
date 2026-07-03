# 20260703 Landing — Design 산출물 (Bootstrap)

design 에이전트 Bootstrap 실행 결과. 토큰 시스템 최초 구축 + 핵심 shared/ui 생성.
SSOT: `docs/design.md` · 구현: `src/app/globals.css @theme` · 원본: `docs/design-source/Ethree-Landing.dc.html`.

## 1. 최종 토큰 표 (토큰명 → OKLCH → 용도 → Tailwind 클래스)

### 색상

| 토큰          | OKLCH                   | 원본 hex        | 용도                         | 클래스                  |
| ------------- | ----------------------- | --------------- | ---------------------------- | ----------------------- |
| brand         | oklch(74.5% 0.152 130)  | #8bbf4f         | 주요 CTA 배경(라임)          | `bg-brand`              |
| brand-hover   | oklch(68% 0.15 130)     | (파생)          | 브랜드 버튼 hover            | `hover:bg-brand-hover`  |
| brand-ink     | oklch(23% 0.03 150)     | #132014         | 브랜드 버튼 위 텍스트        | `text-brand-ink`        |
| accent        | oklch(81% 0.15 130)     | #9fd35c         | 다크 위 라임 포인트          | `text-accent`           |
| surface       | oklch(96% 0.008 95)     | #f5f3ec         | 크림 페이지 배경(body)       | `bg-surface`            |
| surface-white | oklch(100% 0 0)         | #ffffff         | 카드 배경                    | `bg-surface-white`      |
| ink           | oklch(21.5% 0.019 151)  | #131c15         | 헤딩/본문 · 다크 섹션 배경   | `text-ink` / `bg-ink`   |
| ink-soft      | oklch(48% 0.022 131)    | #5a6154         | 라이트 배경 보조 본문        | `text-ink-soft`         |
| muted         | oklch(63% 0.012 122)    | #8a9080         | 메타(날짜)                   | `text-muted`            |
| olive         | oklch(43% 0.035 138)    | #4a5c42         | WHO WE ARE 밴드 배경         | `bg-olive`              |
| olive-label   | oklch(53% 0.07 135)     | #5c7a45         | 라이트 배경 eyebrow          | `text-olive-label`      |
| olive-soft    | oklch(86% 0.06 120)     | #c7dba0         | 올리브/다크 위 라벨          | `text-olive-soft`       |
| olive-muted   | oklch(69% 0.07 130)     | #8ba873         | 카드 번호 라벨(01/02/03)     | `text-olive-muted`      |
| tint          | oklch(96% 0.015 120)    | #eef3e5         | 아이콘 배경(연녹)            | `bg-tint`               |
| hairline      | oklch(0% 0 0 / 0.1)     | rgba(0,0,0,.1)  | 라이트 배경 구분선           | `border-hairline`       |

> 다크 배경 반투명은 별도 토큰 없이 `text-white/80·70·40`, `border-white/40·20·12` 사용.

### 타이포 · 라운드 · 모션

- 폰트: `font-display`(Manrope) / `font-body`(Noto Sans KR, body 기본)
- 사이즈 토큰: `text-mega` `text-hero` `text-h1` `text-h2` `text-h3` `text-logo` `text-item` `text-lead` `text-list` `text-body-sm` `text-detail` `text-meta` `text-eyebrow` `text-caption` `text-mini` (+ 기본 2xl/xl/base/sm/xs)
- 트래킹: `tracking-headline/caption/label/eyebrow/hero`
- 라운드: `rounded-card`(4) `rounded-image`(8) `rounded-pill`(28) `rounded-full`
- 모션: `duration-fast` `ease-out` · 그림자 토큰 없음(플랫)
- 컨테이너: `content-container` (max-w 1280 + 중앙정렬 + 수평 패딩)

전체 값은 `docs/design.md` 참조.

## 2. shared/ui 컴포넌트 명세

`src/shared/ui/index.ts`에서 export. 슬라이스 외부는 이 배럴로만 import.

### Button (`@/shared/ui`)

```ts
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "dark" | "outline"; // default "primary"
  size?: "sm" | "md";                        // default "md"
  children: ReactNode;
}
```

- `primary`: `bg-brand text-brand-ink hover:bg-brand-hover`
- `dark`: `bg-ink text-white hover:opacity-90`
- `outline`: `bg-transparent border border-white/40 text-white hover:bg-white/10` (다크 배경 전용)
- `sm`: 24×10 / 13px (헤더·네비) · `md`: 28×14 / 14px (히어로·섹션 CTA)
- 공통: `rounded-pill font-display font-bold`, transition 내장

### SectionLabel (`@/shared/ui`)

```ts
interface SectionLabelProps {
  children: ReactNode;
  color?: "accent" | "olive" | "olive-soft" | "olive-muted" | "muted"; // default "accent"
  size?: "sm" | "md";                                                    // default "md"
  className?: string;
}
```

- 항상 `font-display uppercase font-bold`
- `md`: `text-eyebrow tracking-eyebrow` (섹션 eyebrow) · `sm`: `text-xs tracking-label` (소형 라벨)
- color: accent(다크 위) / olive(라이트 위) / olive-soft(올리브 위) / olive-muted(카드 번호) / muted(다크 저대비)

## 3. crossTeamNotes — 섹션별 토큰/컴포넌트 매핑 (implementer용)

### layout.tsx (폰트 주입)

`next/font/google`로 두 폰트를 로드하고 **CSS 변수명을 반드시 아래로** 지정한다(globals의 `--font-display/--font-body`가 이 변수를 참조).

```
Manrope       → variable: "--font-manrope"      weight: 500,700,800
Noto Sans KR  → variable: "--font-noto-sans-kr" weight: 400,500,700,900
```

`<body>` 또는 `<html>`에 두 변수 클래스 부착. body 배경/텍스트/폰트는 globals base에서 이미 적용됨.

### Header / Nav (히어로 위 오버레이, 다크 투명)

- 로고: `font-display font-extrabold text-logo text-white` + `이쓰리` `text-eyebrow text-white/60`
- 메뉴 링크: `text-sm font-medium text-white/80`
- 전화번호: `text-eyebrow text-white/55` (token 대응: white/55는 기본 opacity 유틸)
- 문의하기 버튼: `<Button variant="primary" size="sm">`

### Hero (다크 배경 이미지 placeholder)

- eyebrow: `<SectionLabel color="accent">ENVIRONMENT IT SOLUTION GROUP</SectionLabel>` + `tracking-hero` 필요 시 className 추가
- 헤드라인: `font-display text-hero font-extrabold text-white tracking-headline`
- 리드문: `text-lead text-white/80 max-w-[600px]` → 600px는 token 없음, `max-w-xl`(576) 또는 근사. 아래 unresolvedIssues 참고
- CTA: `<Button variant="primary">사업 소개 보기</Button>` + `<Button variant="outline">문의하기</Button>`
- 배경: 실제 사진 자리. 임시 `bg-ink` + 다크 오버레이. 사진 교체 대비 컴포넌트화 권장.

### Who We Are (올리브 밴드)

- 섹션 배경: `bg-olive`, 수직 `py-25`, 내부 `content-container`
- eyebrow: `<SectionLabel color="olive-soft">WHO WE ARE</SectionLabel>`
- 헤딩: `font-display text-h1 font-extrabold text-white`
- 설명: `text-base text-white/80 leading-[1.8]` (line-height 1.8 → `leading-8` 근사 또는 body-sm 계열)
- 항목 라벨(ENVIRONMENT/IT SOLUTION): `<SectionLabel color="olive-soft" size="sm">`
- 항목 제목: `text-item font-bold text-white` · 항목 설명: `text-detail text-white/75`
- 아이콘 원: `bg-white/10 border border-white/20 rounded-full`, 구분선 `border-white/12`

### News (크림 배경 리스트)

- 섹션: `bg-surface py-25`, `content-container`
- eyebrow: `<SectionLabel color="olive">NEWS</SectionLabel>` · 전체보기: `text-eyebrow font-bold text-ink`
- 리스트 행: `border-t border-hairline` (마지막 행 `border-b`)
- 제목: `text-list font-medium text-ink` · 날짜: `text-meta text-muted`
- NEWS 데이터는 컴포넌트 밖 상수/props로 분리(향후 Supabase 후보)

### About Business (크림 배경 3카드)

- 섹션: `bg-surface py-30`, `content-container`
- eyebrow: `<SectionLabel color="olive">ABOUT BUSINESS</SectionLabel>`
- 헤딩: `font-display text-h2 font-extrabold text-ink` · 설명: `text-body-sm text-ink-soft`
- 카드: `bg-surface-white border border-hairline rounded-card` padding `p-10` 계열(40/32 근사)
- 카드 아이콘 배경: `bg-tint rounded-full` · 번호: `<SectionLabel color="olive-muted" size="sm">01</SectionLabel>`
- 카드 제목: `text-xl font-bold text-ink` · 본문: `text-detail text-ink-soft`
- CTA(중앙): `<Button variant="dark">E3 BUSINESS 자세히보기</Button>`

### About Service (다크 섹션, 에디토리얼 3행)

- 섹션: `bg-ink py-30`, `content-container`
- 헤더 eyebrow: `<SectionLabel color="accent">ABOUT SERVICE</SectionLabel>` · 헤딩 `text-h2 text-white`
- 헤더 하단 divider: `border-b border-white/12`
- 대형 번호: `font-display text-mega font-extrabold text-accent/35` (rgba(159,211,92,.35) = accent + /35)
- 로우 라벨: `<SectionLabel color="accent" size="sm">공간정보 · GIS</SectionLabel>`
- 로우 제목: `text-h3 font-bold text-white` · 설명: `text-body-sm text-white/70`
- 이미지 박스: `rounded-image` placeholder (사진 자리, 임시 `bg-white/5` 등)
- 행 구분: `border-b border-white/12` · 짝수 행은 이미지/텍스트 order 교차
- CTA(중앙): `<Button variant="primary">E3 SERVICE 자세히보기</Button>`

### Footer (다크)

- 섹션: `bg-ink py-20`, `content-container`
- 로고: `font-display text-2xl font-extrabold text-white`
- 회사정보: `text-meta text-white/60 leading-loose`
- 컬럼 라벨: `<SectionLabel color="muted" size="sm" className="tracking-caption">ABOUT E3</SectionLabel>`
  (푸터 라벨은 12.5px/.1em → `text-caption tracking-caption`가 더 정확. SectionLabel 대신 직접 마크업도 허용)
- 링크: `text-sm text-white/70` · 연락처: `text-meta text-white/50`
- 상단 divider: `border-b border-white/12` · 카피라이트: `text-caption text-white/35`

## 4. unresolvedIssues (토큰 추가 필요 / 결정 대기)

- **max-w 600px / 440px / 460px / 420px** (히어로 리드문·설명 문단 폭): 토큰 없음. 기본 `max-w-xl`(576)/`max-w-md`(448)/`max-w-lg`(512) 근사 사용 권장. 픽셀 정확도가 필요하면 measure 토큰 추가 검토 → 현재는 근사 유틸 허용, 하드코딩 `max-w-[600px]` 금지.
- **푸터 컬럼 라벨(12.5px/.1em)**: SectionLabel size 프리셋(md=13/.2em, sm=12/.14em)과 미세 상이. `text-caption tracking-caption`로 직접 마크업하거나 className 오버라이드. 3곳 이상 반복 확정 시 SectionLabel size="xs" 프리셋 추가 검토.
- **white opacity 세부값(55/65/78/82)**: 기본 opacity 유틸 정수 근사(/60,/70,/80)로 통일. 시각 차이 미미, 디자인 승인 시 확정.
- 히어로/서비스 이미지 placeholder는 실제 사진 교체 예정 → 배경은 임시 토큰 사용, 사진 자리 컴포넌트화 권장.
