# 인사말 페이지 핵심가치·히스토리·클로징 섹션 재디자인 작업 계획

## 배경

인사말(About E3) 페이지 `CoreValuesSection`의 내용이 빈약("내용이 너무 없다")해, 핵심가치·히스토리·클로징 세 섹션을 처음부터 재디자인한다. 참고 사이트 없이 에디토리얼 방향으로 자유 재구성하되, 기존 사이트 톤(크림·다크·올리브 밴드 리듬, `CeoIntroSection`·비즈니스 섹션과 일관)을 유지한다.

## 범위

- 수정: `src/views/about-greeting/ui/CoreValuesSection.tsx`
- 수정: `src/views/about-greeting/ui/StatsSection.tsx`
- 수정: `src/views/about-greeting/ui/ClosingSection.tsx`
- 변경 없음: `GreetingView.tsx`(섹션 순서/조립 유지), `CeoIntroSection.tsx`, `BusinessAreasSection.tsx`(사용자가 유지 요청), 히어로

## 밴드 리듬 (유지)

크림(Hero) → 다크(CeoIntro) → **크림(핵심가치)** → **올리브(히스토리)** → 크림(비즈니스, 유지) → **크림(클로징)** → 다크(푸터)

## 결정 사항 (사용자 확인 완료)

1. 핵심가치: ECO/ENVIRONMENT/EDUCATION 3축 유지 + 아래 승인된 설명 카피 추가, **에디토리얼 스택 행** 레이아웃
2. 히스토리 = `StatsSection`(OUR HISTORY, 2011/160+/2018) → **마일스톤 여정 타임라인**
3. 클로징 = 서신 마무리 정제 + **사업소개 CTA**(→ /business/intro)

---

## Section 1 — 핵심가치 (CoreValuesSection, 크림 `bg-surface`)

### 콘텐츠 (승인 완료, 그대로 사용)

각 가치는 `word`(영문) + `meaning`(한글 뜻) + `description`(설명 문단):

- **ECO / 자연 환경**: "우리가 딛고 선 자연을 지키는 일에서 출발합니다. 폭염·기후재난 대응 연구부터 자연자산 가치평가, 훼손된 생태의 복원까지 — 현재의 공간을 보전해 미래세대에게 건강한 환경을 물려주는 것을 첫 번째 책임으로 삼습니다."
- **ENVIRONMENT / 문명 환경**: "환경과 IT를 융합해 사람이 살아가는 문명의 환경을 개선합니다. 환경 데이터 기반 정책 지원, 공공 시스템 구축, 실내외 공기질 개선까지 — 기술로 일상의 환경을 더 안전하고 쾌적하게 만듭니다."
- **EDUCATION / 환경 교육**: "환경의 가치는 공유될 때 지속됩니다. 기후세미나와 연구·교류 활동으로 축적한 환경 지식을 사회와 나누고, 다음 세대가 환경을 이해하고 실천하도록 돕습니다."

### 레이아웃

- 상단 `SectionHeader`(eyebrow "CORE VALUES" + title "이쓰리를 만드는 세 가지 핵심가치")는 기존 그대로 유지.
- 3개 가치를 **hairline으로 구분된 가로 스택 행**으로 배치(`divide-y divide-hairline border-y border-hairline` 또는 각 행 `border-t`, 마지막 행 하단 경계 포함). 각 행:
  - **좌측 블록**: 번호(01/02/03) + 큰 영문 워드(ECO) + 한글 뜻(자연 환경).
  - **우측 블록**: description 문단.
  - `lg` 이상에서 2컬럼 행(좌: 번호·워드·뜻 / 우: 설명, 예 `lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]` 또는 `lg:grid-cols-2` — 비율은 design 판단), 모바일에서는 세로 스택.
  - 행별 넉넉한 상하 여백(예 `py-8 lg:py-10`).
- **번호 타이포**: 기존 `text-mega` 초대형은 스택 행에는 과하므로 `text-h2`/`text-h3`급으로 조정(design 판단), 색은 기존 `text-olive-muted/40` 유지. 워드는 `text-h3`급 bold `text-ink`, 뜻은 `text-detail`/`text-body-sm` `text-ink-soft`, 설명은 `text-body-sm text-ink-soft`.

### 데이터

`CoreValue` 인터페이스를 `{ no, word, meaning, description }`로 확장(기존은 `{ no, title, meaning }`). `title`→`word`로 명명(영문 워드임을 명확히), `description` 추가.

---

## Section 2 — 히스토리 (StatsSection, 올리브 `bg-olive`)

### 콘텐츠 (기존 원문 보존 + 여정 프레이밍)

