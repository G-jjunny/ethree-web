"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { createServerSupabaseClient } from "@/shared/api/supabaseServerClient";
import { solutionFormSchema } from "../model/schema";
import type {
  CreateSolutionInput,
  SolutionMutationResult,
} from "../model/types";
import { SOLUTION_TAG } from "./solutionTag";

/**
 * Solution 슬라이드 생성 Server Action.
 *
 * 인가: 세션 클라이언트로 `getUser()` 확인(미인증 거부). service_role 금지 —
 *   RLS `admin_insert`가 authenticated 세션을 검증한다.
 * 검증: 클라 입력을 신뢰하지 않고 zod로 재파싱.
 * sort_order: 현재 최대값 + 1(목록 맨 뒤에 추가). 순서 변경은 reorderSolutionSlides가 담당.
 * 무효화: 성공 시 태그 + 랜딩 경로 revalidate.
 */
export async function createSolutionSlide(
  input: CreateSolutionInput,
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

  const { data: last } = await supabase
    .from("solution_slides")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle<{ sort_order: number }>();

  const nextSortOrder = (last?.sort_order ?? -1) + 1;

  const v = parsed.data;
  const { error } = await supabase.from("solution_slides").insert({
    sort_order: nextSortOrder,
    title: v.title,
    title_accent: v.titleAccent,
    description: v.description,
    image_url: v.imageUrl ? v.imageUrl : null,
    is_active: v.isActive,
  });

  if (error) {
    return { ok: false, message: "저장에 실패했습니다. 잠시 후 다시 시도해 주세요." };
  }

  revalidateTag(SOLUTION_TAG, "max");
  revalidatePath("/");

  return { ok: true };
}
