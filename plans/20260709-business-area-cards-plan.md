# OUR BUSINESS 섹션 카드 재구성 작업 계획

## 배경

인사말(About E3) 페이지 `BusinessAreasSection`(OUR BUSINESS)의 3카드 레이아웃을 https://www.stcube.com/ 의 Nelmastobart 섹션 디자인을 참고해 재구성한다. 사용자가 브라우저로 직접 캡처해 공유한 스크린샷 기준(라벨 → 큰 타이틀 → 설명 → 하단 이미지, 배경/보더 없이 세로 구분선으로만 3컬럼 분리).

## 범위

- 신규: `src/views/about-greeting/ui/BusinessAreaCard.tsx` (OUR BUSINESS 전용, 뷰 로컬)
- 수정: `src/views/about-greeting/ui/BusinessAreasSection.tsx` (`IconCard` → `BusinessAreaCard` 교체, 데이터 재작성)
- 변경 없음: `src/shared/ui/IconCard.tsx` (핵심가치/기업문화 섹션에서 계속 사용 — 이번 작업과 무관)
- 범위 아님: 참고 이미지 상단의 유튜브 임베드 스타일 섹션(요청 범위 외)

## 결정 사항 (사용자 확인 완료)

1. **컴포넌트 분리**: `IconCard`는 그대로 두고, OUR BUSINESS 전용 새 컴포넌트(`BusinessAreaCard`)를 뷰 로컬로 신설. 인사말 핵심가치(`CoreValuesSection`)·기업문화(`CultureValuesSection`) 섹션은 영향받지 않음.
2. **작업 범위**: 카드 3개 영역만. 상단 헤딩(eyebrow "OUR BUSINESS" + 타이틀/설명문)은 기존 그대로 유지.
3. **라벨/타이틀 영문화**: 소형 번호 라벨에 브랜드 프리픽스 추가, 타이틀 영문 표기.

   | 순번 | 라벨 | 타이틀 |
   |---|---|---|
   | 01 | E3 01 | CLIMATE & ENVIRONMENT |
   | 02 | E3 02 | ENVIRONMENT IT |
   | 03 | E3 03 | ENVIRONMENT IoT |

4. **불릿 → 문단 요약**: 기존 세부 불릿 목록을 각각 한 문단으로 재작성(원문 키워드 보존, 문장으로 자연스럽게 연결). 확정 문구:

   - **E3 01**: "폭염 대응 연구, 영유아 건강지수 개발, 기후위기 적응대책 수립부터 기후재난 대응, 기후·에너지 관리, 자연자산 가치평가, 환경자원 총량관리, 훼손지 생태복원까지 — 기후위기 시대에 필요한 환경 정책·연구 전 영역을 다룹니다."
   - **E3 02**: "환경부 및 산하기관 대상 시스템 개발·유지보수, 오픈소스 기반 GIS 플랫폼 구축, 환경영향평가 시스템 구축·운영까지 — 환경 데이터를 다루는 공공 IT 인프라를 설계하고 운영합니다."
   - **E3 03**: "실내공기 측정·모니터링, 공기질 진단 컨설팅, 대기오염 감시 시스템, 오염물질 방지 운영 시스템부터 탄소중립 실현을 위한 환경 IoT 솔루션 개발까지 — 센서 기반 환경 모니터링 기술을 제공합니다."

5. **이미지**: 카드 하단에 이미지 슬롯 마련(placeholder). 실제 이미지는 사용자가 추후 직접 추가 — `imageSrc?: string` optional 필드로 데이터 정의, 미지정 시 placeholder(틴트 배경 등 기존 톤)로 표시.

## 참고 사이트 레이아웃 (스크린샷 기준)

- 카드 배경/보더 없음 — 3컬럼을 세로 구분선으로만 분리
- 각 컬럼 순서: 상단 짧은 가로선 → 소형 라벨(예: NELMASTOBART 01) → 큰 볼드 타이틀 → 설명 문단(2~3줄) → 하단 이미지(정사각형에 가까운 비율)

## 기존 코드 선례 (재사용 참고)

