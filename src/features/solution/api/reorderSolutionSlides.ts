"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { createServerSupabaseClient } from "@/shared/api/supabaseServerClient";
import type { SolutionMutationResult } from "../model/types";
import { SOLUTION_TAG } from "./solutionTag";

/**
 * 슬라이드 순서 일괄 갱신 Server Action.
 * orderedIds는 원하는 최종 순서의 id 배열 — 배열 인덱스를 그대로 sort_order로 저장한다.
 * 인가: 세션 클라이언트 `getUser()`(미인증 거부). service_role 금지 — RLS `admin_update`.
 */
export async function reorderSolutionSlides(
  orderedIds: readonly string[],
): Promise<SolutionMutationResult> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { ok: false, message: "인증이 필요합니다. 다시 로그인해 주세요." };
  }

  const results = await Promise.all(
    orderedIds.map((id, index) =>
      supabase
        .from("solution_slides")
        .update({ sort_order: index })
        .eq("id", id),
    ),
  );

  const failed = results.find((r) => r.error);
  if (failed) {
    return { ok: false, message: "순서 변경에 실패했습니다. 잠시 후 다시 시도해 주세요." };
  }

  revalidateTag(SOLUTION_TAG, "max");
  revalidatePath("/");

  return { ok: true };
}
