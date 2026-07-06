# 연혁 및 비전 페이지 작업 계획 (`/about/history`)

## 목표

`/about/history`(연혁 및 비전)를 placeholder에서 실콘텐츠 페이지로 전환. 기존 랜딩·인사말 페이지와 **디자인 일관성** 유지(배경 밴드 리듬, 기존 토큰, PlaceholderHeader/SubNav 공용 헤더).

## 핵심 요구사항 (사용자)

1. **디자인 일관성** — 랜딩/인사말과 한 사이트로 보이게(크림↔다크↔올리브 밴드, Manrope 대형 타이포, hairline 구획, IconCard/에디토리얼 패턴).
2. **연혁 타임라인은 상수 관리** — 추후 관리자 CRUD로 추가/수정 예정 → 하드코딩 금지. `shared/lib/news.ts`와 동일 패턴으로 `shared/lib/history.ts`에 타입+상수+getter. 교체 시 함수 내부만 Supabase 쿼리로 바꾸면 됨.
3. **타임라인 콘텐츠가 방대(16개 연도·약 50항목)** → UI/UX 고려(스캔 용이성, 밀도 관리).
4. **비전 등 다른 섹션도 포함**.

## 데이터 모델 (`src/shared/lib/history.ts`)

```ts
export type HistoryCategory = "patent" | "award" | "cert" | "business";
// patent 특허 · award 수상·표창 · cert 인증·등록 · business 사업·연구

export interface HistoryEvent {
  id: string;
  year: number;
  title: string;
  category: HistoryCategory;
}

// 최신 연도 먼저(reverse chronological). 관리자 CRUD 대비 flat 배열.
const HISTORY_EVENTS: readonly HistoryEvent[] = [ /* 아래 콘텐츠 */ ];

export function getHistoryEvents(): readonly HistoryEvent[] { return HISTORY_EVENTS; }
// UI에서 연도별 그룹핑은 파생 함수로(상수는 flat 유지 → admin 편집 단위 = 이벤트 1건)
export function getHistoryByYear(): { year: number; events: HistoryEvent[] }[] { /* group + sort desc */ }
```

카테고리 태그 라벨/색(기존 토큰만):
- patent(특허): `text-accent` 계열 태그
- award(수상·표창): `text-brand` 계열
- cert(인증·등록): `text-olive-muted` 계열
- business(사업·연구): `text-ink-soft` 계열
(정확한 태그 스타일은 design 판단, 기존 토큰 범위 내)

### 연혁 타임라인 원문 데이터 (ethree.co.kr/history.do, reverse chronological)

> ⚠️ WebFetch(요약모델 경유)로 확보 — 게시 전 원문 최종 대조 권장. 어차피 admin으로 수정 가능.

- **2025** — 딥러닝 기반 산불연무 확산속도 예측 알고리즘 개발(business) / 그린소사이어티(정몽구재단)(business) / 특허등록: 산사태·산불 진단 알고리즘을 적용한 산사태·산불 예방 및 대비 목적의 플랫폼시스템(patent) / 이쓰리 X 고려대 오정리질리언스 기후세미나 개최(business)
- **2024** — 특허등록: AI 분석을 통해 고품질 재활용품 분류를 위한 오염도 분석과 배출 정보 제공 방법 및 장치(patent) / 벤처기업확인(혁신성장유형)(cert) / 이노비즈인증(갱신)(cert)
- **2023** — 특허등록: 웹 입력기를 통한 모니터링 정보 입력 및 제공방법 및 컴퓨터장치(patent) / 특허등록: 환경데이터를 활용한 웹지도 기반 공간분석 방법 및 컴퓨터장치(patent)
- **2022** — 인공지능학습용 데이터 구축 지원사업(business) / 전문연구사업자 신고(cert)
- **2021** — 혁신시제품 지정: 훼손지 관리 및 복원 우선순위 대상지역 선정서비스(조달청)(cert) / 특허등록: 훼손 인과관계를 이용하여 훼손유형을 분류하는 방법(patent) / 특허등록: 복원우선순위 대상지역을 선정하는 방법(patent)
- **2020** — 벤처기업협회 우수회원 표창(award) / 특허등록: 무인항공기를 이용한 미세먼지 측정장치(patent) / 본사이전(성수동 생각공장 데시앙플렉스 816호)(business) / 특허등록: 센서의 교체 시점을 결정하는 대기질 측정장치(patent) / ICT기반 환경영향평가 의사결정지원 기술 개발(business) / 온실가스 저감을 위한 국토도시공간 계획 및 관리기술 개발(국토교통부)(business)
- **2019** — 광주광역시장 표창(award) / 특허등록: 환경정보기반 경로정보 제공장치 및 방법(patent) / 특허등록: 유해물질 배출시설물 예측장치(patent)
- **2017** — 과학기술정보통신부 장관 표창(조흔우)(award)
- **2015** — 특허출원: 영유아 지킴이 서비스 시스템 국제 특허 출원(patent) / 스마트환경창업대회 우수상(환경부장관상, 아이마음)(award) / 특허등록: 음식물류 폐기물 수거차량의 악취제거 시스템(patent) / 2015 에코톤(환경ICT 아이디어 공모전) 우수상(award) / 한국 오픈소스 GIS포럼 우수상(award)
- **2014** — 환경정보활용 창업대회 우수상(환경부장관상, 쓰레기 잘 버리기 프로젝트)(award) / 환경부장관 표창(이쓰리)(award) / 폭염건강 위해정보 어플리케이션 프로그램 등록(cert) / 특허등록: 폭염예측 프로그램이 기록된 기록매체 및 이를 이용한 폭염적응키트(patent)
- **2013** — 환경부장관 표창(조흔우)(award)
- **2012** — 환경 컨설팅 회사 등록(서울시)(cert)
- **2011** — 기업부설연구소 설립(한국산업기술진흥협회)(business)
- **2010** — 소프트웨어산업협회 소프트웨어 사업자 등록(cert) / (주)이쓰리 설립(business)

