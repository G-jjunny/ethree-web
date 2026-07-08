"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { createServerSupabaseClient } from "@/shared/api/supabaseServerClient";
import { solutionFormSchema } from "../model/schema";
import type {
  SolutionMutationResult,
  UpdateSolutionInput,
} from "../model/types";
import { SOLUTION_TAG } from "./solutionTag";

/**
 * Solution 슬라이드 수정 Server Action(id 기준).
 *
 * 인가: 세션 클라이언트 `getUser()`(미인증 거부). service_role 금지 — RLS `admin_update`.
 * 검증: zod 재파싱. sort_order는 건드리지 않는다(reorderSolutionSlides 전담).
 * 무효화: 태그 + 랜딩 경로 revalidate.
 */
export async function updateSolutionSlide(
  id: string,
  input: UpdateSolutionInput,
): Promise<SolutionMutationResult> {
  const parsed = solutionFormSchema.safeParse(input);
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
  const { error } = await supabase
    .from("solution_slides")
    .update({
      title: v.title,
      title_accent: v.titleAccent,
      description: v.description,
      image_url: v.imageUrl ? v.imageUrl : null,
      is_active: v.isActive,
    })
    .eq("id", id);

  if (error) {
    return { ok: false, message: "저장에 실패했습니다. 잠시 후 다시 시도해 주세요." };
  }

  revalidateTag(SOLUTION_TAG, "max");
  revalidatePath("/");

  return { ok: true };
}