`src/views/about-greeting/ui/CoreValuesSection.tsx`가 이미 유사한 "카드 박스 없이 hairline 구획으로 3분할" 패턴을 쓰고 있다 — implementer는 이 파일의 `grid grid-cols-1 divide-y divide-hairline border-y border-hairline sm:grid-cols-3 sm:divide-x sm:divide-y-0` 그리드/구획 구조를 그대로 참고하되, 내부 콘텐츠 순서(라벨→타이틀→설명→이미지, CoreValuesSection과 달리 이미지 슬롯이 추가됨)는 참고 사이트 스크린샷에 맞게 design이 재구성한다.

**주의**: `CoreValuesSection`은 번호를 `text-mega`(초대형)로 강조하는 데 반해, 참고 사이트의 라벨은 작고 절제된 톤(트래킹 넓은 소형 텍스트)이다 — 새 `BusinessAreaCard`는 `CoreValuesSection`의 그리드/구획 구조만 재사용하고, 타이포 위계는 참고 스크린샷 쪽(작은 라벨 + 큰 타이틀)을 따른다.

## 구현 스펙

- 데이터(`BUSINESS_AREAS` in `BusinessAreasSection.tsx`): `shape` 필드 제거, `title`을 영문 타이틀로 교체, `items`(불릿 배열) → `description`(문단 string)로 교체, `no`는 `"01"/"02"/"03"` 순수 번호 그대로 유지(변경 없음), `imageSrc?: string` 필드 신규 추가(현재 전부 미지정).
- `BusinessAreaCard` props: `no`, `title`, `description`, `imageSrc?`. 라벨 표기("E3 01")는 데이터가 아니라 컴포넌트에서 `` `E3 ${no}` ``로 조립 — 프리픽스는 뷰의 표현 책임, 데이터는 순수 번호만 보관.
- 레이아웃: `CoreValuesSection`과 동일한 `divide-hairline` 3구획 그리드를 사용하되, 컬럼 내부에 이미지 슬롯을 추가(하단, `rounded-image` 토큰, `aspect-square` 또는 `aspect-4/3` 중 design 판단, `imageSrc` 없으면 배경色 placeholder).
- `BusinessAreasSection.tsx`의 `import { IconCard, ... }` → `import { BusinessAreaCard } from "./BusinessAreaCard"`로 교체, `IconCardShape` import 제거.

## 규칙

- 토큰 하드코딩 0(`docs/design.md` 토큰만), 신규 색상 토큰 추가 금지.
- `any` 금지, Props는 `interface`.
- FSD 정방향 import 유지 — `BusinessAreaCard`는 뷰 로컬이므로 `src/views/about-greeting/ui/`에만 위치, 다른 레이어에서 import 금지.
- 반응형(모바일 1열 스택 → `sm:` 이상 3열), `CoreValuesSection`과 동일한 브레이크포인트 사용.
- 상단 SectionHeader(eyebrow/title/description) 문구는 절대 변경하지 않는다.

## 위임 순서

1. **design (Pre)** — `BusinessAreaCard` 신규 컴포넌트 마크업/토큰 확정(라벨/타이틀/설명/이미지 슬롯 위계, `CoreValuesSection` 구획 구조 재사용).
2. **implementer** — 데이터 재작성(`BUSINESS_AREAS`: 영문 타이틀·문단 설명·imageSrc 필드), `BusinessAreaCard` 구현, `BusinessAreasSection` 교체.
3. **design (Polish)** — 토큰 준수·반응형·이미지 placeholder 톤 정리.
4. **reviewer** — 문구 보존(핵심 키워드 손실 없는지), IconCard 미변경 확인(다른 섹션 영향 없음), 토큰/레이어 규칙 준수, 접근성(이미지 alt 등) 검토.

## 참조 파일

- `src/views/about-greeting/ui/CoreValuesSection.tsx` (구획 그리드 패턴 원본)
- `src/views/about-greeting/ui/BusinessAreasSection.tsx` (수정 대상)
- `src/shared/ui/IconCard.tsx` (변경 없음 — 참고만)
- `docs/design.md` (토큰 SSOT)
- 참고 사이트: https://www.stcube.com/ (Nelmastobart 섹션, 사용자 제공 스크린샷 기준)
