# 오시는 길 페이지 재디자인 작업 계획

## 배경

오시는 길(`/about/location`) 페이지를, 최근 재디자인된 인사말 페이지의 디자인 언어에 맞춰 처음부터 재구성한다. 인사말은 `Reveal`(스크롤 페이드업 모션 아일랜드), 넉넉한 여백(`py-20 lg:py-28`), cream 중심 에디토리얼(hairline 프레이밍·큰 ghost 번호·대형 디스플레이 타이포), 올리브 밴드 제거로 정제됐다. 오시는 길도 같은 톤으로 맞춘다. 콘텐츠(주소·지도·대중교통·부서문의)는 원문 그대로 보존.

## 범위

- 수정: `src/views/about-location/ui/LocationMapSection.tsx`
- 수정: `src/views/about-location/ui/DirectionsSection.tsx`
- 변경 없음: `LocationView.tsx`(헤더/서브내비/섹션 조립 유지), `getDirections`/`SITE`(데이터 소스 그대로)
- **아키텍처 정리**: `Reveal` 컴포넌트를 `src/views/about-greeting/ui/Reveal.tsx` → `src/shared/ui/Reveal.tsx`로 승격
  - `src/shared/ui/index.ts` 배럴에 export 추가
  - 인사말 4개 파일(`CeoIntroSection`, `BusinessAreasSection`, `CoreValuesSection`, `ClosingSection`)의 `import { Reveal } from "./Reveal"` → `import { Reveal } from "@/shared/ui"`로 갱신
  - 기존 `about-greeting/ui/Reveal.tsx` 삭제

## 결정 사항 (사용자 확인 완료)

1. 방향: 참고 없이 에디토리얼, **최근 인사말 톤 정합**
2. 콘텐츠: 현재 정보 그대로 재구성
3. 지도: **대형 풀와이드 지도 + 하단 hairline 인포 행**(주소·전화·팩스)
4. 배경: **cream 중심**(올리브 밴드 제거, 지도가 시각 앵커)

## 근거/재사용

- `Reveal` (`about-greeting/ui/Reveal.tsx`): "다른 뷰에서도 필요해지면 shared/ui 승격을 검토한다"는 주석대로 승격. `shared/ui`는 이미 client 컴포넌트(`LogoCarousel`)를 배럴로 노출하므로 client `Reveal` 추가는 안전. FSD상 뷰 간 직접 import 금지이므로 재사용엔 승격이 정답.
- `SectionHeader` (`shared/ui`): `tone="light"`(cream: olive 라벨·ink 헤딩·ink-soft 설명) 사용.
- `CoreValuesSection.tsx`의 hairline 에디토리얼 행 언어(`border-t/border-b border-hairline`, `Reveal delay={i*0.08}`, `py-20 lg:py-28`, ghost 번호 `text-olive-muted/40`)를 오는 길 섹션의 톤 기준으로 참고.
- 데이터: `getDirections()`(`shared/lib/location.ts`)의 `transit`/`departments`/`mapQuery`, `SITE.legalName`/`address`/`contact` 그대로 소비.

## 구현 스펙

### ① LocationMapSection.tsx (cream `bg-surface`, `py-20 lg:py-28`)

- `Reveal`로 감싼 상단 소개: eyebrow `SectionLabel color="olive"` "OFFICE" + `SITE.legalName`(대형 `text-h3`/`text-h2` ink).
- **대형 풀와이드 구글맵**: 기존 iframe 임베드(`mapSrc` = `getDirections().mapQuery` 기반, API 키 불필요, 서버 컴포넌트) 유지. content-container 전폭, `rounded-image border border-hairline`, 넓은 aspect(예 `aspect-[16/9]` 또는 `lg:aspect-[21/9]` — design 판단). `Reveal` 래핑.
- **하단 인포 행**: 주소·전화·팩스를 hairline으로 나눈 3열(`grid` + `divide-x`/`border-t border-hairline`, 모바일 세로 스택). 라벨 `text-meta font-bold text-olive-label`, 값 `text-body-sm text-ink-soft`. 전화는 `tel:` 링크(hover 색 전이). 팩스/주소는 텍스트. `Reveal` 래핑.
- iframe에는 기존처럼 `title`/`loading="lazy"`/`referrerPolicy` 유지(접근성·성능).

