# business-intro (사업소개) 작업 계획

## 목표
About Business 기본 진입 페이지인 `/business/intro`를 PlaceholderPage에서 실콘텐츠(사업 개요 · SI/R&D/Consulting 사업영역 · 사업실적 탐색)로 전환한다.

## 범위
- 레이어: shared(constants, lib), views/business-intro(신규), app(marketing) 라우트
- Supabase 스키마 변경: 없음 (getter-seam 상수 패턴, 추후 스왑)
- 신규 shared/ui 컴포넌트: 없음 (기존 IconCard/SectionLabel/Button 재사용)

## 위임 순서
1. implementer — projects.ts 모델+시드+getter, site.ts defaultHref, page 조립, 뷰 섹션 스캐폴딩·배선, ProjectsExplorer 클라이언트 필터 로직
2. design (polish) — 전 섹션 마크업/토큰/밴드 리듬, SI/R&D/Consulting 이미지-리드 에디토리얼 레이아웃, 사업실적 스캔 UX 시각 정리
3. reviewer — 토큰 준수·FSD·getter-seam·원문 보존·클라이언트 경계 최소화 검토

## 확정 방향
- 사업실적: 연도 필터 칩 + 리스트(발주처·프로젝트명, hairline 구획). 편집 단위 = 프로젝트 1건.
- 데이터 관리: getter-seam 상수 패턴 (history.ts/news.ts와 동일). getter 내부만 추후 Supabase 스왑.
- SI/R&D/Consulting 이미지: next/image 교체 슬롯 플레이스홀더 (landing ServiceSection 패턴).
- 밴드 리듬: 크림(header/intro) → 다크(사업영역) → 크림(사업실적).
- 서버 컴포넌트 기본, 상호작용(연도 필터)만 ProjectsExplorer 클라이언트 경계로 격리. getter는 서버(ProjectsSection)에서 호출 후 props 전달.

## 수정 파일
- src/shared/constants/site.ts — `/business` NAV_GROUP에 `defaultHref: "/business/intro"` 추가
- src/app/(marketing)/business/intro/page.tsx — PlaceholderPage → BusinessIntroView, buildMetadata 유지
- src/shared/lib/index.ts — projects 타입/getter export

## 생성 파일 — 데이터
- src/shared/lib/projects.ts (history.ts getter-seam 패턴)
  - interface BusinessProject { id: string; year: number; client: string; title: string; }
  - const BUSINESS_PROJECTS: readonly BusinessProject[] (reverse chronological, 각 항목 안정적 id)
  - getBusinessProjects(): readonly BusinessProject[] (flat)
  - getProjectYears(): number[] (desc, 파생)
  - 파일 상단 주석: 레거시(ethree.co.kr) 조회 요약본 기반, 정확도 검증 필요(관리자 편집 대상)
  - 시드 데이터:
    - 2025: 그린소사이어티 2차년도(현대정몽구재단) / 환경영향평가 EIASS 이전 및 유지관리(국립환경과학원) / 국토환경정보시스템 유지관리(한국환경연구원) / 생태관광 홈페이지 유지관리(환경부) / 스마트교육환경정보시스템 구축(한국교육환경보호원)
    - 2024: 산림재해시각화플랫폼 설계(현대정몽구재단) / 토지이용 MRV 체계 구축(환경부) / 생태관광 홈페이지 운영(한국환경연구원) / 기후위험 정보지원시스템 ISP(국립환경과학원)
    - 2023: 국토환경정보시스템 유지관리(한국환경연구원) / 환경영향평가 시스템 유지보수(환경부)
    - 2022: 생태관광 홈페이지 운영(국립환경과학원) / 기후위기 적응정보 종합플랫폼(한국환경연구원)
    - 2021: 자연환경해설사 관리시스템(한국생태관광협회) / 국가생태탐방로 운영개선(환경부)
    - 2020: 제주도 환경자원총량관리계획(제주특별자치도)
    - 2019: 환경정보 융합 빅데이터 플랫폼(환경부) / 폐기물직매립 제로화관리시스템(한국환경공단)
    - 2018: 환경영향평가 데이터전환(한국환경정책평가연구원)

## 생성 파일 — 뷰 (views/business-intro/, about-history 구조 미러)
- index.ts — BusinessIntroView만 공개
- ui/BusinessIntroView.tsx — PlaceholderHeader "ABOUT BUSINESS"/"사업소개" + PlaceholderSubNav activeHref="/business/intro" + 섹션 조립. 밴드 리듬 크림→다크→크림.
- ui/IntroSection.tsx — 사업 개요 리드. bg-surface. 헤더와 합칠 수 있으면 합침.
- ui/BusinessAreasSection.tsx — SI/R&D/Consulting 이미지-리드 에디토리얼 로우. bg-ink 다크. ServiceSection 교차 로우 패턴 재사용, 이미지 메인 비중.
  - SI/R&D/Consulting 설명 원문 = landing BusinessSection의 BUSINESS_CARDS 문구 재사용
  - Consulting 세부 6항목 불릿: 환경분야 종합 솔루션 컨설팅 / 법규 및 기준 적합성 컨설팅 / 환경관리계획 수립 컨설팅 / 정보화 전략 계획 수립 컨설팅 / 비즈니스 프로세스 및 전략 컨설팅 / 아웃소싱 컨설팅
  - 데이터는 뷰-로컬 모듈 상수. 이미지 = next/image 교체 슬롯 플레이스홀더(주석).
- ui/ProjectsSection.tsx — 사업실적(핵심). 서버 컴포넌트. getBusinessProjects()/getProjectYears() 호출 → 헤더(라벨+h2+파생 집계 예: 총 실적 건수) + ProjectsExplorer에 props 전달. bg-surface.
- ui/ProjectsExplorer.tsx — "use client". 연도 필터 칩(전체/연도별, useState 활성 연도) + 필터된 실적 리스트(발주처·프로젝트명, hairline 구획). 서버 props만 소비.

## 규칙
- 토큰 하드코딩 0, content-container 강제, any 금지, Props interface, 반응형(sm:/lg:), 원문 무변경.
- FSD 정방향 import, 슬라이스 index.ts 경유. 신규 색상/토큰 필요 시 design.md 갱신 후 사용(가급적 기존 토큰만).

## 참조 파일
- src/views/landing/ui/ServiceSection.tsx (에디토리얼 로우/이미지 슬롯/다크 밴드)
- src/views/landing/ui/BusinessSection.tsx (SI/R&D/Consulting 원문 문구)
- src/views/about-history/ui/HistoryView.tsx (뷰 조립 패턴)
- src/shared/lib/history.ts, news.ts (getter-seam)
- src/shared/ui/{IconCard,SectionLabel,Button}.tsx, src/widgets/placeholder-page/ui/*

## 검증
- Hook 자동 lint+tsc. `npm run build` 통과. 수동: /business/intro 진입, 연도 필터 동작, 이미지 슬롯 반응형, About Business 클릭 시 /business/intro 진입(defaultHref).
