# 관리자 로그인 완성 + 대시보드 셸(Phase 1) 작업 계획

## 목표

로그아웃 기능을 추가하고, 로그인 화면을 제외한 관리자 크롬(상단바+섹션 내비)과 대시보드 홈 요약 카드 셸을 구현한다.

## 범위

- `features/admin-login` 확장 — 로그아웃 훅 + 버튼
- `app/(admin)/console` — 관리자 크롬 레이아웃 구조(로그인 제외) + 대시보드 홈 카드
- Supabase 스키마 변경: **없음** (supabase-agent 생략)
- 회사 메타정보 관리 기능: **다음 Phase** (이번 범위 아님, /console/company 링크만 미리 배치 가능)

## 위임 순서

1. ~~supabase-agent~~ — 스키마 변경 없음, 생략
2. ~~design(Pre)~~ — 신규 shared/ui 공용 컴포넌트 불필요(기존 Button 재사용), 생략
3. implementer — 로그아웃(훅+버튼), console layout/셸 구조(로그인 제외), 대시보드 홈 카드
4. design (polish) — 대시보드 셸·상단바·카드 마크업/토큰 정리
5. reviewer — 최종 검토

## 구현 상세

### 1) 로그아웃 (features/admin-login 확장)
- `api/useLogoutMutation.ts` — `createBrowserSupabaseClient().auth.signOut()`. 배럴 금지, 직접 import(`@/shared/api/ApiError`, `@/shared/api/supabaseBrowserClient`). 에러 시 ApiError throw. (useLoginMutation.ts 주석 패턴 준수)
- `ui/LogoutButton.tsx`("use client") — 클릭 시 로그아웃 → 성공 시 `router.replace(`${ADMIN_BASE_PATH}/login`)` + `router.refresh()`. `shared/ui` Button 재사용. isPending 처리(disabled/로딩).
- `features/admin-login/index.ts`에 `LogoutButton`, `useLogoutMutation` export 추가.

### 2) 대시보드 셸 (신규 layout)
- 핵심 제약: **로그인 페이지(`/console/login`)에는 관리자 크롬이 적용되면 안 됨.**
- 권장 구조: `console/layout.tsx`는 크롬 없는 최소 래퍼로 두고, 대시보드 전용 크롬은 `console/(dashboard)/layout.tsx` 하위 route group 등으로 login을 제외. implementer가 FSD·Next 16 규칙 내에서 로그인 제외가 보장되는 구조를 선택.
- 상단바: 좌측 `SITE.nameEn`("E3") 워드마크 + "관리자" 라벨, 우측 `LogoutButton`. 다크 `bg-ink` 톤(기존 로그인 페이지 톤과 통일).
- 섹션 내비: 대시보드=/console, 회사 정보=/console/company(향후 라우트, 링크만 미리 배치).
- 본문 `{children}`. 서버 컴포넌트 기본, 상호작용(로그아웃)만 클라이언트 경계.
- `console/page.tsx`(대시보드 홈) — placeholder 제거 → 관리 항목 요약 카드("회사 정보 관리" 진입 카드, 향후 서비스/실적 자리). 점진 확장 대비 구조. 토큰 사용.

## 규칙(전 에이전트 공통)
- FSD 정방향 import, 슬라이스 index.ts 경유. 토큰 하드코딩 0, `any` 금지, Props interface.
- 서버 컴포넌트 기본, 상호작용만 클라이언트. **proxy(src/proxy.ts)·기존 로그인 코드 변경 금지.**
- 신규 색상/토큰 생성 금지 — docs/design.md 기존 토큰만.
- browser 훅에서 `@/shared/api` 배럴 import 금지(서버 모듈 유출 → 빌드 실패).
- Supabase 키 미연결 상태에서도 빌드/렌더 정상(로그아웃은 클릭 시 런타임에만 Supabase 필요).

## 검증
- Hook lint+tsc, `npm run build`(Next 16) 통과.
- `/console/login`은 크롬 없이 렌더, `/console`·`/console/company`(레이아웃만)는 크롬 적용.
- proxy 미변경 확인.

## 참조 파일
- src/proxy.ts (변경 금지)
- src/features/admin-login/api/useLoginMutation.ts (import 패턴 SSOT)
- src/shared/constants/admin.ts (ADMIN_BASE_PATH)
- src/shared/constants/site.ts (SITE.nameEn 등)
- src/shared/ui/index.ts (Button 재사용)
- docs/design.md (토큰 SSOT)
