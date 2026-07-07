/**
 * features/careers Public API.
 *
 * ⚠️ 배럴 서버/클라 유출 경계 (company-info/index.ts 주석과 동일 원리)
 * 이 배럴은 서버 전용 getter(getCareersSettings/getAdminSubmissions — next/headers 경유)와
 * Server Action(updateCareersSettings), 그리고 클라이언트 컴포넌트(CareersSettingsForm)를
 * 함께 노출한다. 배럴에서 무엇이든 import 하면 번들러가 배럴 모듈 그래프 전체(=서버 전용
 * 코드)를 끌어오므로, **이 배럴은 서버 컴포넌트에서만 소비한다**:
 *   - console/careers/page(서버)
 *
 * 클라이언트 컴포넌트/훅은 이 배럴을 import 하지 않고 필요한 것을 하위 파일에서 직접
 * import 한다(서버코드 클라 유입 차단):
 *   - CareersSettingsForm → model, updateCareersSettings 를 하위 직접 import
 *   - useSubmitCareersMutation(공개 폼) → model, shared/api/axiosInstance 를 하위 직접 import
 *
 * Route Handler(app/api/careers/route.ts)는 model(순수 zod/타입)만 이 배럴에서 소비한다.
 */

// 서버 전용 (next/headers 경유) — 서버 컴포넌트에서만 소비
export { getCareersSettings } from "./api/getCareersSettings";
export { getAdminSubmissions } from "./api/getAdminSubmissions";
export { updateCareersSettings } from "./api/updateCareersSettings";

// UI 컴포넌트 — 서버 컴포넌트(page)에서 렌더 지점에 배치
export { CareersSettingsForm } from "./ui/CareersSettingsForm";
export type { CareersSettingsFormProps } from "./ui/CareersSettingsForm";
export { CareersSubmissionsList } from "./ui/CareersSubmissionsList";
export type { CareersSubmissionsListProps } from "./ui/CareersSubmissionsList";

// 공개 폼 제출 훅(클라) — 공개 뷰에서 소비. 하위 직접 import 도 가능하나 배럴에도 노출.
// 주: 이 훅은 서버 모듈을 참조하지 않으므로 배럴 경유 유입 위험이 없다. 다만 위 서버
// getter 들이 같은 배럴에 있으므로, 이 훅을 쓰는 클라 컴포넌트는 배럴이 아닌
// ./api/useSubmitCareersMutation 를 직접 import 해야 안전하다.
export { useSubmitCareersMutation } from "./api/useSubmitCareersMutation";

// model 타입/스키마 (순수 · 클라/서버 안전)
export type {
  CareersSubmission,
  CareersSubmissionRow,
  CareersSettings,
  CareersSettingsRow,
  CareersFormValues,
  CareersSettingsFormValues,
  SubmitCareersResponse,
  UpdateCareersSettingsResult,
} from "./model";
export {
  careersFormSchema,
  careersSettingsFormSchema,
  careersSettingsToFormValues,
} from "./model";
