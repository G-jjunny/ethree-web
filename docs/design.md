# Ethree Design System

> **토큰 SSOT(단일 진실 공급원).** 색상/타이포/스페이싱/보더/모션 정의는 여기서만 한다.
> 실제 구현은 `src/app/globals.css` `@theme` 블록. 원본은 `docs/design-source/Ethree-Landing.dc.html`.
> 마크업/className 작업 시 아래 Tailwind 토큰 클래스만 사용한다. **하드코딩 절대 금지.**

## 디자인 방향성

다크 포레스트 그린 + 웜 크림 배경 + 라임 그린 포인트의 환경 IT 브랜드.
Pretendard(디스플레이·본문 공용, 가변 폰트) 단일 패밀리. 플랫 + 얇은 hairline 보더 중심, 그림자 없음, pill형 CTA.

---

## 색상 토큰

원본 hex → OKLCH 변환. `--brand-hue: 130`(라임 그린)을 기준으로 brand/accent 파생.

| 토큰            | OKLCH                       | 원본 hex           | 용도                             | 클래스 예시                            |
| --------------- | --------------------------- | ------------------ | -------------------------------- | -------------------------------------- |
| brand           | oklch(74.5% 0.152 130)      | #8bbf4f            | 주요 CTA(라임 그린) 배경         | `bg-brand`                             |
| brand-hover     | oklch(68% 0.15 130)         | (파생)             | 브랜드 버튼 hover                | `hover:bg-brand-hover`                 |
| brand-ink       | oklch(23% 0.03 150)         | #132014            | 브랜드 버튼 위 텍스트            | `text-brand-ink`                       |
| accent          | oklch(81% 0.15 130)         | #9fd35c            | 히어로 eyebrow/서비스 번호 포인트| `text-accent`                          |
| surface         | oklch(96% 0.008 95)         | #f5f3ec            | 웜 크림 페이지 배경(body 기본)   | `bg-surface`                           |
| surface-white   | oklch(100% 0 0)             | #ffffff            | 카드 배경                        | `bg-surface-white`                     |
| ink             | oklch(21.5% 0.019 151)      | #131c15            | 헤딩/본문 다크 · 다크 섹션 배경  | `text-ink` / `bg-ink`                  |
| ink-soft        | oklch(48% 0.022 131)        | #5a6154            | 라이트 배경 본문 보조 텍스트     | `text-ink-soft`                        |
| muted           | oklch(63% 0.012 122)        | #8a9080            | 메타 텍스트(뉴스 날짜)           | `text-muted`                           |
| olive           | oklch(43% 0.035 138)        | #4a5c42            | WHO WE ARE 밴드 배경             | `bg-olive`                             |
| olive-label     | oklch(53% 0.07 135)         | #5c7a45            | 라이트 배경 섹션 eyebrow         | `text-olive-label`                     |
| olive-soft      | oklch(86% 0.06 120)         | #c7dba0            | 올리브/다크 배경 위 라벨         | `text-olive-soft`                      |
| olive-muted     | oklch(69% 0.07 130)         | #8ba873            | 라이트 카드 번호 라벨(01/02/03)  | `text-olive-muted`                     |
| tint            | oklch(96% 0.015 120)        | #eef3e5            | 아이콘 배경(연녹)                | `bg-tint`                              |
| hairline        | oklch(0% 0 0 / 0.1)         | rgba(0,0,0,.1)     | 라이트 배경 카드/뉴스 구분선     | `border-hairline`                      |
| danger          | oklch(70% 0.19 25)          | (신규, 원본 없음)  | 폼 에러/실패 상태 텍스트         | `text-danger`                          |

### 투명도 기반 색상(다크 배경) — 별도 토큰 없이 기본 white/black + opacity 사용

다크(ink)·올리브 섹션 위의 반투명 텍스트/보더는 하드코딩이 아니라 **기본 토큰 + 투명도 유틸**로 표현한다.

| 상황                          | 클래스                | 원본                    |
| ----------------------------- | --------------------- | ----------------------- |
| 다크 배경 본문(강)            | `text-white/80`       | rgba(255,255,255,.78~.82) |
| 다크 배경 본문(약)            | `text-white/70`       | rgba(255,255,255,.65~.75) |
| 다크 배경 저대비 라벨/카피    | `text-white/40`       | rgba(255,255,255,.35~.4)  |
| 다크 섹션 divider             | `border-white/12`     | rgba(255,255,255,.1~.14)  |
| 아이콘 원 보더(올리브 위)     | `border-white/20`     | rgba(255,255,255,.2)      |
| outline 버튼 보더             | `border-white/40`     | rgba(255,255,255,.4)      |
| 라이트 카드/뉴스 hairline     | `border-hairline`     | rgba(0,0,0,.08~.1)        |

