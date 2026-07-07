# 인재채용 이메일 전송(Phase 4) 작업 계획

## 목표

인재채용 공개 폼(CareersForm) 제출 → DB 저장 + 관리자 지정 이메일로 Resend 발송, 관리자 콘솔에서 제출 내역 확인 및 수신 이메일 설정.

## 범위

- Supabase 스키마 변경: **있음** — `careers_submissions`, `careers_settings`(싱글톤) 신규 테이블 + RLS + seed.
- npm 신규 패키지: **resend** (orchestrator 승인 완료).
- 레이어/슬라이스:
  - `src/app/api/careers/route.ts` — POST Route Handler(zod 검증 → 저장 → Resend 발송, graceful).
  - `src/features/careers/` — model(zod), api(제출 useMutation, getAdminSubmissions/updateCareersSettings Server Action, getCareersSettings 서버 getter), ui(관리 컴포넌트).
  - `src/views/support-careers/ui/CareersForm.tsx` — /api/careers 제출 연결(마커 주석 3곳 대체, 제출 활성화, pending/성공/에러/리셋).
  - `src/app/(admin)/console/(dashboard)/careers/page.tsx` — 스캐폴드 교체(제출 목록 + 수신 이메일 설정 폼).
  - `.env.example` — RESEND_API_KEY(+ 선택 CAREERS_FROM_EMAIL) 추가.

## 위임 순서

1. supabase-agent — careers_submissions·careers_settings 스키마·RLS·seed·schema.md 작성.
2. implementer — resend 설치(승인됨), Route Handler, features/careers, CareersForm 연결, console/careers 관리.
3. design (polish) — 관리자 제출 목록/수신설정 UI, 공개 폼 제출 상태 마크업 토큰 정리.
4. reviewer — RLS·인가·service key·입력 검증/새니타이즈·배럴·FSD·토큰·graceful 검토.

## 핵심 제약 (전 에이전트)

- RLS 필수: careers_submissions insert=anon 허용, select/update/delete=authenticated. careers_settings write=authenticated. settings 읽기 경로는 supabase-agent가 판단(anon select 허용 vs Route Handler service_role 서버 전용 읽기) 후 schema.md에 명시.
- service_role 키 클라 노출 금지(서버 전용: Route Handler/Server Action).
- RESEND_API_KEY 미설정/미연결에서도 빌드·렌더·제출저장 정상(이메일만 graceful 스킵).
- 이메일 본문에 사용자 입력 삽입 시 새니타이즈(isomorphic-dompurify 사용 가능) / HTML 이스케이프.
- FSD 정방향, 슬라이스 index.ts 경유, 서버/클라 배럴 분리(클라 컴포넌트/훅은 @/shared/api 배럴 직접 import 금지).
- 토큰 하드코딩 0, any 금지, Props interface. 관리 라우트는 (dashboard) 크롬 그룹 안.

## 재사용 패턴 (참조 파일)

- 서버 getter + fallback + unstable_cache/cacheTag: `src/features/company-info/api/getCompanyInfo.ts`
- Server Action(getUser 인가 → update → revalidateTag): `src/features/company-info/api/updateCompanyInfo.ts`
- 서버/클라 배럴 분리 주석: `src/features/company-info/index.ts`
- 관리자 폼 컴포넌트: `src/features/company-info/ui/CompanyInfoForm.tsx`
- 관리자 페이지: `src/app/(admin)/console/(dashboard)/company/page.tsx`
- 서버 세션 클라(Route Handler/Action): `src/shared/api/supabaseServerClient.ts` (anon key + cookies → 방문자는 anon 롤)
- 공개 폼 대상: `src/views/support-careers/ui/CareersForm.tsx` (마커 9·17·76행)

## 참조 파일 (핸드오프)

- plans/20260707-careers-schema.md (supabase-agent 작성)
