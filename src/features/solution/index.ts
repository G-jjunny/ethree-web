/**
 * features/solution Public API.
 *
 * ⚠️ 배럴 서버/클라 유출 경계 (news/index.ts 주석과 동일 원리)
 * 이 배럴은 서버 전용 getter(unstable_cache · next/headers · anon/세션 서버 클라이언트),
 * Server Action('use server'), 그리고 클라이언트 컴포넌트(SolutionForm/SolutionAdminTable)를
 * 함께 노출한다. 배럴에서 무엇이든 import하면 번들러가 배럴 모듈 그래프 전체(=서버 전용 코드)를
 * 끌어오므로, **이 배럴은 서버 컴포넌트(page/view)에서만 소비한다.**
 *
 * 클라이언트 컴포넌트(SolutionForm/SolutionAdminTable)는 이 배럴을 import하지 않고
 * 필요한 model/Server Action을 하위 파일에서 직접 import한다(각 파일 상단 주석 참조).
 * 뷰 레이어의 fallback 상수(business-solutions.data.ts)는 타입만 필요하므로
 * `import type`으로 `./model/types`를 직접 참조한다(런타임 코드 미포함, 배럴 우회).
 */

// 서버 전용 getter (next/headers · unstable_cache 경유) — 서버 컴포넌트에서만 소비
export { getSolutionSlides } from "./api/getSolutionSlides";
export { getAdminSolutionSlides } from "./api/getAdminSolutionSlides";
export { getAdminSolutionSlideById } from "./api/getAdminSolutionSlideById";

// Server Actions ('use server')
export { createSolutionSlide } from "./api/createSolutionSlide";
export { updateSolutionSlide } from "./api/updateSolutionSlide";
export { deleteSolutionSlide } from "./api/deleteSolutionSlide";
export { reorderSolutionSlides } from "./api/reorderSolutionSlides";
export { uploadSolutionImage } from "./api/uploadSolutionImage";

// 클라이언트 컴포넌트 — 서버 컴포넌트(page)에서 렌더 지점에 배치
export { SolutionForm } from "./ui/SolutionForm";
export type { SolutionFormProps } from "./ui/SolutionForm";
export { SolutionAdminTable } from "./ui/SolutionAdminTable";
export type { SolutionAdminTableProps } from "./ui/SolutionAdminTable";

// model 타입/스키마 (순수 · 클라/서버 안전)
export type {
  SolutionSlide,
  SolutionAdminItem,
  SolutionFormValues,
  SolutionMutationResult,
  UploadSolutionImageResult,
} from "./model";
export { solutionFormSchema } from "./model";
