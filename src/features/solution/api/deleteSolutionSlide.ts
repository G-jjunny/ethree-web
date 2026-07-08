"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { createServerSupabaseClient } from "@/shared/api/supabaseServerClient";
import type { SolutionMutationResult } from "../model/types";
import { SOLUTION_TAG } from "./solutionTag";

/**
 * Solution 슬라이드 삭제 Server Action(id 기준).
 *
 * 인가: 세션 클라이언트 `getUser()`(미인증 거부). service_role 금지 — RLS `admin_delete`.
 * 무효화: 태그 + 랜딩 경로 revalidate.
 */
export async function deleteSolutionSlide(
  id: string,
): Promise<SolutionMutationResult> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { ok: false, message: "인증이 필요합니다. 다시 로그인해 주세요." };
  }

  const { error } = await supabase
    .from("solution_slides")
    .delete()
    .eq("id", id);

  if (error) {
    return { ok: false, message: "삭제에 실패했습니다. 잠시 후 다시 시도해 주세요." };
  }

  revalidateTag(SOLUTION_TAG, "max");
  revalidatePath("/");

  return { ok: true };
}
