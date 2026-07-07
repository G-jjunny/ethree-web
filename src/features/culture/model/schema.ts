import { z } from "zod";

/**
 * 기업문화 항목 폼 검증 스키마(클라이언트 폼 · Server Action 공유 계약).
 * - group: 섹션 구분 enum(DB CHECK 제약과 동일).
 * - title/description: 필수(전 항목 보유 — DB NOT NULL).
 * - label: 선택 배지(빈 문자열 허용 → 저장 시 null 매핑). welfare/intro 는 보통 미사용.
 * - imageUrl: 선택. 값이 있으면 URL 형식(빈 문자열 허용 → null 매핑).
 * - sortOrder: group 내 정렬(1-based). create 시 서버가 max+1 로 재부여하므로
 *   폼에서는 현재 값을 실어 보내되 신뢰하지 않는다.
 */

/** 허용 group 값(SSOT). DB CHECK 제약과 동일 순서. */
export const CULTURE_GROUPS = [
  "talent",
  "value",
  "welfare",
  "welfare_intro",
] as const;

export const cultureGroupSchema = z.enum(CULTURE_GROUPS);

export const cultureFormSchema = z.object({
  group: cultureGroupSchema,
  title: z.string().trim().min(1, "제목을 입력하세요"),
  description: z.string().trim().min(1, "설명을 입력하세요"),
  label: z.string().trim(),
  imageUrl: z.union([
    z.literal(""),
    z.string().url("올바른 이미지 URL 형식이 아닙니다"),
  ]),
  sortOrder: z.number().int().nonnegative(),
});

export type CultureFormValues = z.infer<typeof cultureFormSchema>;