- eyebrow "OUR HISTORY" 유지.
- 리드 문단(기존 원문) 유지: "2011년 창립 이후 현재까지 160건 이상의 환경 공공기관 프로젝트를 성공적으로 수행하며, 2018년에는 '대한민국 환경 IT 융합 분야의 으뜸기업'이라는 비전을 수립했습니다."
- 3개 마일스톤 노드(값 + 라벨 + 짧은 descriptor). descriptor는 위 리드 문단에서 파생(신규 사실 창작 금지):
  - **2011** · 창립 · "환경 IT 전문기업으로 출발"
  - **160+** · 환경 공공기관 프로젝트 · "지금까지 성공적으로 수행"
  - **2018** · 비전 수립 · "대한민국 환경 IT 융합 으뜸기업"

### 레이아웃

- **마일스톤 여정 타임라인**: 3개 노드를 연결선으로 잇는다.
  - `lg` 이상: 가로 타임라인(수평 연결선 `border-white/12` + 노드 도트, 노드마다 대형 숫자(흰색, `text-hero`/`5xl`) + 라벨 + descriptor).
  - 모바일: 세로 타임라인(왼쪽 세로선 + 도트, 노드 스택) 또는 단순 세로 스택.
- 올리브 밴드·장식 원형·대형 숫자 흰색 톤은 기존 유지. 연결선/도트는 `border-white/12`, `bg-white/20` 등 기존 투명도 유틸만 사용(신규 토큰 0).
- 중간 노드(160+)는 연도가 아니지만 "창립→축적된 성과→비전" 여정의 본문으로 자연스럽게 배치.

### 데이터

`Stat` 인터페이스를 `{ value, label, descriptor }`로 확장(기존 `{ value, label }`).

---

## Section 3 — 클로징 (ClosingSection, 크림 `bg-surface`)

### 콘텐츠 (기존 원문 전부 보존)

- 도입 문단(7문단) → 다크 풀인용(8문단, `bg-ink` 인셋 카드) → 문단(9문단) → 서명 — 순서·원문 그대로 유지.
- 서명: hairline 구분선 + "대표이사 {SITE.ceo} 올림", 이름 강조(기존 유지·정제).

### 추가 — 마무리 CTA

- 서명 이후(또는 서명과 함께 마무리 영역)에 pill 버튼 CTA 추가.
  - 라벨: **"E3의 사업 살펴보기"**, 링크: **`/business/intro`**.
  - `next/link` + 기존 `Button`(variant `primary` 또는 `dark`, design 판단) 사용. 버튼만 단독으로 두면 서신 톤과 붕 뜰 수 있으니, 짧은 안내 한 줄(예 "이쓰리가 만들어온 환경 솔루션을 확인해 보세요")과 함께 배치 검토(design 판단).
- CTA는 서신의 격식을 해치지 않도록 절제된 배치(과한 세일즈 톤 금지).

---

## 규칙 (전 섹션 공통)

- `docs/design.md` 토큰만 사용, **신규 색상/사이즈 토큰 추가 금지**(라운드·타이포·스페이싱 전부 기존 토큰/유틸).
- 하드코딩 금지(`bg-[#...]`, arbitrary hex/px). 불가피한 예외는 design.md 등록 후 사용(이번 작업엔 예외 불필요 전망).
- `any` 금지, Props는 `interface`.
- 서버 컴포넌트 유지(정적 텍스트/링크만 — 상호작용 없음), `content-container` 강제.
- FSD 정방향 import, 뷰 로컬 컴포넌트는 `views/about-greeting/ui/`에 유지.
- 승인된 카피/원문 문구 보존(핵심가치 3설명, 히스토리 리드 문단, 클로징 9문단+서명).
- 반응형(모바일 스택 → `lg` 확장), CeoIntro/비즈니스 섹션과 톤 일관.
- `GreetingView.tsx` 섹션 순서/조립은 변경하지 않는다.

## 위임 순서

1. **design (Pre)** — 세 섹션 마크업/토큰 확정(핵심가치 스택 행, 히스토리 타임라인, 클로징 CTA). 신규 shared/ui 추출 없음(전부 뷰 로컬 수정), 필요 공용 컴포넌트(`SectionHeader`/`SectionLabel`/`Button`)는 재사용.
2. **implementer** — 데이터 인터페이스 확장(핵심가치 description, 히스토리 descriptor) 및 세 섹션 구현.
3. **design (Polish)** — 토큰 준수·반응형·밴드 톤 일관성 정리.
4. **reviewer** — 원문/카피 보존, 토큰·레이어 규칙, 접근성(타임라인 시맨틱·장식 aria-hidden·CTA 링크 라벨), 밴드 리듬 일관성, 비즈니스/CeoIntro 미변경 확인.

## 참조 파일

- `src/views/about-greeting/ui/CeoIntroSection.tsx` (다크 밴드·accent eyebrow·brand 강조 톤 — 일관성 기준)
- `src/views/about-greeting/ui/CoreValuesSection.tsx`, `StatsSection.tsx`, `ClosingSection.tsx` (수정 대상, 현재 구조)
- `src/views/about-greeting/ui/BusinessAreasSection.tsx` (인접 섹션 톤 — 유지, 참고만)
- `src/shared/ui/` (`SectionHeader`, `SectionLabel`, `Button`)
- `docs/design.md` (토큰 SSOT)
