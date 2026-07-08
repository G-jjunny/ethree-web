# About Business 솔루션 이미지 3단 캐러셀 재구성 작업 계획

## 목표

랜딩 "About Business" 섹션을 레퍼런스 스타일 이미지 3단 캐러셀(중앙 큰 카드 + 좌우 프리뷰 + 원형 화살표)로 재구성. 헤딩/서브타이틀 중앙정렬, 카드 이미지+이름 항상 노출, 설명은 hover 오버레이(모바일 폴백 포함).

## 범위

- 수정: `src/views/landing/ui/BusinessSection.tsx` (서버, 중앙 헤딩/서브타이틀 + 캐러셀 조립)
- 신규: `src/views/landing/ui/business-solutions.data.ts` (기존 BUSINESS_CARDS + `imageSrc?` 필드)
- 신규: `src/views/landing/ui/SolutionCarousel.tsx` (`"use client"` 캐러셀)
- Supabase 스키마 변경: 없음
- 신규 shared/ui 컴포넌트: 없음 (뷰-로컬 캐러셀, 기존 SectionHeader/Button 재사용)

## 요구사항 요약

1. 헤딩: 기존 "ABOUT BUSINESS" / "환경과 융합된 다양한 솔루션 개발" 그대로, 중앙정렬. 우측 설명 문단 → 헤딩 아래 중앙 서브타이틀(문구 보존). 헤딩명 변경 금지.
2. 이미지 3단 캐러셀: 3솔루션(SI/R&D/Consulting) 중앙 강조 + 좌우 peek 카드(scale↓/opacity↓) + 이전/다음 원형 화살표(무한 루프, 탭바 없음). autoplay 미적용.
3. 카드 = 이미지(placeholder + next/image 슬롯) + 이미지 아래 솔루션 이름(항상 노출).
4. 설명은 hover 오버레이(desktop). 모바일/터치 폴백: 활성 카드 설명 노출 또는 탭 토글(설명이 숨지 않게).

## 구현 스펙

- 데이터: BUSINESS_CARDS(no/title/description) 유지 + `imageSrc?: string`(지금은 미지정=placeholder). shape 필드는 IconCard 미사용 시 제거 판단(implementer).
- 구조: BusinessSection(서버) = 중앙 SectionHeader/서브타이틀 + `<SolutionCarousel solutions={...} />`. 캐러셀만 클라이언트 경계.
- SolutionCarousel(client): activeIndex state, prev/next 핸들러(원형 화살표, aria-label), 무한 루프, framer-motion(motion/react) 또는 CSS transform 전환, reduced-motion(useSyncExternalStore 패턴, HeroCarousel 참고) 배려.
- 카드: rounded-image 영역 + placeholder bg + next/image 슬롯 주석, group-hover 오버레이(bg-ink 등 기존 토큰 + white 텍스트, description), 하단 title 항상 노출.
- "자세히보기" 버튼: 캐러셀 아래 중앙 유지(디자인 판단).

## 규칙

- 토큰 하드코딩 0, 신규 색상 0, content-container 유지, any 금지, Props interface, 반응형(sm:/lg:).
- 위계는 scale/weight/여백(원칙1), 컬러 절제(원칙2). 상호작용만 클라 경계. FSD 정방향, 슬라이스 index.ts.
- 문구·데이터 보존(솔루션 설명 원문 유지). 다른 섹션 훼손 금지.

## 위임 순서

1. implementer — 데이터(imageSrc 필드), SolutionCarousel 클라 로직(activeIndex/prev·next/무한루프/reduced-motion), BusinessSection 서버 조립(중앙 헤딩).
2. design (polish) — 중앙정렬 헤딩, 3단 center-focus 레이아웃, 원형 화살표, hover 오버레이(+모바일 폴백), 카드/이미지/이름 타이포·토큰.
3. reviewer — 원칙 준수·토큰·클라 경계·접근성(화살표/오버레이 aria·모바일 폴백·reduced-motion)·반응형·문구 보존.

## 참조 파일

- src/views/landing/ui/HeroCarousel.tsx (클라 캐러셀·next/image placeholder·reduced-motion 패턴)
- src/views/landing/ui/hero-slides.data.ts (뷰-로컬 데이터 상수 패턴)
- docs/design.md (디자인 원칙: 위계·컬러 절제·상태 UI)
- src/shared/ui/index.ts (SectionHeader, Button)