---

## 타이포그래피

### 폰트 패밀리

| 토큰         | 값                          | 용도                          | 클래스         |
| ------------ | --------------------------- | ----------------------------- | -------------- |
| font-display | Pretendard (Variable)       | 디스플레이/숫자/eyebrow/헤드라인 | `font-display` |
| font-body    | Pretendard (Variable)       | 한글·영문 본문(body 기본)     | `font-body`    |

폰트 웨이트는 기본 유틸 사용: `font-medium`(500) `font-bold`(700) `font-extrabold`(800) `font-black`(900).

### 사이즈 스케일 (원본 px → 네이밍 토큰)

| 토큰       | rem        | px    | line-height | 용도                       | 클래스          |
| ---------- | ---------- | ----- | ----------- | -------------------------- | --------------- |
| mega       | 4.5rem     | 72    | 1           | 서비스 대형 번호           | `text-mega`     |
| hero       | 4rem       | 64    | 1.08        | 히어로 헤드라인            | `text-hero`     |
| h1         | 2.375rem   | 38    | 1.3         | WHO WE ARE 헤딩            | `text-h1`       |
| h2         | 2.25rem    | 36    | 1.3         | 섹션 헤딩(사업/서비스)     | `text-h2`       |
| h3         | 1.75rem    | 28    | 1.25        | 서비스 로우 제목           | `text-h3`       |
| logo       | 1.625rem   | 26    | —           | 네비 로고 E3               | `text-logo`     |
| (기본) 2xl | 1.5rem     | 24    | —           | 푸터 로고 E3               | `text-2xl`      |
| (기본) xl  | 1.25rem    | 20    | —           | 사업 카드 제목             | `text-xl`       |
| item       | 1.1875rem  | 19    | —           | WHO WE ARE 항목 제목       | `text-item`     |
| lead       | 1.0625rem  | 17    | 1.7         | 히어로 리드문              | `text-lead`     |
| (기본)base | 1rem       | 16    | —           | WHO WE ARE 설명 본문       | `text-base`     |
| list       | 0.96875rem | 15.5  | —           | 뉴스 리스트 제목           | `text-list`     |
| body-sm    | 0.9375rem  | 15    | 1.8         | 사업/서비스 설명           | `text-body-sm`  |
| detail     | 0.90625rem | 14.5  | 1.7         | 카드 본문/항목 설명        | `text-detail`   |
| (기본) sm  | 0.875rem   | 14    | —           | 네비 링크/버튼             | `text-sm`       |
| meta       | 0.84375rem | 13.5  | —           | 뉴스 날짜/푸터 주소·연락처 | `text-meta`     |
| eyebrow    | 0.8125rem  | 13    | —           | 섹션 eyebrow/전화번호      | `text-eyebrow`  |
| caption    | 0.78125rem | 12.5  | —           | 푸터 라벨/카피라이트       | `text-caption`  |
| (기본) xs  | 0.75rem    | 12    | —           | 소형 라벨/카드 번호        | `text-xs`       |
| mini       | 0.6875rem  | 11    | —           | 이미지 placeholder 캡션    | `text-mini`     |

### 레터 스페이싱

| 토큰             | 값       | 용도                  | 클래스              |
| ---------------- | -------- | --------------------- | ------------------- |
| tracking-headline| -0.01em  | 대형 헤드라인         | `tracking-headline` |
| tracking-caption | 0.1em    | 푸터 라벨             | `tracking-caption`  |
| tracking-label   | 0.14em   | 소형 라벨/카드 번호   | `tracking-label`    |
| tracking-eyebrow | 0.2em    | 섹션 eyebrow          | `tracking-eyebrow`  |
| tracking-hero    | 0.22em   | 히어로 eyebrow        | `tracking-hero`     |

---

## 스페이싱 스케일

Tailwind v4 기본 4px 그리드(`--spacing` 0.25rem)를 그대로 사용한다. 별도 재정의 없음.
원본 주요 수치 대응:

| 원본       | 클래스        | 용도                   |
| ---------- | ------------- | ---------------------- |
| 120px 수직 | `py-30`       | 사업/서비스 섹션 패딩  |
| 100px 수직 | `py-25`       | WHO WE ARE/뉴스 패딩   |
| 80px 수직  | `py-20`       | 푸터 상단 패딩         |
| 64px 수평  | content-container 내장 | 섹션 수평 여백 |
| 56px       | `gap-14`/`mt-14` | 카드→CTA 간격       |
| 48px       | `gap-12`      | 서비스 로우 컬럼 갭    |
| 28px       | `gap-7`       | 카드 그리드 갭         |
| 20px       | `gap-5`       | 항목 아이콘↔텍스트     |

