# 관리자 스캐폴드 + 기업문화·인재채용 공개 페이지 정적 디자인(Phase 1) 작업 계획

## 목표
관리자 콘솔에 8개 관리 라우트 스캐폴드를 추가하고(기존 company 포함 총 9), Customer Support의 기업문화·인재채용 공개 페이지를 정적 디자인으로 구현한다. Supabase/외부 패키지/이메일은 이번 범위 밖(Phase 2·3·4).

## 범위
- **레이어**: `app/(admin)/console/(dashboard)/*` (라우트 8개 신설 + 재사용 스캐폴드 컴포넌트), `app/(marketing)/support/culture|careers` 라우트 전환, `views/support-culture` 신설, `views/support-careers` 신설.
- **Supabase 스키마 변경**: 없음.
- **신규 shared/ui 컴포넌트**: 원칙적으로 없음(기존 SectionLabel·Button·IconCard 재사용). 스텝 UI/폼은 뷰-로컬 또는 기존 토큰 조합. 3곳 이상 반복 아닌 한 shared 승격 금지 — design 판단.

## 위임 순서
1. supabase-agent — 생략(스키마 변경 없음)
2. design(Pre) — 생략(신규 shared/ui 불필요; design은 3단계 polish에서 관여)
3. implementer — 관리자 스캐폴드 + support-culture/careers 뷰 스캐폴딩·라우트 전환(구조·데이터·서버/클라 경계)
4. design(polish) — 스캐폴드 톤, 기업문화/인재채용 섹션 레이아웃·스텝 UI·폼 마크업·토큰·밴드 리듬 정리
5. reviewer — 최종 검토

## 1-A. 관리자 페이지 스캐폴드
- `console/(dashboard)/` 아래 신설 라우트(각 page.tsx, 크롬 그룹 안):
  greeting(인사말), history(연혁 및 비전), location(오시는 길), business(사업소개), service(서비스소개), news(NEWS), culture(기업문화), careers(인재채용).
- 재사용 스캐폴드 컴포넌트 1개를 `console/(dashboard)`에 두고 각 page가 title/desc(무엇을 관리할지 한 줄)만 전달. "준비 중 — 곧 제공됩니다" 안내 포함. 회사 정보 페이지 톤(SectionLabel olive + font-display h2 + text-body-sm) 참고.
- `MANAGE_ITEMS`(page.tsx) 그룹 배열 구조로 리팩터 + 그룹 헤딩 구획:
  About E3(인사말·연혁·오시는 길) / About Business(사업소개·서비스소개) / Customer Support(NEWS·기업문화·인재채용) / 기타(회사 정보). 기존 company 카드 유지.
- `CONSOLE_NAV`(layout.tsx): 너무 길어지지 않게 핵심만(대시보드·회사 정보·NEWS·기업문화·인재채용) — 최종 판단 design.
- href는 `${ADMIN_BASE_PATH}/{key}` (ADMIN_BASE_PATH="/console").

## 1-B. 기업문화 공개 페이지 정적 디자인
- `src/views/support-culture/`(index.ts + ui/) 신설. `/support/culture/page.tsx`를 PlaceholderPage → `SupportCultureView` 조립. buildMetadata 유지.
- 공용 헤더 PlaceholderHeader(eyebrow="CUSTOMER SUPPORT", title="기업문화") + PlaceholderSubNav(siblings=`/support` group children, activeHref="/support/culture").
- 섹션: 인재상 / 핵심가치 / 복지·근무환경 등 이미지+텍스트 블록. 기존 밴드 리듬·토큰, ServiceRow/IconCard류 재사용 가능.
- 콘텐츠는 Phase 3 DB 편집 대상 → 블록/상수 단위 구조화(뷰-로컬 상수). 이미지는 placeholder + next/image 교체 슬롯 주석. 텍스트는 일반적·수정가능 카피(허위 구체수치 금지).

## 1-C. 인재채용 공개 페이지 정적 디자인
- `src/views/support-careers/` 신설. `/support/careers/page.tsx` 전환. 헤더(eyebrow="CUSTOMER SUPPORT", title="인재채용") + SubNav(activeHref="/support/careers").
- 섹션1: 단계별 채용 절차 스텝 UI(서류전형 → 실무 면접 → 처우 협의 → 최종 합격 등, 번호/스텝 카드·타임라인, 토큰만).
- 섹션2(하단): 이메일 지원/문의 폼 UI(이름·이메일·내용 textarea + 제출 버튼). **폼 UI만 — 제출 로직 없음**(Phase 4에서 /api/careers 연결). "use client" 최소 경계 또는 정적 마크업(제출 비활성). shared/ui 입력/버튼 스타일 재사용. 실제 전송 미구현임을 코드 주석으로.

## 규칙
- FSD 정방향, 슬라이스 index.ts 경유. 토큰 하드코딩 0(기존 토큰만, 신규 색상 금지), content-container 강제, any 금지, Props interface, 반응형(sm:/lg:). 서버 컴포넌트 기본. 기존 대시보드 layout/proxy/로그인 코드 훼손 금지.

## 참조 파일
- src/app/(admin)/console/(dashboard)/page.tsx (MANAGE_ITEMS)
- src/app/(admin)/console/(dashboard)/layout.tsx (CONSOLE_NAV)
- src/app/(admin)/console/(dashboard)/company/page.tsx (스캐폴드 톤 참고)
- src/views/business-service/ui/BusinessServiceView.tsx (헤더/밴드 리듬 참고)
- src/widgets/placeholder-page/index.ts (PlaceholderHeader/SubNav)
- src/shared/constants (NAV_GROUPS, ADMIN_BASE_PATH), src/shared/ui/index.ts
- docs/design.md (토큰 SSOT)
