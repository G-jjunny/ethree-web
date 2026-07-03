# 인사말 페이지 실콘텐츠 작업 계획

## 목표

1. **라우팅**: nav "About E3" 클릭 시 허브(`/about`)가 아니라 **인사말(`/about/greeting`)이 기본 페이지**가 되도록 변경.
2. **콘텐츠**: `/about/greeting`을 placeholder에서 **실제 콘텐츠 페이지**로 전환 — CEO 사진, 인사말 전문, 핵심가치, 사업분야, 서명. 텍스트는 기존 `ethree.co.kr/greeting.do`에서 그대로 가져옴(아래 원문 확보).

이번 작업은 About E3에 한정한다(사용자 명시 범위). Business/Support 허브는 그대로 유지.

---

## Part 1 — 라우팅: About E3 기본 진입점 변경

### 문제
현재 `NAV_GROUPS`의 "About E3" 그룹 `href: "/about"`가 **① 헤더 상위 링크 목적지 ② 하위 페이지들의 그룹 조회 키(lookup key)** 두 역할을 겸한다. 헤더 목적지만 바꾸고 싶어도 조회 키가 같이 바뀌면 `about/greeting|history|location/page.tsx`, `about/page.tsx`의 `NAV_GROUPS.find(g => g.href === "/about")`가 전부 깨진다.

### 해결
`NavGroup`에 **선택적 `defaultHref`** 필드를 추가해 역할을 분리한다. `href`는 조회 키로 그대로 유지(하위 페이지 lookup 코드 무변경), `defaultHref`가 있으면 헤더 링크는 그쪽으로 보낸다.

```ts
// src/shared/constants/site.ts
export interface NavGroup {
  label: string;
  footerLabel: string;
  href: string;          // 그룹 식별 키 (children lookup에 사용, 불변)
  defaultHref?: string;  // 신규. 있으면 헤더 상위 링크는 이 경로로 이동
  children: NavItem[];
}

// About E3 그룹에 추가
{
  label: "About E3",
  footerLabel: "ABOUT E3",
  href: "/about",
  defaultHref: "/about/greeting",   // 신규
  children: [...],
}
```

- `src/widgets/site-header/ui/SiteHeader.tsx` — 데스크톱 nav + 모바일 패널 두 곳의 `<Link href={group.href}>`를 `<Link href={group.defaultHref ?? group.href}>`로 변경. `key`는 `group.href` 그대로(고유성 유지).
- `src/widgets/site-footer/ui/SiteFooter.tsx` — 변경 불필요(그룹 라벨은 링크가 아니라 텍스트, `group.href`는 React key로만 쓰임. 확인됨).
- `src/app/(marketing)/about/page.tsx`(허브) — **삭제**. About E3는 더 이상 별도 허브가 없다.
- **리다이렉트 추가**: `next.config.ts`의 `redirects()`에 `/about` → `/about/greeting`(임시, `permanent: false`) 추가. 직접 `/about`로 진입하는 경우 대비.
- `src/app/sitemap.ts` — `/about` 정적 엔트리 제거(리다이렉트 대상은 sitemap에 넣지 않음), `/about/greeting`의 priority를 기존 허브와 같은 `0.8`로 상향(섹션 대표 진입점 역할 승계).

---

## Part 2 — 인사말 페이지 실콘텐츠 디자인

### 원문 콘텐츠 (ethree.co.kr/greeting.do에서 확보, 실제 게시 전 원문 최종 대조 권장 — WebFetch가 요약모델을 거치므로 100% 축자 재현 보장 안 됨)

**인사말 본문**