## 페이지 섹션 구성 (design 최종 확정)

기존 페이지처럼 `views/about-history/` 신설, 섹션 컴포넌트 분리. 공용 헤더(PlaceholderHeader "ABOUT E3" / "연혁 및 비전" + PlaceholderSubNav activeHref="/about/history") 사용.

1. **Header** — 공용 PlaceholderHeader + SubNav (인사말과 동일 패턴).
2. **Vision 섹션** — 회사 모토 + 향후 방향 문구 + E3 비전 로드맵. 신뢰감 있는 밴드(다크 or 올리브). 로드맵(E3 2014/2015/2023)은 원본 그대로이나 연도가 과거라 어색 → **마일스톤/방향성 서술로 프레이밍**(연도 강조를 낮추거나 "비전 로드맵"으로 표기). design 판단.
   - 모토: "직원들의 행복, 고객의 행복과 이익을 우선함을 회사의 모토로 삼아 꾸준히 노력해 왔습니다."
   - 향후: "안정적인 성장동력 사업으로 수익사업을 확대해 지속적인 성장을 꾀하며 사회에 공헌하도록 성실히 노력하겠습니다."
   - 로드맵: E3 2014 환경 IT 전문화 기반 조성 / E3 2015 환경·융합서비스 으뜸 회사 성장기반 구축 / E3 2023 대한민국 환경·융합 서비스 으뜸 회사
3. **History 타임라인 섹션** — 이 페이지의 핵심. `getHistoryByYear()` 소비, reverse chronological. **방대한 콘텐츠 UX**:
   - 좌: 대형 연도(Manrope, sticky 느낌) / 우: 해당 연도 이벤트 리스트(hairline 구획) — "인덱스형" 2열 타임라인(스캔 빠름). 모바일은 연도 헤더 + 리스트 스택.
   - 세로 스파인 라인 + 연도 마커로 타임라인감. 각 이벤트에 카테고리 태그(특허/수상·표창/인증·등록/사업·연구).
   - 밀도 관리: 넉넉한 행간·연도 간 여백, 태그로 유형 빠른 식별. (연도가 많으므로 접기/필터는 이번 범위 밖 — 우선 스캔 좋은 정적 타임라인. 필요 시 후속.)
   - 통계 요약(선택): 상단에 "설립 20XX / 특허 N건 / 수상 N건" 같은 집계를 파생값으로 보여주면 신뢰·요약성 ↑ (design 판단, 하드코딩 금지 — 배열에서 count 파생).
4. **Partners 섹션(선택, 신뢰 요소)** — 환경부·유역환경청·한국환경연구원 등 협력사명 그리드. 로고 없이 텍스트. (원한다면 별도 상수. 이번 범위에 넣을지 design/orchestrator 판단 — 넣는 쪽 권장, 신뢰감 강화.)

## 규칙

