import { z } from "zod";

/**
 * Solution 슬라이드 폼 검증 스키마 (클라이언트 폼 · Server Action 공유 계약).
 * - title / titleAccent / description: 필수.
 * - imageUrl: 선택(빈 문자열 허용) — 저장 시 "" → null 매핑.
 * - isActive: 공개 노출 여부.
 */
export const solutionFormSchema = z.object({
  title: z.string().trim().min(1, "제목을 입력하세요"),
  titleAccent: z.string().trim().min(1, "강조 텍스트를 입력하세요"),
  description: z.string().trim().min(1, "설명을 입력하세요"),
  imageUrl: z.union([
    z.literal(""),
    z.string().url("올바른 이미지 URL 형식이 아닙니다"),
  ]),
  isActive: z.boolean(),
});

export type SolutionFormValues = z.infer<typeof solutionFormSchema>;
