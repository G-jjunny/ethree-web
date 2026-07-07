# 기업문화 콘텐츠·이미지 관리 (Phase 3) 작업 계획

## 목표

Phase 1에서 정적(support-culture.data.ts)으로 구현된 기업문화 페이지(인재상·핵심가치·복지)를 관리자가 항목 단위로 추가/수정/삭제 + 이미지 업로드할 수 있는 Supabase 기반 동적 콘텐츠로 전환한다. 공개 페이지는 미연결/에러에서도 정적 fallback으로 항상 안전하게 렌더된다.

## 범위

- Supabase 스키마 변경: **있음** — `culture_items` 테이블 + RLS + Storage 버킷 `culture-images` + seed.
- 레이어/슬라이스:
  - `features/culture/` (신규): model(zod/types), api(getter+fallback, Server Actions create/update/delete, uploadCultureImage, cultureTag), ui(관리 폼·항목 목록).
  - `views/support-culture/ui/*` (수정): 정적 상수 소비 → `getCultureItems()` 소비로 전환. 레이아웃/디자인 유지, 이미지 Storage URL(없으면 placeholder).
  - `app/(admin)/console/(dashboard)/culture/page.tsx` (수정): 스캐폴드 교체 → group별 관리 UI.

## 확립된 참조 패턴 (그대로 확장)

- 마이그레이션: `supabase/migrations/20260707120000_news.sql` — 테이블+트리거+RLS(anon select 공개 / authenticated write) + Storage 버킷(news-images: public read, authenticated write) + idempotent seed. **culture는 news-images 버킷 정책을 미러**.
- getter+fallback: `features/news/api/getNewsList.ts` — anon 서버 클라이언트 + `unstable_cache` + tag, try/catch로 에러 시 fallback 반환.
- Server Action: `features/news/api/createNews.ts` — `getUser()` 인가 → zod 재파싱 → DB → `revalidateTag(tag,"max")`+revalidatePath. **service_role 금지**.
- 이미지 업로드: `features/news/api/uploadNewsImage.ts` — FormData(file), getUser() 인가, uuid 경로, ext 화이트리스트, getPublicUrl.
- tag 상수: `features/news/api/newsTag.ts` — 순수 상수(next/headers 미접촉).
- 배럴 서버/클라 분리: `features/news/index.ts` 주석 규칙 — 배럴은 서버 컴포넌트에서만 소비, 클라 컴포넌트/훅은 하위 파일 직접 import(특히 `@/shared/api` 배럴 금지).

## 데이터 구조 (support-culture.data.ts 기준, supabase-agent가 최종 설계)

- TALENT_TRAITS(3): no, title, description → group 'talent'
- CULTURE_VALUES(3): label, title, description → group 'value'
- WELFARE.benefits(4): title, description → group 'welfare'
- WELFARE 인트로(title/description): 섹션 인트로 텍스트 — 별도 소테이블 or 상수 유지 판단은 supabase-agent.
- 각 항목 image_url(optional). talent의 no / value의 label 은 sort_order 파생 or 별도 컬럼 판단.

## 위임 순서

1. supabase-agent — culture 스키마·RLS·Storage 버킷·seed·schema.md (병렬 없음: 스키마가 FE 계약 선행)
2. implementer — getCultureItems+fallback, 공개 섹션 DB 전환, features/culture(Server Actions·폼·업로드), console/culture 관리 라우트
3. design (polish) — 관리 UI 마크업 + 공개 페이지 이미지/레이아웃 토큰 정리
4. reviewer — RLS·인가·service key·배럴 유출·FSD·토큰·fallback·Storage 정책 검토

## 참조 파일

- plans/20260707-culture-schema.md (supabase-agent 작성 후 — FE 계약)
- src/views/support-culture/ui/support-culture.data.ts (현재 정적 구조 / seed 원본 / fallback 원본)

## 규칙

- RLS 필수, service_role 클라 노출 금지(업로드도 authenticated 세션). FSD 정방향, 슬라이스 index.ts. 토큰 하드코딩 0, any 금지, Props interface. 관리 라우트 크롬 그룹 안. 기존 대시보드/proxy/로그인/기존 features 훼손 금지. 공개 페이지 fallback으로 미연결에서도 빌드/렌더 정상.

## 검증

- Hook lint+tsc, `npm run build`(Next 16) 통과 (마이그레이션 미적용에서도 fallback으로 정상).
