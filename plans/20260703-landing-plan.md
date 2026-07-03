# 랜딩페이지 작업 계획

## 목표

Claude Design 결과물(`docs/design-source/Ethree-Landing.dc.html`)을 기준으로 이쓰리 랜딩페이지를 구현한다. 동시에 이 디자인에서 **디자인 토큰 시스템을 최초 구축(Bootstrap)** 한다.

## 디자인 방향성 요약

다크 포레스트 그린 + 웜 크림 배경 + 라임 그린 포인트의 환경 IT 브랜드. Manrope(영문 디스플레이) + Noto Sans KR(본문). 플랫 + 얇은 보더 중심, 그림자 거의 없음, pill형 버튼.

## 범위

### 산출물

- **토큰 시스템**: `docs/design.md`, `src/app/globals.css` `@theme`, `.claude/skills/design-system/SKILL.md`
- **shared**: `shared/ui`(Button, SectionLabel 등), `shared/constants/site.ts`
- **widgets**: `site-header`, `site-footer` (전 페이지 재사용)
- **views/landing**: 페이지 조합 + 랜딩 전용 섹션(hero / who-we-are / news / business / service)
- `src/app/(marketing)/page.tsx` 또는 `src/app/page.tsx`에서 `LandingView` 렌더
- `src/app/layout.tsx` 폰트 교체 (Geist → Noto Sans KR + Manrope, `next/font/google`)

### Supabase

- 이번 범위 아님. 단, **NEWS 섹션은 향후 Supabase 동적 콘텐츠 후보** → 지금은 정적 데이터로 구현하되, 데이터를 컴포넌트 밖 상수/props로 분리해 이후 교체 쉽게 한다.

## 추출 토큰 다이제스트 (design 에이전트 참고용 — 원본에서 재확인 필수)

색상 (hex → design 에이전트가 OKLCH 변환):

```
surface       #f5f3ec   웜 크림 배경(body)
surface-white #ffffff   카드 배경
ink           #131c15   헤딩/본문 다크, 다크 섹션 배경 겸용
ink-soft      #5a6154   본문 보조 텍스트
muted         #8a9080   메타(날짜)
brand         #8bbf4f   주요 CTA(라임 그린)
brand-ink     #132014   브랜드 버튼 위 텍스트
accent        #9fd35c   포인트(히어로 eyebrow, 서비스 번호)
olive         #4a5c42   WHO WE ARE 밴드 배경
olive-label   #5c7a45   섹션 eyebrow(밝은 배경)
olive-soft    #c7dba0 / #8ba873   다크/올리브 배경 위 라벨
tint          #eef3e5   아이콘 배경(연녹)
```

타이포:

```
font-display  Manrope (500/700/800)   영문·숫자·eyebrow
font-body     Noto Sans KR (400/500/700/900)  본문
스케일(px)     72 64 38 36 28 26 24 20 19 17 16 15.5 15 14.5 14 13.5 13 12.5 12 11
letter-spacing eyebrow류 .14~.22em, 본문 -.01em~.04em
line-height   히어로 1.08 / 헤딩 1.25~1.3 / 본문 1.7~1.8
```

스페이싱/기타:

```
섹션 padding   100~120px (수직) · 64px (수평)
컨테이너       max-width 1280px, 중앙 정렬 → content-container 유틸
radius        card 4px / image 8px / pill 24~28px / full 50%
border        1px, 라이트 rgba(0,0,0,.08~.1) · 다크 rgba(255,255,255,.1~.14)
shadow        사실상 없음 (플랫)
```

## 페이지 섹션 순서 (원본 기준)

1. Header/Nav (히어로 위 오버레이, 다크 투명 배경)
2. Hero — eyebrow / 대형 헤드라인 / 리드문 / CTA 2개, 배경 이미지 플레이스홀더
3. Who We Are — 올리브 밴드, 2열(설명 + ENVIRONMENT/IT SOLUTION 2항목)
4. News — 리스트 3행 (제목 + 날짜), "전체보기"
5. About Business — 3카드(ENVIRONMENT SI / R&D / CONSULTING) + CTA
6. About Service — 다크 섹션, 에디토리얼 3행(번호 + 텍스트/이미지 교차) + CTA
7. Footer — 4열(회사정보 + 3메뉴그룹) + 카피라이트

콘텐츠 실제 텍스트는 원본 HTML과 `docs/legacy-site-reference.md` 참조. 회사정보/연락처는 `shared/constants/site.ts`로.

## 위임 순서

1. **design (Bootstrap)** — 토큰 3종 산출물 + 핵심 `shared/ui`(Button, SectionLabel) 생성. `plans/20260703-landing-design.md`에 토큰·컴포넌트 명세 기록.
2. **implementer** — widgets(site-header/site-footer) + views/landing(섹션들 + LandingView) + site.ts 상수 + layout 폰트 교체 + page.tsx 연결.
3. **design (polish)** — 토큰 준수 정리(하드코딩 제거).
4. **reviewer** — 의미론적 검토.

## 참조 파일

- `docs/design-source/Ethree-Landing.dc.html` — 디자인 원본(토큰·마크업 기준)
- `docs/legacy-site-reference.md` — 콘텐츠·IA 기준
- `plans/20260703-landing-design.md` — design 작성 후 (토큰/컴포넌트 계약)

## GitHub

- 이슈: `[Feat] 랜딩페이지 구현 및 디자인 토큰 Bootstrap` (label: frontend)
- 브랜치: `feat/#N-landing` (base: dev)