---

## 보더 라운드

| 토큰   | 값       | 원본  | 용도          | 클래스          |
| ------ | -------- | ----- | ------------- | --------------- |
| card   | 0.25rem  | 4px   | 카드          | `rounded-card`  |
| image  | 0.5rem   | 8px   | 이미지 박스   | `rounded-image` |
| pill   | 1.75rem  | 28px  | CTA 버튼      | `rounded-pill`  |
| full   | 9999px   | 50%   | 아이콘 원     | `rounded-full`  |

border-width는 기본 `border`(1px)만 사용.

---

## 그림자

원본은 완전 플랫 — **그림자 토큰 없음.** 깊이는 hairline 보더와 배경 색 대비로만 표현한다.

---

## 모션

원본엔 트랜지션이 없다. 인터랙션(버튼 hover 등) 최소 정의만 둔다.

| 토큰          | 값                              | 클래스               |
| ------------- | ------------------------------- | -------------------- |
| duration-fast | 150ms                           | `duration-fast`      |
| ease-out      | cubic-bezier(0.16, 1, 0.3, 1)   | `ease-out`           |

---

## content-container

섹션 내부 래퍼는 항상 이 유틸을 쓴다. `max-w-* mx-auto px-*` 직접 사용 금지.

```
max-width: 1280px · margin-inline: auto · padding-inline: 1.25rem (≥1024px에서 4rem)
```

```html
❌ <div class="max-w-[1280px] mx-auto px-16">
✅ <div class="content-container">
```

---

## 공용 컴포넌트 (`src/shared/ui`)

| 컴포넌트         | 용도                                    | 참고               |
| ---------------- | --------------------------------------- | ------------------ |
| Button           | CTA (primary/dark/outline, sm/md)       | 아래 명세          |
| SectionLabel     | eyebrow/소형 라벨 (배경별 color prop)   | 아래 명세          |
| FormStatusBanner | 폼 제출 상태 배너 (error/success)       | 아래 명세          |

### Button

- `variant`:
  - `primary`(brand 라임 pill)
  - `dark`(ink pill)
  - `outline`(투명+white/40 보더, 다크 배경용)
  - `outline-light`(투명+hairline 보더, 라이트/카드 배경 위 보조 버튼 — 취소·업로드·자동생성·제거 등)
- `size`: `sm`(헤더/네비, 24×10 / 13px) / `md`(CTA, 28×14 / 14px)
- 표준 `button` 속성 확장. 하드코딩 없이 토큰 클래스만 사용.
- 라이트 배경의 보조 액션(폼 취소·파일 업로드 등)은 로컬 클래스 대신 `variant="outline-light" size="sm"`를 쓴다.

### SectionLabel

- `color`: `accent`(다크 위 라임) / `olive`(라이트 위) / `olive-soft`(올리브 위) / `olive-muted`(카드 번호) / `ink`(회색 muted 패널 위 고대비) / `muted`(다크 위 저대비)
- `size`: `md`(섹션 eyebrow 13px/.2em) / `sm`(소형 라벨 12px/.14em)
- 항상 `font-display`(Pretendard) · uppercase.

### FormStatusBanner

- 폼 제출 결과(검증 실패·서버 에러·성공)를 알리는 hairline 박스 배너. 관리자/공개 폼에서 반복되던 인라인 상태 마크업을 통합한다.
- `variant`:
  - `error` — 검증/서버 에러. `text-danger` · `role="alert"` (투명 배경 + hairline 보더).
  - `success` — 저장/전송 성공. `bg-tint` · `text-olive-label` · `role="status"`.
- 공통 골격: `rounded-card border border-hairline px-4 py-3 text-detail`. 색상/보더/라운드 전부 토큰.
- `className` prop으로 여백 등 소비처 조정 허용(토큰 클래스만).

---

## prose (리치텍스트 본문)

News 상세 본문(서버 새니타이즈 HTML)과 관리자 에디터 편집 영역에 쓰는 공용 타이포그래피 클래스.
정의는 `src/app/globals.css` `@layer components .prose`. 색상/라운드/모션은 전부 위 토큰 var() 참조 — 하드코딩 없음.
Tailwind Typography 플러그인은 쓰지 않고, 이 프로젝트 토큰에 맞춘 최소 스코프로 직접 정의한다.

