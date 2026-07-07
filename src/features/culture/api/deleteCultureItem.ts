"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { createServerSupabaseClient } from "@/shared/api/supabaseServerClient";
import type { CultureGroup, CultureMutationResult } from "../model/types";
import { CULTURE_TAG } from "./cultureTag";

/**
 * Culture 항목 삭제 Server Action(id 기준).
 *
 * 인가: 세션 클라이언트 `getUser()`(미인증 거부). service_role 금지 — RLS `admin_delete`.
 * 정책: `welfare_intro`는 섹션 헤더 단건이므로 삭제를 막는다(createCultureItem 차단과 대칭).
 *   단건을 지우면 UI로 재생성할 수 없어(seed 재실행 외 복구 불가) 서버에서 막는 게 본질 방어.
 *   대상 group은 클라 입력을 신뢰하지 않고 id로 조회해 검증한다(시그니처 유지).
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

  // 삭제 전 대상 row의 group 확인 — welfare_intro 단건은 거부.
  const { data: target, error: fetchError } = await supabase
    .from("culture_items")
    .select("group")
    .eq("id", id)
    .maybeSingle<{ group: CultureGroup }>();

  if (fetchError) {
    return {
      ok: false,
      message: "삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }

  if (!target) {
    return { ok: false, message: "삭제할 항목을 찾을 수 없습니다." };
  }

  if (target.group === "welfare_intro") {
    return {
      ok: false,
      message: "복지 인트로는 단건 항목으로, 삭제할 수 없습니다.",
    };
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
