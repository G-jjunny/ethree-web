# 오시는 길 페이지 작업 계획 (`/about/location`)

## 목표

`/about/location`(오시는 길)을 placeholder에서 실콘텐츠로 전환. 기존 about 페이지(인사말/연혁)와 디자인 일관성. 구글맵 지도 + 회사 위치 메타데이터(관리자 관리 대비) + 대중교통 안내.

## 핵심 요구사항 (사용자)

1. **회사 메타데이터 관리자 관리 대비** — 주소·번호 등은 컴포넌트에 하드코딩 금지, 상수 단일 소스에서 소비. 확장성 고려(추후 admin CRUD/Supabase).
2. **콘텐츠는 기존 사이트 참조**(ethree.co.kr/directions.do).
3. **지도는 구글맵**.
4. **지도 아래 오는 길(대중교통) 설명** — 기존 참조.

## 데이터/상수 전략 (관리자 관리 대비)

- **핵심 회사 메타데이터**(주소/tel/fax): 기존 `SITE`(`shared/constants/site.ts`)가 이미 단일 소스 → **그대로 소비**(하드코딩 금지). SITE가 향후 admin/Supabase로 대체될 확장 지점.
- **위치 페이지 전용 편집 콘텐츠**(대중교통·부서 문의·지도 쿼리): news/history/partners와 동일 패턴으로 **`shared/lib/location.ts`** 에 타입+상수+getter. 추후 admin CRUD 시 getter 내부만 교체.

```ts
// src/shared/lib/location.ts (예시 구조 — 최종 형태는 design 판단)
export interface DepartmentContact { name: string; email: string }
export interface DirectionsInfo {
  subway: string[];        // 지하철 안내 문장들
  bus: { label: string; numbers: string[] }[];  // 지선/간선/마을
  departments: DepartmentContact[];
  mapQuery: string;        // 구글맵 임베드 검색어(주소 기반)
}
export function getDirections(): DirectionsInfo { /* 상수 반환 */ }
```

## 콘텐츠 원문 (ethree.co.kr/directions.do)

> ⚠️ WebFetch(요약모델) 경유 — 게시 전 원문 대조 권장.

**주소/연락처** (SITE 기존):
- 주소: 서울시 성동구 아차산로 17길 49 생각공장 데시앙플렉스 816호
- Tel 02-552-1947 / Fax 02-552-1948

**대중교통**:
- 지하철: `2호선 건대입구역 1번출구 · 성수역 2번출구에서 도보 10분` / `7호선 어린이대공원역 4번출구에서 도보 10분`
- 버스: 지선 `3217, 4212, 3220, 2016` / 간선 `146` / 마을 `성동10`

**부서 문의**:
- 사이트 및 기타 문의: `mhkang@ethree.co.kr`
- 공공사업팀: `shcha@ethree.co.kr`
- 기술연구소: `shcha@ethree.co.kr`

## 지도 — 구글맵 (키 불필요 임베드)

- `<iframe src="https://www.google.com/maps?q=<encodeURIComponent(mapQuery)>&z=17&output=embed" ...>` 방식. **API 키/신규 의존성 불필요**, 즉시 동작.
- `mapQuery`는 SITE 주소 기반(예: "서울시 성동구 아차산로 17길 49 생각공장"). `shared/lib/location.ts`에 둠.
- iframe은 서버 컴포넌트로 렌더 가능("use client" 불필요). `title` 속성(접근성), `loading="lazy"`, 반응형(`aspect-*` 컨테이너 + `w-full h-full`).
- (참고: 인터랙티브 마커/스타일이 필요하면 추후 Google Maps JS API + 키 도입 — 이번 범위 아님.)

## 페이지 섹션 구성 (design 최종 확정)

`views/about-location/` 신설. 공용 헤더(PlaceholderHeader "ABOUT E3" / "오시는길" + PlaceholderSubNav activeHref="/about/location"). 밴드 리듬으로 일관성.

1. **Header** — 공용 헤더/서브내비.
2. **Map + 주소 섹션** — 큰 구글맵 임베드 + 주소/tel/fax 카드(SITE 소비). 데스크톱 2열(지도 + 주소 패널) 또는 지도 위주 + 주소 카드. 지도는 `rounded-image border-hairline` 등 토큰 프레이밍.
3. **오는 길(대중교통) 섹션** — 지도 아래. 지하철/버스 카드 + 부서 문의. 배경 밴드(tint/olive 등)로 리듬. `getDirections()` 소비.

