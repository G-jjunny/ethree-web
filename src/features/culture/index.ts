/**
 * features/culture Public API.
 *
 * ⚠️ 배럴 서버/클라 유출 경계 (news/index.ts 주석과 동일 원리)
 * 이 배럴은 서버 전용 getter(unstable_cache · next/headers · anon/세션 서버 클라이언트)와
 * Server Action('use server'), 그리고 클라이언트 컴포넌트(CultureAdminManager)를 함께
 * 노출한다. 배럴에서 무엇이든 import하면 번들러가 배럴 모듈 그래프 전체(=서버 전용 코드)를
 * 끌어오므로, **이 배럴은 서버 컴포넌트(page/view)에서만 소비한다.**
 *
 * 클라이언트 컴포넌트(CultureAdminManager/CultureItemForm)는 이 배럴을 import하지 않고
 * 필요한 model/Server Action을 하위 파일에서 직접 import한다(각 파일 상단 주석 참조).
 */

// 서버 전용 getter (next/headers · unstable_cache 경유) — 서버 컴포넌트에서만 소비
export { getCultureItems } from "./api/getCultureItems";
export { getAdminCultureItems } from "./api/getAdminCultureItems";

// Server Actions ('use server')
export { createCultureItem } from "./api/createCultureItem";
export { updateCultureItem } from "./api/updateCultureItem";
export { deleteCultureItem } from "./api/deleteCultureItem";
export { uploadCultureImage } from "./api/uploadCultureImage";

// 클라이언트 컴포넌트 — 서버 컴포넌트(page)에서 렌더 지점에 배치
export { CultureAdminManager } from "./ui/CultureAdminManager";
export type { CultureAdminManagerProps } from "./ui/CultureAdminManager";

// model 타입/스키마 (순수 · 클라/서버 안전)
export type {
  CultureGroup,
  CultureItem,
  CultureContent,
  CultureMutationResult,
  UploadCultureImageResult,
  CultureFormValues,
} from "./model";
export { cultureFormSchema, CULTURE_GROUPS } from "./model";
