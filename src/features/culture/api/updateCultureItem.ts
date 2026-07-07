"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { createServerSupabaseClient } from "@/shared/api/supabaseServerClient";
import { cultureFormSchema } from "../model/schema";
import type { CultureMutationResult, UpdateCultureInput } from "../model/types";
import { CULTURE_TAG } from "./cultureTag";

/**
 * Culture 항목 수정 Server Action(id 기준).
 *
 * 인가: 세션 클라이언트 `getUser()`(미인증 거부). service_role 금지 — RLS `admin_update`.
 * 검증: zod 재파싱.
 * group/sort_order 는 수정 대상이 아니다(섹션 이동·재정렬 미지원) — 폼이 실어 보낸
 *   현재 sort_order 를 그대로 두고 title/description/label/image_url 만 갱신한다.
 * 무효화: 성공 시 태그 + 공개 경로 revalidate.
 */
export async function updateCultureItem(
  id: string,
  input: UpdateCultureInput,
): Promise<CultureMutationResult> {
  const parsed = cultureFormSchema.safeParse(input);
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
    .from("culture_items")
    .update({
      title: v.title,
      description: v.description,
      label: v.label ? v.label : null,
      image_url: v.imageUrl ? v.imageUrl : null,
    })
    .eq("id", id);

  if (error) {
    return {
      ok: false,
      message: "저장에 실패했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }

  revalidateTag(CULTURE_TAG, "max");
  revalidatePath("/support/culture");

  return { ok: true };
}
