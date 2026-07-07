"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/shared/api/supabaseServerClient";
import {
  careersSettingsFormSchema,
  type CareersSettingsFormValues,
  type UpdateCareersSettingsResult,
} from "../model";

/**
 * 수신 이메일 설정 수정 Server Action.
 *
 * 인가: `createServerSupabaseClient()`(쿠키 기반 authenticated 세션)로 `getUser()`
 *   확인. 미인증이면 거부한다. **service_role 키 사용 금지** — RLS `admin_update`
 *   정책이 authenticated 세션을 검증하므로 사용자 세션 클라이언트로 update 해야
 *   인가 경계가 선다(company-info updateCompanyInfo 패턴 미러).
 *
 * 검증: 클라이언트 입력은 신뢰 불가 → zod 로 재파싱한다.
 *
 * 매핑: camelCase 폼 값 → DB snake payload. 빈 fromEmail 은 null 로 저장(선택값).
 *   `id`/`updated_at` 은 제외(id 고정, updated_at 은 트리거 자동 갱신).
 *
 * 무효화: 성공 시 관리 페이지(`/console/careers`)를 revalidate 해 최신값 반영.
 */
export async function updateCareersSettings(
  input: CareersSettingsFormValues,
): Promise<UpdateCareersSettingsResult> {
  const parsed = careersSettingsFormSchema.safeParse(input);
  if (!parsed.success) {
    const first =
      parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다.";
    return { ok: false, message: first };
  }

  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { ok: false, message: "인증이 필요합니다. 다시 로그인해 주세요." };
  }

  const v = parsed.data;
  const fromEmail = v.fromEmail && v.fromEmail.length > 0 ? v.fromEmail : null;

  const { error } = await supabase
    .from("careers_settings")
    .update({
      recipient_email: v.recipientEmail,
      from_email: fromEmail,
    })
    .eq("id", 1);

  if (error) {
    return {
      ok: false,
      message: "저장에 실패했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }

  revalidatePath("/console/careers");

  return { ok: true };
}