### ② DirectionsSection.tsx (cream `bg-surface`, `py-20 lg:py-28`)

- **올리브 밴드 → cream 전환**. 기존 `bg-olive`/장식 원형/`white/12`·`white/80` 톤을 cream 에디토리얼 토큰으로 교체.
- `Reveal`로 감싼 `SectionHeader tone="light"` eyebrow "DIRECTIONS" + title "오는 길" + 기존 description(원문 보존).
- **대중교통 + 부서 문의**를 hairline 에디토리얼 행으로:
  - 대중교통(지하철/버스): `mode` 소제목(`SectionLabel color="olive" size="sm"`) + 각 노선 `label`/`detail`을 `border-hairline` 구획 행으로. 텍스트 `text-ink`/`text-ink-soft`.
  - 부서 문의: `dept.name` + `mailto:` 링크(`dept.email`)를 `border-hairline` 행으로. 링크 hover 색 전이(`hover:text-olive-label` 또는 `hover:text-brand`).
  - 레이아웃: 2열(대중교통 좌 / 부서문의 우, `lg`에서 `lg:border-l lg:border-hairline`) 또는 CoreValues식 세로 스택 — design 판단. `Reveal` 순차(`delay`).

## 규칙

- `docs/design.md` 토큰만, **신규 색상/사이즈 토큰 0**, 하드코딩 금지(arbitrary 색/px). aspect 비율(`aspect-[16/9]` 등)·레이아웃 비율은 색/px 토큰 아님(허용).
- `any` 금지, Props/데이터 `interface`.
- 서버 컴포넌트 유지 — `Reveal`(client 아일랜드)만 상호작용. 데이터 페칭 없음(정적 getter).
- 콘텐츠 원문 보존(주소·연락처·교통 노선·부서 문의·오는 길 설명 문구 그대로).
- `content-container` 강제, 반응형(모바일 스택 → lg 확장).
- FSD 정방향 import, 뷰 로컬 컴포넌트는 각 뷰 `ui/`에 유지. `Reveal` 승격 외 새 shared/ui 추출 없음.
- `LocationView.tsx`(헤더 패턴)·인사말 섹션의 시각 결과는 변경하지 않는다(Reveal import 경로만 갱신, 렌더 동일).

## 위임 순서

1. **design (Pre)** — Reveal 승격(파일 이동 + 배럴 + 인사말 import 갱신) 및 두 섹션 재디자인 구현.
2. **verify** — `npx tsc --noEmit` + `npm run lint` + 브라우저로 `/about/location` 세 영역(지도/인포행/오는길) 및 인사말 페이지(Reveal 경로 변경 후 회귀) 정상 확인.
3. **reviewer** — 원문 보존, 토큰·레이어 규칙(FSD·Reveal 승격 정합), 접근성(iframe title·mailto/tel 라벨·장식 aria-hidden·reduced-motion), 밴드 톤 정합(cream), 인사말 회귀 없음 확인.

## 검증

- `npx tsc --noEmit`, `npm run lint` 통과.
- 브라우저 `/about/location`: 대형 지도 렌더, 하단 주소/전화/팩스 인포 행, 오는 길 대중교통·부서문의 hairline 행, Reveal 스크롤 등장 동작.
- 회귀: `/about/greeting` — Reveal import 경로 변경 후에도 인사말 스크롤 등장/렌더 동일한지 확인.

## 참조 파일

- `src/views/about-greeting/ui/Reveal.tsx` (승격 대상), `CoreValuesSection.tsx`(에디토리얼 행 언어 기준)
- `src/views/about-location/ui/LocationMapSection.tsx`, `DirectionsSection.tsx` (수정 대상)
- `src/shared/lib/location.ts`(`getDirections`), `src/shared/constants/site.ts`(`SITE`)
- `src/shared/ui/index.ts`(배럴), `SectionHeader.tsx`(tone), `SectionLabel.tsx`
- `docs/design.md` (토큰 SSOT)
