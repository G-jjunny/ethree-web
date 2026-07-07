import { z } from "zod";
import type { CareersSettings } from "./types";

/**
 * 공개 인재채용 폼 검증 스키마(camelCase).
 * - name: 1자 이상 필수(공백 트림), 과도 입력 방지 상한.
 * - email: 이메일 형식 필수.
 * - message: 1자 이상 필수(공백 트림), 본문 상한.
 *
 * 이 스키마는 클라이언트 폼(CareersForm)과 Route Handler(POST /api/careers)가
 * 공유한다 — 입력 계약을 한 곳에서 단일화한다(클라 검증 + 서버 재검증).
 */
export const careersFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "이름을 입력해 주세요")
    .max(100, "이름은 100자 이하로 입력해 주세요"),
  email: z
    .string()
    .trim()
    .min(1, "이메일을 입력해 주세요")
    .email("올바른 이메일 형식이 아닙니다"),
  message: z
    .string()
    .trim()
    .min(1, "내용을 입력해 주세요")
    .max(5000, "내용은 5000자 이하로 입력해 주세요"),
});

export type CareersFormValues = z.infer<typeof careersFormSchema>;

/**
 * 관리자 수신 이메일 설정 폼 검증 스키마(camelCase).
 * - recipientEmail: 발송 수신 주소. 빈 문자열(미설정) 허용 또는 이메일 형식.
 * - fromEmail: 발신 주소(선택). 빈 문자열 허용 또는 이메일 형식. optional.
 *
 * 관리자 폼(CareersSettingsForm)과 Server Action(updateCareersSettings)이 공유한다.
 */
export const careersSettingsFormSchema = z.object({
  recipientEmail: z.union([
    z.literal(""),
    z.string().trim().email("올바른 이메일 형식이 아닙니다"),
  ]),
  fromEmail: z
    .union([z.literal(""), z.string().trim().email("올바른 이메일 형식이 아닙니다")])
    .optional(),
});

export type CareersSettingsFormValues = z.infer<typeof careersSettingsFormSchema>;

/**
 * `CareersSettings`(getter 반환) → 폼 값으로 매핑한다.
 * null 인 fromEmail 은 폼에서 빈 문자열로 표현한다(입력 편집 편의).
 */
export function careersSettingsToFormValues(
  settings: CareersSettings,
): CareersSettingsFormValues {
  return {
    recipientEmail: settings.recipientEmail,
    fromEmail: settings.fromEmail ?? "",
  };
}