> 안녕하십니까? 주식회사 이쓰리(E3) 대표이사 조흔우입니다.
>
> 이쓰리는 'ECO(자연 환경)', 'ENVIRONMENT(문명 환경)', 'EDUCATION(환경 교육)'의 세 가지 가치를 기반으로, 우리가 살고 있는 현재의 공간을 보전하고 미래세대에게 건강하고 쾌적한 환경을 물려주는 것을 목표로 설립된 환경 IT 융합 전문기업입니다.
>
> '융합'이란 서로 다른 두 요소가 하나로 어우러지는 과정입니다. 유무선 통신과 금융이 만나 모바일 뱅킹이 되었듯, 저희는 환경과 IT의 융합을 통하여 기후위기 대응과 탄소중립 실현에 기여하는 솔루션을 제공합니다.
>
> 2011년 창립 이후 현재까지 160건 이상의 환경 공공기관 프로젝트를 성공적으로 수행하며, 2018년에는 "대한민국 환경 IT 융합 분야의 으뜸기업"이라는 비전을 수립했습니다.
>
> 특히 저희는 기후위기 적응 전략을 기반으로, 환경 데이터 기반 정책 지원, 실내외 공기질 개선, 환경플랫폼 구축, 탄소중립 기술 실현 등 다양한 활동을 전개하고 있습니다.
>
> 이쓰리의 환경 IT 기술력은 특히 환경영향평가 시스템 구축 사례를 통해 입증되었으며, 이는 지금도 환경부 대표 플랫폼으로서 안정적으로 운영되고 있습니다.
>
> 앞으로 이쓰리는 다양한 환경 데이터를 통합하고 활용하여, 기후위기 시대에 대응하는 탄소중립형 환경 플랫폼 기업으로 성장해 나갈 것입니다.
>
> 저는 직원의 정신적·물질적 행복을 최우선으로 여기며, 고객 한 분 한 분을 평생 보호해야 할 소중한 존재로 생각합니다.
>
> 매일의 작은 실천이 큰 변화를 만들어낸다는 믿음으로, 오늘도 고객, 직원, 그리고 사회를 위한 발걸음을 멈추지 않겠습니다.

**서명**: 대표이사 조흔우 올림

**핵심가치 3종** (인사말 2문단에서 도출)

| 값 | 의미 |
|---|---|
| ECO | 자연 환경 |
| ENVIRONMENT | 문명 환경 |
| EDUCATION | 환경 교육 |

**사업분야 3종 + 세부항목**

- **기후환경 분야**: 폭염 대응 연구, 영유아 건강지수 개발, 기후위기 적응대책 수립, 기후재난 대응, 기후·에너지 관리, 자연자산 가치평가, 환경자원 총량관리, 훼손지 유형별 생태복원 등
- **환경 IT 분야**: 환경부 및 산하기관 대상 시스템 개발 및 유지보수 / 오픈소스 기반 GIS 플랫폼 구축 / 환경영향평가 시스템 구축 및 운영
- **환경 IoT 분야**: 실내공기 측정 및 모니터링 / 공기질 진단 컨설팅 / 대기오염 감시 시스템 / 오염물질 방지 운영 시스템 / 기후위기 적응형 기술 및 탄소중립 실현을 위한 환경 IoT 솔루션 개발

**연혁 스탯** (문단 4): 2011년 창립 / 160건+ 환경 공공기관 프로젝트 / 2018년 비전 수립

### 에셋

- CEO 사진: `public/images/ceo-portrait.gif` (다운로드 완료, 210×271, 사용자 승인됨)

### 레이아웃 제안

기존 placeholder 구조(`PlaceholderPage`)로는 담을 수 없는 실제 콘텐츠 페이지 — `views/landing`과 같은 패턴으로 **`views/about-greeting`** 신설, 섹션별 컴포넌트로 분리(50줄 이상 단일 JSX 금지 원칙).

1. **헤더** — 기존 `PlaceholderHeader` 패턴 재사용 or 유사 스타일(eyebrow "ABOUT E3" + title "인사말") + **서브내비**(`PlaceholderSubNav`, siblings=인사말/연혁및비전/오시는길, activeHref="/about/greeting") — 형제 페이지 이동 유지.
2. **CEO 인트로** — 좌: CEO 사진(`ceo-portrait.gif`, 프레임/라운드 처리) + 이름/직함. 우: 인사말 1~3문단(인사/소개/융합 철학).
3. **핵심가치 3카드** — ECO/ENVIRONMENT/EDUCATION, 기존 Business 섹션의 3카드 톤 참고(재사용 가능 여부는 design 판단 — Business 카드와 완전 동일하면 공용 컴포넌트 추출 검토, 아니면 이 페이지 전용으로).
4. **연혁 스탯 바** — 2011년 창립 / 160+ 프로젝트 / 2018 비전 수립 (간단한 3분할 통계 형태, 문단 4 내용).
5. **사업분야 3카드(불릿 포함)** — 기후환경/환경IT/환경IoT, 각 카드 안에 세부 불릿 목록.
6. **맺음말 + 서명** — 문단 7~10 + "대표이사 조흔우 올림" 우측 정렬 서명.

