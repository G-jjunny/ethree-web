# 회사 메타정보 관리 (Phase 2) 작업 계획

## 목표

관리자가 화면에 노출되는 회사 정보 전체를 한 곳(`/console/company`)에서 편집하고, 공개 사이트는 DB에서 읽되 미적용/오류 시 `SITE` 상수 fallback으로 항상 안전하게 렌더한다.

## 범위

- **Supabase 스키마 변경: 있음** — `company_info` 싱글톤 테이블 + RLS + seed 마이그레이션.
- 레이어/슬라이스:
  - `features/company-info` (신규): `api/getCompanyInfo`(서버 getter), `api/updateCompanyInfo`(Server Action), `model/`(zod 스키마+타입), `ui/CompanyInfoForm`, `index.ts`(서버/클라 분리 export).
  - `widgets/site-footer` (전환): `SITE.*` → `await getCompanyInfo()` 소비.
  - `widgets/site-header` (전환): 회사명/브랜드/연락처 노출부만 DB 소비로 전환(확인 후). 단 정적 SEO/브랜드값은 SITE 유지.
  - `app/(admin)/console/(dashboard)/company/page.tsx` (신규 라우트, 크롬 그룹 안).
  - 대시보드 카드/네비 링크는 이미 `/console/company`를 가리킴(layout.tsx, page.tsx) — 링크 신규 추가 불필요, 동작 확인만.

## 위임 순서

1. **supabase-agent** — `company_info` 테이블·RLS·seed·마이그레이션 SQL + schema.md 작성.
2. **implementer** — getCompanyInfo+fallback, footer/header 전환, company-info feature(model/getter/Server Action/폼), company 라우트.
3. **design (polish)** — 폼·회사정보 페이지 마크업/토큰 정리(대시보드 크롬 톤 일관).
4. **reviewer** — RLS·인가 경계·service key 유출·FSD·배럴 서버유출·토큰·fallback 안전성 검토.

## 핵심 제약 (전 에이전트 준수)

- **RLS 필수**: `company_info` RLS 활성. select=공개(anon/authenticated), update=authenticated만, insert는 마이그레이션 시드 1행만, delete 정책 없음.
- **service_role 키 클라이언트 노출 금지**. Server Action은 `createServerSupabaseClient()`의 authenticated 세션으로 RLS 통과(service_role 사용 금지).
- **배럴 서버유출 금지**: `getCompanyInfo`/Server Action은 서버 전용(next/headers 경유). 클라이언트 폼에서 `@/shared/api` 배럴 및 서버 getter를 import하지 않도록 features/company-info의 index.ts에서 서버 export와 클라 export를 분리. 클라 컴포넌트는 `@/shared/api/supabaseBrowserClient` 등 각 파일 직접 import.
- **fallback 안전성**: 테이블 없음/키 미연결/쿼리 에러 시 반드시 `SITE`로 폴백. 마이그레이션 미실행 상태에서도 `npm run build`/렌더 정상이어야 함.
- **SITE 상수 삭제 금지** — 시드 + fallback의 SSOT.
- 토큰 하드코딩 0, any 금지, Props interface, 서버 컴포넌트 기본(폼 상호작용만 클라이언트).
- 슬라이스 index.ts 경유 import, FSD 정방향.

## 반환 shape 계약 (getCompanyInfo)

`SITE`와 동일한 nested shape로 매핑(소비부 diff 최소화):
```
{
  name, nameEn, legalName, ceo, url, tagline, description,
  address: { line1, line2 },
  contact: { tel, fax, email },
  copyright
}
```
DB 컬럼(flat, snake) → 위 nested 구조로 매핑. email은 SITE에 없으므로 DB 값 우선, 없으면 "".

## 참조 파일

- plans/20260706-admin-company-schema.md (supabase-agent 작성 후 — DB 컬럼·타입·RLS·반환 shape 계약)
- src/shared/constants/site.ts (SITE — 시드/fallback SSOT)
- src/shared/api/supabaseServerClient.ts (createServerSupabaseClient)
- src/widgets/site-footer/ui/SiteFooter.tsx, src/widgets/site-header/ui/SiteHeader.tsx (소비부)
- src/app/(admin)/console/(dashboard)/layout.tsx, page.tsx (크롬·카드 링크)
- src/features/admin-login/api/useLoginMutation.ts (배럴 서버유출 주석 참고)
