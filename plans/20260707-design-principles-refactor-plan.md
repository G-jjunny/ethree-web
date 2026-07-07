# 디자인 원칙 사이트 전반 적용 리팩터 작업 계획

## 목표

docs/design.md의 "## 디자인 원칙 (Design Principles)" 3원칙을 사이트 전반에 적용한다. 공통/공유 요소(섹션 헤더, placeholder 위젯, shared/ui, 메타 텍스트)를 우선 리팩터해 사이트 전체에 일관 전파하고, 페이지 레벨은 원칙 기반 정돈(급진 리스타일 아님).

## 적용 3원칙 (design.md SSOT)

1. 정보 위계·타이포: weight·자간·스케일·여백으로 경중 구분. 핵심=bold/extrabold+큰 스케일, 보조/메타=medium+작은 스케일(text-detail/text-meta/text-caption)+낮은 대비(text-ink-soft/text-muted).
2. 컬러 절제: 무채색 기본, key color 1~2개(brand/accent+olive)만 포인트. 신규 색상 0.
3. 상태별 UI 분기: 조건부 상태=Badge/Tag(key color), 일반 정보성=텍스트+text-muted/text-meta 컬러 분기만(테두리/배경 제거).

## 범위 (레이어)

### A. 공통/공유 (최우선)
- shared/ui: SectionLabel, Button, IconCard, FormStatusBanner
- widgets/placeholder-page: PlaceholderHeader, PlaceholderSubNav, PlaceholderPage, PlaceholderHub
- 섹션 헤더 패턴(eyebrow + h2 + 설명) 전 뷰 일관화
- 메타 텍스트 패턴(뉴스 날짜, 실적 연도/발주처, careers 제출 메타)

### B. 페이지 레벨 정돈 (구조·콘텐츠 보존)
- views: landing, about-greeting, about-history, about-location, business-intro, business-service, support-news, support-culture, support-careers

### Badge (원칙3)
- 현재 shared/ui에 Badge 미구현. 일반 정보성 상태는 텍스트+미니멀 컬러로 정리.
- 조건부 상태 뱃지가 실제 필요한 1곳(예: 관리자 뉴스 발행/초안)에 한해 design 판단으로 shared/ui Badge(status variant, key color) 최소 신설 가능. 추가 시 design.md 공용 컴포넌트 목록 갱신.

## 제약

- 기존 토큰만(신규 색상 0). 하드코딩 금지. content-container 강제.
- 콘텐츠·문구·데이터·기능 전부 보존. 텍스트 변경 금지. 로직/Supabase/features 로직 무변경. 순수 마크업/className 리팩터.
- 급진 리디자인 아님. 기존 밴드 리듬·레이아웃 골격 유지.
- FSD 정방향, 슬라이스 index.ts, 서버/클라 경계 유지. any 금지, Props interface. 반응형 유지.
- 관리자 대시보드/proxy/로그인/폼 기능 로직 훼손 금지(비주얼 정리는 가능).

## 위임 순서

1. design (감사 + 리팩터) — frontend-design 선언. 3원칙 기준 사이트 감사 → 공통 요소 우선 리팩터 → 페이지 레벨 정돈. 필요 시 Badge 최소 신설. 변경 전/후 요약.
2. (필요 시) implementer — 구조 변경·Badge 신설 등 비-순수-className 보조.
3. reviewer — 원칙 준수·토큰 하드코딩 0·콘텐츠 보존·FSD·반응형·과도 변경 여부 검토.

## 검증

- Hook lint+tsc, npm run build(Next 16) 통과. 모든 라우트 정상.
- 완료 보고: 이슈/브랜치/PR, 변경 공통 요소 + 페이지별 요약, 신규 컴포넌트, 콘텐츠/기능 보존 확인, reviewer 결과.

## 참조 파일

- docs/design.md (디자인 원칙 SSOT)
- docs/legacy-site-reference.md (콘텐츠 구조 참고)
