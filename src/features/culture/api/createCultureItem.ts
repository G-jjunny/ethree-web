"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { createServerSupabaseClient } from "@/shared/api/supabaseServerClient";
import { cultureFormSchema } from "../model/schema";
import type { CreateCultureInput, CultureMutationResult } from "../model/types";
import { CULTURE_TAG } from "./cultureTag";

/**
 * Culture 항목 생성 Server Action.
 *
 * 인가: 세션 클라이언트로 `getUser()` 확인(미인증 거부). **service_role 금지** —
 *   RLS `admin_insert`가 authenticated 세션을 검증한다.
 * 검증: 클라 입력을 신뢰하지 않고 zod로 재파싱.
 * 정책: `welfare_intro`는 섹션 헤더 단건이므로 생성을 막고 수정만 허용한다(schema.md).
 * sort_order: 클라 값 대신 해당 group의 max(sort_order)+1로 재부여(unique 충돌 방지).
 * 무효화: 성공 시 태그 + 공개 경로 revalidate.
 */
export async function createCultureItem(
  input: CreateCultureInput,
): Promise<CultureMutationResult> {
  const parsed = cultureFormSchema.safeParse(input);
  if (!parsed.success) {
    const first =
      parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다.";
    return { ok: false, message: first };
  }

  const v = parsed.data;
  if (v.group === "welfare_intro") {
    return {
      ok: false,
      message: "복지 인트로는 단건 항목으로, 새로 추가할 수 없습니다.",
    };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { ok: false, message: "인증이 필요합니다. 다시 로그인해 주세요." };
  }

  // 해당 group의 최대 sort_order를 읽어 +1 로 부여(unique (group, sort_order) 충돌 방지).
  const { data: last } = await supabase
    .from("culture_items")
    .select("sort_order")
    .eq("group", v.group)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle<{ sort_order: number }>();

  const nextSortOrder = (last?.sort_order ?? 0) + 1;

  const { error } = await supabase.from("culture_items").insert({
    group: v.group,
    sort_order: nextSortOrder,
    title: v.title,
    description: v.description,
    label: v.label ? v.label : null,
    image_url: v.imageUrl ? v.imageUrl : null,
  });

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