design이 최종 섹션 분할·톤·재사용 여부를 판단해 확정한다.

### design(Pre) 확정 결과 (완료)

**섹션 구조** — `src/views/about-greeting/`

```
ui/
  GreetingView.tsx          헤더(PlaceholderHeader 재사용, 신규 공개 API화) + PlaceholderSubNav + 5개 섹션 조립
  CeoIntroSection.tsx        좌: ceo-portrait.gif(next/image, unoptimized) + 이름/직함(SITE.ceo) · 우: 1~3문단
  CoreValuesSection.tsx      IconCard 3장 (ECO/ENVIRONMENT/EDUCATION, 값+의미 매핑 그대로)
  StatsSection.tsx           bg-ink 다크 밴드. 4문단 원문 + 2011/160+/2018 스탯 3분할
  BusinessAreasSection.tsx   5~6문단 원문 인트로 + IconCard 3장(items 불릿, 기후환경/환경IT/환경IoT)
  ClosingSection.tsx         7~9문단 + "대표이사 {SITE.ceo} 올림" 우측 정렬 서명
index.ts                     GreetingView만 공개
```

**문단 매핑**: 10문단(서명 포함 표기 기준) 전체를 그대로 배치, 요약/재작성 없음.
P1~P3 → CeoIntroSection, P4 → StatsSection(인트로+스탯), P5~P6 → BusinessAreasSection 인트로, P7~P9 → ClosingSection, 서명 → ClosingSection 우측 정렬.

**재사용 판단**: `BusinessSection`(landing)·`CoreValuesSection`·`BusinessAreasSection` 3곳에서 "아이콘 원+번호 라벨+제목+설명(+선택 불릿)" 마크업이 동일 반복 → `shared/ui/IconCard` 공용 컴포넌트로 추출(`description`/`items` 둘 다 선택 prop). `BusinessSection.tsx`을 IconCard 사용으로 리팩터링(렌더링 결과 동일, 클래스 변경 없음).

**신규 공개 API**: `PlaceholderHeader`를 `widgets/placeholder-page/index.ts`에 추가 공개(기존엔 내부 전용) — `GreetingView`가 외부에서 재사용하기 위함. `PlaceholderSubNav`는 기존 그대로 재사용.

**하드코딩 방지**: CEO 사진 그리드 컬럼폭만 `lg:grid-cols-[210px_1fr]`(에셋 원본 치수 210px) 예외 처리, 주석 처리함. 나머지는 전부 기존 토큰(`text-h1/h2/item/lead/body-sm/detail`, `bg-surface/olive/ink`, `text-accent`, `rounded-card/image`, `border-hairline`, `content-container`) 재사용, 신규 토큰 추가 없음.

**페이지 연결**: `app/(marketing)/about/greeting/page.tsx`을 `PlaceholderPage` → `GreetingView`로 교체(implementer 확인·마무리 필요).

## 위임 순서

1. **implementer** — Part 1 라우팅 변경(defaultHref, 헤더 수정, 허브 삭제, redirect, sitemap 조정). 간단한 기계적 변경이라 design 불필요.
2. **design (Pre)** — Part 2 인사말 페이지 신규 디자인. `views/about-greeting` 섹션 구성, 필요 시 신규 shared/ui·widgets 추출.
3. **implementer** — 위 디자인을 바탕으로 실제 구현.
4. **design (polish)** — 토큰 준수 정리.
5. **reviewer** — 의미론적 검토.

## Part 3 — 전면 재디자인 (design Pre, 20260703 "감각적이고 신뢰있는" 방향)

사용자가 기존 구현이 "너무 별로 / placeholder 티"라고 지적 → 콘텐츠 원문 100% 보존한 채 구성·배치·시각만 전면 재디자인.

### frontend-design 4선언 (아트디렉션 확정)