- 콘텐츠 텍스트 임의 변경·요약 금지(원문 유지). 기존 토큰만(신규 색상 0, 불가피 시 주석+보고). `content-container` 강제. 서버 컴포넌트. Props interface, `any` 금지. 반응형(`lg:`).
- 타임라인·비전·파트너 데이터는 **하드코딩 금지 → 상수/lib**. 타임라인은 `shared/lib/history.ts`(news 패턴). 비전/파트너도 컴포넌트 밖 상수로(간단하면 섹션 파일 상단 모듈 상수 허용, 타임라인만은 반드시 shared/lib).
- FSD: `views/about-history` 신설. 재사용 컴포넌트(태그 등)가 3곳↑면 shared/ui, 아니면 view 전용.

## 위임 순서

1. **design (Pre)** — 페이지 전면 디자인 + `shared/lib/history.ts` 데이터 모델/상수 구축 + 섹션 구현. frontend-design 4선언 후 진행. 타임라인 UX가 핵심.
2. **design (polish)** — 토큰 준수 정리.
3. **reviewer** — 의미론적 검토(토큰·FSD·콘텐츠 보존·상수 관리 구조·데이터 파생 로직).

## 최종 구조/UX 결정 (design Pre 완료)

### 밴드 리듬 (크림→다크→크림→올리브)

- Header: `bg-surface` (공용 PlaceholderHeader "ABOUT E3"/"연혁 및 비전" + PlaceholderSubNav, 인사말과 동일 패턴)
- VisionSection: `bg-ink` (다크) — 모토 → 향후 방향 → E3 비전 로드맵
- HistoryTimelineSection: `bg-surface` (라이트) — 핵심 콘텐츠, hairline 스캔
- PartnersSection: `bg-olive` — 신뢰 요소로 밴드 리듬 마무리

### 데이터 (`src/shared/lib/history.ts`, news 패턴)

- `HistoryCategory`/`HistoryEvent`/`HistoryYearGroup` 타입 + `HISTORY_EVENTS` flat 상수(원문 전량 전사, reverse chronological) + `getHistoryEvents()`/`getHistoryByYear()`(Map 그룹핑 후 연도 desc 정렬).
- 관리자 CRUD 대비 편집 단위 = 이벤트 1건. 연도 그룹핑은 파생 함수로.
- `src/shared/lib/index.ts` export 추가.

### Vision 로드맵 프레이밍

원문 "E3 2014/2015/2023"의 연도가 과거라 연도를 전면에 세우지 않고 **PHASE 01/02/03 단계 서술**로 프레이밍. 원 표기는 `text-white/40` 보조 태그로 보존(원문 손실 없음).

### 타임라인 UX

- 인덱스형 2열: `lg:grid-cols-[180px_1fr]`. 좌 대형 연도(`text-hero`, `lg:sticky top-28`) + 건수, 우 이벤트 리스트(`divide-hairline`) + 세로 스파인(`lg:border-l` 연속선) + 연도 마커 dot.
- 모바일: 연도 헤더 + 리스트 스택(스파인/마커는 `lg:`에서만).
- 각 이벤트에 카테고리 태그(`HistoryCategoryTag`, view 로컬 — 타임라인 전용 1곳).
- 상단 파생 집계 요약(설립연도 min / 특허·수상·인증 count) — 배열에서 파생, 하드코딩 없음.

### 카테고리 태그 색 (팔레트 제약 반영)

팔레트가 그린 모노톤이라 라이트 배경에서 대비 확보 가능한 토큰으로 4종 구별(색보다 라벨 텍스트가 1차 식별자):
- patent(특허): `text-olive-label`
- award(수상·표창): `text-olive-muted`
- cert(인증·등록): `text-ink-soft`
- business(사업·연구): `text-muted`
plan 초안의 accent/brand 매핑은 라이트 배경 대비 미달로 채택하지 않음(신규 색상 0 유지).

### Partners 데이터 근거

`PartnersSection` 내부 상수. 연혁·뉴스 **원문에 실재하는 기관만** 추림(창작 금지): 환경부/국토교통부/조달청/한국환경연구원/유역환경청/정몽구재단/고려대 오정리질리언스연구원/서울대 보건대학원/벤처기업협회/한국산업기술진흥협회/소프트웨어산업협회.

## 참조

- `src/shared/lib/news.ts` (동일 데이터 패턴), `src/views/about-greeting/*` (일관성 기준), `docs/design.md`(토큰), `src/widgets/placeholder-page/*`(공용 헤더/서브내비/태그 참고).
