import { z } from "zod";
import type { JSONContent } from "@tiptap/react";

/**
 * News 폼 검증 스키마 (클라이언트 폼 · Server Action 공유 계약).
 * - title: 필수.
 * - slug: 필수. 소문자/숫자/하이픈(kebab-case)만. 한글 제목 대응을 위해 수동 입력 허용.
 * - excerpt: 선택(빈 문자열 허용) — 저장 시 "" → null 매핑.
 * - coverImageUrl: 선택. 값이 있으면 URL 형식.
 * - body: TipTap doc JSON. 최소 유효 doc 구조 보장.
 * - published: 발행 여부.
 */

/** 빈 본문 폴백(seed 사용값과 동일한 최소 유효 doc). */
export const EMPTY_DOC: JSONContent = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

/** 신뢰할 수 없는 입력이 최소 유효 TipTap doc인지 판별(any 미사용). */
function isTiptapDoc(value: unknown): value is JSONContent {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as { type?: unknown }).type === "doc"
  );
}

/** body 필드 스키마 — 타입은 JSONContent를 유지하되 doc 형태를 강제한다. */
export const tiptapDocSchema = z.custom<JSONContent>(isTiptapDoc, {
  message: "본문 형식이 올바르지 않습니다.",
});

/** slug 규칙: 소문자/숫자 그룹을 하이픈으로 연결한 kebab-case. */
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const newsFormSchema = z.object({
  title: z.string().trim().min(1, "제목을 입력하세요"),
  slug: z
    .string()
    .trim()
    .min(1, "슬러그를 입력하세요")
    .regex(SLUG_PATTERN, "소문자, 숫자, 하이픈(-)만 사용할 수 있습니다"),
  excerpt: z.string().trim(),
  coverImageUrl: z.union([
    z.literal(""),
    z.string().url("올바른 이미지 URL 형식이 아닙니다"),
  ]),
  body: tiptapDocSchema,
  published: z.boolean(),
});

export type NewsFormValues = z.infer<typeof newsFormSchema>;

/**
 * 제목 기반 slug 자동 생성 헬퍼(수동 입력 보조용).
 * 비-ASCII(한글 등)는 제거되므로 결과가 빈 문자열일 수 있다 — 그 경우 수동 입력을 유도한다.
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}