- **Purpose**: 환경부·공공기관을 상대하는 환경 IT 기업 이쓰리 대표 인사말 페이지. 방문자(기관 담당자/잠재 고객/구직자)가 짧은 스크롤에서 대표 철학과 회사 신뢰성·전문성을 체감하는 "매거진식 대표 서신".
- **Tone**: editorial · institutional-modern. Stripe/Linear식 여백·타이포 위계 + 기후테크 자연 톤 컬러블록 + 매거진 대표 서신(대형 포트레이트·풀인용·서명 그래픽화). 플래시하지 않게.
- **Constraints**: Tailwind v4 기존 토큰만(신규 색상 토큰 0), 서버 컴포넌트 유지, content-container 강제, 콘텐츠 원문 불변, 반응형(모바일 스택→lg), 접근성(figure/blockquote/nav/footer 시맨틱·aria-hidden 장식), 랜딩과 한 사이트로 보이는 일관성.
- **Differentiation**: generic AI 산출물의 "IconCard 3열 반복 + 크림 단일 스택" 탈피 — ① 배경 밴드 리듬 ② 다크 밴드 위 프레임 포트레이트 + 대형 인사 카피 ③ 핵심가치를 IconCard 대신 대형 번호 에디토리얼 타이포 ④ 8문단 대형 다크 풀인용 ⑤ hairline 구분선 + 이름 강조 서명.

### 배경 밴드 리듬 (핵심 변경)

크림 → **다크(ink)** → 크림 → **올리브** → 크림 → 크림(풀인용만 다크 인셋). 푸터가 bg-ink라 마지막 섹션은 라이트로 종료.

### 최종 섹션 구조 — `src/views/about-greeting/ui/`

```
GreetingHero.tsx        (신규) 크림. 좌측정렬 eyebrow "ABOUT E3" + 대형 "인사말"(text-hero) + 영문 "GREETING" 병기 + hairline 구분선 + PlaceholderSubNav. 기존 중앙정렬 PlaceholderHeader 대체.
CeoIntroSection.tsx     다크(bg-ink). 프레임 포트레이트 카드(border-white/20 + p-2 프레임) + P1 대형 인사(text-h2) + P2·P3(white/80). 장식 원형.
CoreValuesSection.tsx   크림. IconCard 제거 → 대형 번호(text-mega, olive-muted/40) + 워드 + 의미, divide-hairline 3구획 에디토리얼.
StatsSection.tsx        올리브(bg-olive, 기존 ink에서 변경). P4 + 대형 숫자(text-hero) 스탯 3분할.
BusinessAreasSection.tsx 크림. 변경 없음(IconCard 유지 — 랜딩 BusinessSection과 일관, 불릿 정보량에 카드 적합).
ClosingSection.tsx      크림. P7 → 8문단 대형 다크 풀인용(blockquote bg-ink 인셋 카드) → P9 → hairline 서명(대표이사 {ceo} 올림, 이름 강조).
GreetingView.tsx        위 6섹션 조립 + siblings 전달.
```

**콘텐츠 보존**: 9문단+서명 전부 원문 유지. 8문단만 풀인용으로 시각 강조(위치는 P7→P8→P9 순서 그대로, 삭제·중복 없음). 서명은 단어(대표이사/조흔우/올림) 전부 보존, 이름만 대형 강조 배치.

**신규 컴포넌트**: `GreetingHero`는 이 페이지 전용(재사용 없음) → views 내부에 둠. shared/ui·widgets 신규 추출 없음. IconCard·PlaceholderSubNav·PlaceholderHeader 등 기존 공용 API 무변경(PlaceholderHeader는 이제 GreetingView에서 미사용, 다른 곳에서 계속 사용).

**토큰 준수**: 신규 색상 토큰 0. 기존 예외(`lg:grid-cols-[210px_1fr]` CEO 사진 폭)만 주석 유지. 나머지 전부 기존 토큰(text-hero/h2/h3/mega/body-sm/detail/item, bg-surface/ink/olive, text-accent/olive-muted, opacity 유틸 white/80·accent/30·olive-muted/40, rounded-card/image, border-hairline/white/12, divide-hairline, content-container).

## 참조

- `docs/legacy-site-reference.md` — 기존 사이트 레퍼런스(메인페이지). 이번 인사말 원문은 이 문서에 없어 위에 별도 기록.
- `public/images/ceo-portrait.gif`
- `src/shared/constants/site.ts` (NAV_GROUPS)
