/**
 * 회사정보 캐시 태그(SSOT). getter의 `unstable_cache` 태그와
 * Server Action의 `revalidateTag` 대상이 이 상수를 공유한다.
 * next/headers를 import하지 않는 순수 상수 — 서버 어디서나 안전하게 참조.
 */
export const COMPANY_INFO_TAG = "company-info";
