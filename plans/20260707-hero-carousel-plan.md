# 히어로 캐러셀 작업 계획

## 목표

랜딩 히어로 섹션을 Eco / Environment / Education 3슬라이드 자동 캐러셀(autoplay, hover 정지, 클릭 이동, `01_02_03_` 인디케이터)로 재구성한다. 레이아웃은 고정하고 콘텐츠·배경만 전환.

## 범위

- 레이어/슬라이스: `views/landing` (뷰-로컬)
  - 신규: `src/views/landing/ui/hero-slides.data.ts` (데이터 상수 + 타입)
  - 신규: `src/views/landing/ui/HeroCarousel.tsx` (`"use client"` 캐러셀 로직/레이아웃)
  - 수정: `src/views/landing/ui/HeroSection.tsx` (HeroCarousel 렌더로 교체 배선, 서버 컴포넌트 유지 가능)
- Supabase 스키마 변경: 없음
- 신규 shared/ui 컴포넌트: 없음 (뷰-로컬 구현, 기존 토큰만)

## 요구사항 요약

1. 3슬라이드 autoplay(5초), hover 시 pause, 인디케이터 클릭 시 이동 + 타이머 리셋.
2. 각 슬라이드 키워드 = Eco / Environment / Education.
3. 슬라이드 전환 시 레이아웃 고정(키워드·태그라인·본문·인디케이터 위치 불변, 콘텐츠·배경 이미지만 교체).
4. 인디케이터 `01_02_03_` 형태(숫자 텍스트 + 막대(_) 요소), 콘텐츠 맨 아래, 현재 슬라이드 강조.
5. CTA 버튼 제거.

## 슬라이드 레이아웃 (위→아래, 하단 정렬)

- 키워드: `text-hero`~`text-mega` `font-extrabold` (반응형 sm:/lg:)
- 태그라인: 중간 (`text-h3`/`text-2xl`)
- 본문: `text-lead`/`text-body-sm` `text-white/80`
- 인디케이터: `01_ 02_ 03_` 숫자(`font-display`) + 막대, 현재=강조(accent/white) 나머지=white/40

## 데이터 초안 (편집 가능 상수)

- Eco / `your future, our vision.` / `이쓰리는 환경을 생각하는 기술로 더 나은 내일을 설계합니다. 환경 데이터 기반 정책 연구부터 시스템 구축·운영까지, 지속가능한 미래를 만듭니다.`
- Environment / `IT solution, for nature.` / `환경부와 산하기관의 대표 시스템을 기획·개발·구축·운영합니다. 국토환경성평가지도부터 환경영향평가까지, 국가 환경 인프라를 책임집니다.`
- Education / `knowledge, we share.` / `기후세미나와 연구를 통해 환경 지식을 나누고, 전문가와 함께 기후위기 대응 역량을 키워갑니다.`

`HeroSlide { id; keyword; tagline; body; imageSrc? }`

## 위임 순서

1. implementer — hero-slides.data.ts, HeroCarousel 클라 로직(autoplay/pause/jump/타이머 cleanup), HeroSection 교체 배선. 기능 우선(마크업은 최소 골격).
2. design (polish) — 슬라이드 위계·하단정렬 레이아웃, `01_02_03_` 인디케이터, 배경 placeholder + 다크 스크림, 토큰·전환(cross-fade/slide) 폴리시.
3. reviewer — 원칙 준수·토큰 하드코딩 0·클라 경계·타이머 cleanup·접근성(reduced-motion/aria-current/aria-label)·반응형 검토.

## 구현 제약

- autoplay 5초, hover pause, 인디케이터 클릭 이동 + 타이머 리셋. `useState` activeIndex + `useEffect` 타이머(cleanup 필수, set-state-in-effect 주의).
- 배경: 슬라이드별 placeholder + next/image 교체 슬롯(실제 이미지 미확보 — 교체 주석). 다크 스크림 유지.
- 접근성: 인디케이터 버튼 `aria-label`/`aria-current`, `prefers-reduced-motion` 시 autoplay 정지.
- 토큰 하드코딩 0(기존 토큰만, 신규 색상 0), content-container 유지, `any` 금지, Props interface, 반응형(sm:/lg:), FSD 정방향, 슬라이스 index.ts 유지. 다른 섹션 훼손 금지.
- 신규 패키지 금지. 전환은 framer-motion(motion/react, 이미 의존성) 또는 CSS transition.

## 참조 파일

- src/views/landing/ui/HeroSection.tsx (현재 정적 히어로 — 교체 대상)
- src/shared/ui/LogoCarousel.tsx (motion/react 사용 선례)
- docs/design.md (토큰 SSOT: text-hero/mega/h3/lead/body-sm, font-display, tracking-hero/headline)
- src/shared/constants/site.ts (SITE 상수)
