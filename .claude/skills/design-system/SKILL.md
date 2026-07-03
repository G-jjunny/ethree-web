---
name: design-system
description: 이 프로젝트의 디자인 토큰 규칙. 마크업/className 작업 시 자동 로드.
---

# 토큰 사용 규칙

SSOT: `docs/design.md` · 구현: `src/app/globals.css @theme` · 공용 컴포넌트: `src/shared/ui/index.ts`.
**하드코딩 절대 금지.** `bg-[#...]` `text-[#...]` `p-[..]` `rounded-[..]` `style={{color}}` 전부 금지.
불가피하면 값 옆에 `{/* token 없음: 이유 */}` 주석 + 보고서 unresolvedIssues 기재.

## 언제 무슨 클래스를 쓰나

### 색상

- 페이지 배경(크림): `bg-surface` — body 기본값이라 대개 생략 가능
- 카드 배경(흰색): `bg-surface-white`
- 다크 섹션 배경: `bg-ink` · 올리브 밴드 배경: `bg-olive`
- 라이트 배경 헤딩/본문: `text-ink` · 보조 본문: `text-ink-soft` · 메타(날짜): `text-muted`
- 주요 CTA: `bg-brand text-brand-ink hover:bg-brand-hover`
- 포인트(다크 위 라임): `text-accent`
- eyebrow: 라이트 위 `text-olive-label` · 올리브 위 `text-olive-soft` · 카드 번호 `text-olive-muted`
- 아이콘 배경(연녹): `bg-tint`
- 라이트 hairline 보더: `border-hairline`

### 다크/올리브 배경 위 반투명 (하드코딩 아님 — 기본 토큰 + opacity)

- 본문 강/약: `text-white/80` · `text-white/70`
- 저대비 라벨/카피: `text-white/40`
- divider: `border-white/12` · 아이콘 원: `border-white/20` · outline 버튼: `border-white/40`

### 타이포

- 폰트: 영문/숫자/eyebrow → `font-display`(Manrope), 한글 본문 → `font-body`(기본)
- 사이즈(네이밍 토큰): `text-hero`(64) `text-mega`(72) `text-h1`(38) `text-h2`(36) `text-h3`(28)
  `text-logo`(26) `text-item`(19) `text-lead`(17) `text-list`(15.5) `text-body-sm`(15)
  `text-detail`(14.5) `text-meta`(13.5) `text-eyebrow`(13) `text-caption`(12.5) `text-mini`(11)
- 기본 유틸 그대로: `text-2xl`(24) `text-xl`(20) `text-base`(16) `text-sm`(14) `text-xs`(12)
- 웨이트: `font-medium/bold/extrabold/black`
- 트래킹: `tracking-headline`(-.01) `tracking-caption`(.1) `tracking-label`(.14) `tracking-eyebrow`(.2) `tracking-hero`(.22)

### 라운드 / 스페이싱 / 모션

- 라운드: `rounded-card`(4) `rounded-image`(8) `rounded-pill`(28) `rounded-full`
- 스페이싱: Tailwind 기본 4px 그리드. 섹션 수직 `py-30`(120)/`py-25`(100)/`py-20`(80)
- 모션: `duration-fast` `ease-out` (그림자 토큰은 없음 — 플랫 디자인)

### content-container (강제)

섹션 내부 래퍼는 `content-container`만 사용. `max-w-* mx-auto px-*` 직접 금지.

## 공용 컴포넌트 우선

작업 전 `src/shared/ui/index.ts` 확인. 동일 역할 마크업 중복 금지.

- CTA → `<Button variant="primary|dark|outline" size="sm|md">`
- eyebrow/소형 라벨 → `<SectionLabel color="accent|olive|olive-soft|olive-muted|muted" size="md|sm">`

반복 패턴 3곳 이상이면 shared/ui에 추가 후 index.ts export.

## 재사용 우선 순서

기존 토큰 재사용 → shared/ui 재사용 → 3곳 이상 반복 시 shared/ui 추가 → 그래도 없으면 design.md 갱신 후 구현.
변경의 기본값은 "추가"가 아니라 "재사용".
