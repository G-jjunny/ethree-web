/**
 * careers(인재채용) 도메인 타입.
 *
 * gen types 도입 전 수동 정의 — schema.md 의 컬럼/매핑 계약과 일치한다.
 * DB row 는 snake_case, FE 반환 shape 는 camelCase(schema.md "FE 반환 shape 권장 매핑").
 */

/** `careers_submissions` 단건(DB flat/snake_case). */
export interface CareersSubmissionRow {
  id: string;
  name: string;
  email: string;
  message: string;
  email_sent: boolean;
  created_at: string;
}

/** `careers_settings` 단건(DB flat/snake_case, 싱글톤 id=1). */
export interface CareersSettingsRow {
  id: number;
  recipient_email: string;
  from_email: string | null;
  updated_at: string;
}

/** 관리자 목록에 노출되는 제출 내역(camelCase). */
export interface CareersSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  emailSent: boolean;
  createdAt: string;
}

/** 수신 이메일 설정(camelCase). */
export interface CareersSettings {
  recipientEmail: string;
  fromEmail: string | null;
  updatedAt: string;
}

/** 공개 폼 제출 Route Handler(`POST /api/careers`) 응답 shape. */
export interface SubmitCareersResponse {
  ok: boolean;
  message: string;
  /** 이메일 발송 성공 여부(스킵/실패 시 false). 저장은 성공해도 발송은 별개. */
  emailSent?: boolean;
}

/** 수신 설정 저장 Server Action 반환 shape(discriminated union). */
export type UpdateCareersSettingsResult =
  | { ok: true }
  | { ok: false; message: string };
