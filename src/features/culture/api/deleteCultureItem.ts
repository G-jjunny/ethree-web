"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { createServerSupabaseClient } from "@/shared/api/supabaseServerClient";
import type { CultureMutationResult } from "../model/types";
import { CULTURE_TAG } from "./cultureTag";

/**
 * Culture 항목 삭제 Server Action(id 기준).
 *
 * 인가: 세션 클라이언트 `getUser()`(미인증 거부). service_role 금지 — RLS `admin_delete`.
 * 무효화: 성공 시 태그 + 공개 경로 revalidate.
 */
export async function deleteCultureItem(
  id: string,
): Promise<CultureMutationResult> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { ok: false, message: "인증이 필요합니다. 다시 로그인해 주세요." };
  }

  const { error } = await supabase.from("culture_items").delete().eq("id", id);

  if (error) {
    return {
      ok: false,
      message: "삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }

  revalidateTag(CULTURE_TAG, "max");
  revalidatePath("/support/culture");

  return { ok: true };
}
