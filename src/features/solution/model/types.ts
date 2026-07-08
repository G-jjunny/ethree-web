import type { SolutionFormValues } from "./schema";

export type { SolutionFormValues };

/**
 * 공개 솔루션 슬라이드 shape (snake_case row → camelCase).
 */
export interface SolutionSlide {
  id: string;
  title: string;
  titleAccent: string;
  description: string;
  imageUrl: string | null;
}

/**
 * 관리자 목록 테이블용 shape(비활성 포함, 정렬/노출 정보 노출).
 */
export interface SolutionAdminItem extends SolutionSlide {
  sortOrder: number;
  isActive: boolean;
}

/**
 * `solution_slides` row(DB snake_case). gen types 도입 전 수동 정의 —
 * select 컬럼 계약과 일치.
 */
export interface SolutionRow {
  id: string;
  sort_order: number;
  title: string;
  title_accent: string;
  description: string;
  image_url: string | null;
  is_active: boolean;
}

/** 공개 목록 쿼리 결과(sort_order/is_active 제외 — 정렬/필터는 쿼리에서 이미 처리). */
export type SolutionListRow = Pick<
  SolutionRow,
  "id" | "title" | "title_accent" | "description" | "image_url"
>;

export type CreateSolutionInput = SolutionFormValues;
export type UpdateSolutionInput = SolutionFormValues;

/** Server Action(create/update/delete/reorder) 결과 shape. */
export type SolutionMutationResult =
  | { ok: true }
  | { ok: false; message: string };

/** 이미지 업로드 결과 shape. 성공 시 public URL 반환. */
export type UploadSolutionImageResult =
  | { ok: true; url: string }
  | { ok: false; message: string };
