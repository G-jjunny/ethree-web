/**
 * 관리자 보호 경로의 단일 소스(SSOT).
 * 비밀 슬러그를 바꿔야 할 때 이 값만 수정하면
 * proxy(구 middleware)·로그인 페이지·대시보드 링크가 함께 갱신된다.
 *
 * 주의: `src/proxy.ts`의 `config.matcher`는 빌드 타임에 정적으로 분석되어야
 * 하므로 이 상수를 참조할 수 없다 — matcher의 문자열 리터럴은 이 값과
 * 수동으로 동기화해야 한다(주석으로 표시되어 있음).
 */
export const ADMIN_BASE_PATH = "/console";
