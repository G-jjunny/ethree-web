"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { createServerSupabaseClient } from "@/shared/api/supabaseServerClient";
import type { NewsMutationResult } from "../model/types";
import { NEWS_TAG } from "./newsTag";

/**
 * News 삭제 Server Action(id 기준).
 *
 * 인가: 세션 클라이언트 `getUser()`(미인증 거부). service_role 금지 — RLS `admin_delete`.
 * 무효화: 태그 + 목록/구 상세 경로 revalidate.
 */
export async function deleteNews(id: string): Promise<NewsMutationResult> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { ok: false, message: "인증이 필요합니다. 다시 로그인해 주세요." };
  }

  // 상세 경로 무효화를 위해 slug를 먼저 조회한다.
  const { data: current } = await supabase
    .from("news")
    .select("slug")
    .eq("id", id)
    .single<{ slug: string }>();

  const { error } = await supabase.from("news").delete().eq("id", id);

  if (error) {
    return { ok: false, message: "삭제에 실패했습니다. 잠시 후 다시 시도해 주세요." };
  }

  revalidateTag(NEWS_TAG, "max");
  revalidatePath("/support/news");
  if (current?.slug) {
    revalidatePath(`/support/news/${current.slug}`);
  }

  return { ok: true };
}