적용 대상 태그(TipTap StarterKit + Image + Link 산출):

| 요소            | 스타일 요약                                                        |
| --------------- | ------------------------------------------------------------------ |
| 본문 기본        | `font-body` · `text-body-sm`(15px) · line-height 1.8 · `text-ink` |
| `p`             | 상하 여백 1.1rem                                                    |
| `h1/h2/h3`      | `font-display` bold · `tracking-headline` · h1=28px·h2=24px·h3=19px |
| `a`             | `olive-label` + underline, hover `ink`                             |
| `strong`        | 700 · `ink`                                                        |
| `ul/ol/li`      | disc/decimal · marker `olive-muted`                               |
| `blockquote`    | 좌측 `olive` 2px 보더 · italic · `ink-soft`                       |
| `img`           | `rounded-image`(8px) · 상하 여백                                   |
| `hr`            | `hairline` 1px                                                    |
| `code` / `pre`  | `code`=tint 배경 · `pre`=ink 배경/surface 텍스트                   |

사용:

```html
✅ <div class="prose max-w-2xl">…새니타이즈된 HTML…</div>   <!-- 공개 상세 -->
✅ EditorContent attributes class="prose max-w-none …"        <!-- 관리자 에디터 -->
```

가독 폭은 소비처에서 `max-w-2xl`(공개 상세) 또는 `max-w-none`(에디터)로 제어한다.

---

## 디자인 원칙 (Design Principles)

> 토큰(값)이 아니라 **토큰을 어떻게 쓸지**에 대한 규칙. 모든 마크업/디자인 결정은 아래를 따른다. (design 에이전트는 이 파일을 `@import`하므로 자동 적용)

### 1. 정보 위계 · 타이포그래피 (Information Hierarchy)

화려한 그래픽 요소 대신 **폰트 굵기(Weight) · 자간(Letter-spacing) · 서체 크기(Scale) · 여백(Negative Space)** 만으로 정보의 경중을 확실히 구분한다.

- **핵심**(타이틀·숫자): `font-bold`/`font-extrabold`/`font-black` + 큰 스케일(`text-hero`/`text-h1~h3`/`text-mega`). 대형 헤드라인엔 `tracking-headline`.
- **보조·메타**(부연 설명·날짜·작성자·조회수): 기본/`font-medium` weight + 작은 스케일(`text-detail`/`text-meta`/`text-caption`) + 낮은 대비 컬러(`text-ink-soft`/`text-muted`).
- 위계는 **weight·scale·여백(`gap`/`py`/`mt`)** 차이로 만든다(색 남발 아님). 시선 흐름 = 크고·굵고·진한 것 → 작고·얇고·흐린 것.

### 2. 컬러 시스템 · 톤 (Color System & Tone)

- 배경·기본 틀은 **무채색 계열**(웜 크림 `surface`, 화이트 `surface-white`, 정돈된 다크 `ink`)을 기본으로 한다.
- 색을 과하게 남발하지 않는다. **key color 1~2개만 포인트로** — `brand`(라임 그린)·`accent`, 보조로 `olive` 계열. 그 외는 무채/저채도로 시각적 피로도를 낮춘다.
- 강조는 색이 아니라 **원칙 1(위계)** 로 우선 해결. 신규 색상 추가 금지(기존 토큰만).

### 3. 상태별 컴포넌트 분기 (State-driven UI)

데이터의 상태(Status)에 따라 정보를 시각적으로 다르게 표현한다.

- **조건부 액션 상태**(진행 중 · 완료 · 대기 · 발행/초안 등): 직관적 구분이 필요 → key color를 반영한 가독성 높은 **Badge/Tag 형태**(pill/rounded). ※ 현재 `shared/ui`에 `Badge` 미구현 — 상태 뱃지가 필요하면 shared/ui에 `Badge`(status variant)로 추가 후 사용한다.
- **일반 정보성 상태**(등록일 · 조회수 · 작성자 등): 불필요한 테두리·배경을 넣지 않고 **텍스트 + 미니멀 폰트 컬러 분기**(`text-muted`/`text-meta`)만으로 자연스럽게 녹여낸다.

---

## 운영 원칙 (재사용 우선)

1. 기존 토큰/컴포넌트로 충족되면 → **재사용.** design.md 수정 안 함.
2. 동일 마크업 2~3곳 이상 반복 → shared/ui 컴포넌트로 분리.
3. 위로 안 되는 진짜 새 패턴만 → design.md 최소 갱신 후 구현.
