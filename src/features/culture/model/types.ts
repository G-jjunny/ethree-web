import type { CultureFormValues } from "./schema";

/**
 * 기업문화 항목 섹션 구분. DB `culture_items."group"` CHECK 제약과 1:1.
 * - talent        인재상
 * - value         핵심가치
 * - welfare       복지·근무환경 benefit
 * - welfare_intro 복지 섹션 헤더(인트로) 단건
 */
export type CultureGroup = "talent" | "value" | "welfare" | "welfare_intro";

/**
 * 기업문화 개별 항목 도메인 타입(snake_case row → camelCase).
 * schema.md "FE 반환 shape 권장 매핑"과 동일.
 */
export interface CultureItem {
  id: string;
  group: CultureGroup;
  sortOrder: number;
  title: string;
  description: string;
  /** 표시 배지. talent="01".. / value="VALUE 01".. / welfare·intro=null. */
  label: string | null;
  /** Storage(culture-images) public URL. 없으면 null. */
  imageUrl: string | null;
}

/**
 * 공개 페이지 소비용 집계 shape. 기존 정적 뷰 구조와 1:1 대응하도록
 * group 별로 묶어 반환한다(getCultureItems). welfareIntro 는 단건.
 */
export interface CultureContent {
  talent: CultureItem[];
  values: CultureItem[];
  welfare: CultureItem[];
  welfareIntro: CultureItem | null;
}

/**
 * `culture_items` row(DB snake_case). gen types 도입 전 수동 정의 —
 * schema.md select 컬럼 계약과 일치. getter는 `.returns<CultureItemRow[]>()`로 부여.
 */
export interface CultureItemRow {
  id: string;
  group: CultureGroup;
  sort_order: number;
  title: string;
  description: string;
  label: string | null;
  image_url: string | null;
}

/** Server Action 입력 타입(폼 값과 동일 계약). */
export type CreateCultureInput = CultureFormValues;
export type UpdateCultureInput = CultureFormValues;

/**
 * culture mutation(create/update/delete) 결과 shape.
 * 성공/에러를 호출부가 판별하도록 discriminated union으로 둔다.
 */
export type CultureMutationResult =
  | { ok: true }
  | { ok: false; message: string };

/** 이미지 업로드 결과 shape. 성공 시 public URL 반환. */
export type UploadCultureImageResult =
  | { ok: true; url: string }
  | { ok: false; message: string };