## 규칙

- 회사 메타데이터/교통/부서 데이터 **하드코딩 금지** → SITE + `shared/lib/location.ts`. 콘텐츠 원문 유지.
- 기존 토큰만(신규 색상 0). `content-container` 강제. 서버 컴포넌트(지도 iframe 포함, 클라이언트 훅 불필요). Props interface, `any` 금지. 반응형.
- FSD: `views/about-location` 신설, 재사용 컴포넌트 판단은 design.
- 이메일은 `mailto:`, 전화는 `tel:` 링크.

## 위임 순서

1. **design (Pre)** — 페이지 전면 디자인 + `shared/lib/location.ts` 데이터 + 섹션 구현 + 구글맵 임베드. frontend-design 4선언.
2. **design (polish)** — 토큰 준수 정리.
3. **reviewer** — 의미론적 검토(상수 관리 구조·원문 보존·토큰·지도 접근성·SITE 소비).

## 참조

- `src/shared/constants/site.ts`(SITE 주소/연락처), `src/shared/lib/news.ts`/`history.ts`(데이터 패턴), `src/views/about-history/*`(일관성 기준), `docs/design.md`.

---

## 최종 구현 구조 (design, 2026-07-06)

### 데이터 — `src/shared/lib/location.ts`
- 타입: `TransitLine`(label/detail) · `TransitGroup`(mode + lines) · `DepartmentContact`(name/email) · `DirectionsInfo`.
- 상수: `TRANSIT`(지하철 2호선·7호선, 버스 지선/간선/마을) · `DEPARTMENTS`(사이트문의/공공사업팀/기술연구소) — 원문 전사.
- `getDirections()`: 교통/부서는 상수 반환, `mapQuery`는 **SITE.address 파생**(`${line1} ${line2}`) — 하드코딩 없음. admin CRUD 시 getter 내부만 교체.
- `shared/lib/index.ts`에 `getDirections` + 타입 4종 export.
- **주소/tel/fax는 location.ts에 두지 않고 SITE에서 소비**(핵심 메타데이터 단일 소스).

### 뷰 — `src/views/about-location/`
- `index.ts` → `LocationView`만 공개.
- `LocationView.tsx`: 공용 헤더(PlaceholderHeader "ABOUT E3"/"오시는길" + PlaceholderSubNav activeHref="/about/location") + 2개 섹션 조립. 밴드 리듬 = 크림 헤더 → 크림 지도/주소 → **올리브 오는 길**(연혁 페이지와 동일하게 올리브로 마무리).
- `LocationMapSection.tsx`(bg-surface): 2열 `lg:grid-cols-[1.6fr_1fr]` `items-stretch`. 좌측 구글맵 iframe(`aspect-[4/3] lg:aspect-[16/10]`, `rounded-image border-hairline`, `title`/`loading="lazy"`). 우측 주소 인포 패널(surface-white 카드, SITE.legalName/address/tel(`tel:`)/fax 소비).
- `DirectionsSection.tsx`(bg-olive, 서버 컴포넌트): 지하철/버스 그룹(dl, white/12 구획) + 부서 문의(mailto, white/12 구획). getDirections() 소비. 장식 원형 + SectionLabel olive-soft로 연혁 PartnersSection과 톤 일치.

### 페이지 연결
- `src/app/(marketing)/about/location/page.tsx`: PlaceholderPage → `<LocationView />`. metadata(buildMetadata) 유지, description을 "위치와 대중교통 이용 안내"로 조정.

### 규칙 준수
- 전 데이터 SITE + location.ts 소비(하드코딩 0). 원문 유지. 기존 토큰만(신규 색상 0). content-container 강제. 전부 서버 컴포넌트(iframe 포함). Props interface, any 없음. 반응형(모바일 스택 → lg 2열).
- 유일한 arbitrary 값: 지도 컨테이너 `aspect-[4/3]`/`lg:aspect-[16/10]`(비율은 스페이싱/색상 토큰 대상 아님, 구조적 수치).
