"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { createServerSupabaseClient } from "@/shared/api/supabaseServerClient";
import { newsFormSchema } from "../model/schema";
import type { NewsMutationResult, UpdateNewsInput } from "../model/types";
import { NEWS_TAG } from "./newsTag";

/**
 * News 수정 Server Action(id 기준).
 *
 * 인가: 세션 클라이언트 `getUser()`(미인증 거부). service_role 금지 — RLS `admin_update`.
 * 검증: zod 재파싱.
 * published_at 규칙(schema.md):
 *   - 발행 중이고 기존 published_at이 없으면 now()로 세팅(최초 발행 시각 확정).
 *   - 이미 값이 있으면 유지(최초 발행 시각 보존).
 *   - 미발행 전환 시 published_at은 건드리지 않는다(재발행 시 원 발행일 유지).
 * 무효화: 태그 + 구/신 slug 상세 경로 + 목록 경로 revalidate.
 */
export async function updateNews(
  id: string,
  input: UpdateNewsInput,
): Promise<NewsMutationResult> {
  const parsed = newsFormSchema.safeParse(input);
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

  // 최초 발행 시각 결정을 위해 현재 published_at/slug을 읽는다.
  const { data: current } = await supabase
    .from("news")
    .select("slug, published_at")
    .eq("id", id)
    .single<{ slug: string; published_at: string | null }>();

  const nextPublishedAt = v.published
    ? (current?.published_at ?? new Date().toISOString())
    : (current?.published_at ?? null);

  const { error } = await supabase
    .from("news")
    .update({
      slug: v.slug,
      title: v.title,
      excerpt: v.excerpt ? v.excerpt : null,
      cover_image_url: v.coverImageUrl ? v.coverImageUrl : null,
      body: v.body,
      published: v.published,
      published_at: nextPublishedAt,
    })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { ok: false, message: "이미 사용 중인 슬러그입니다." };
    }
    return { ok: false, message: "저장에 실패했습니다. 잠시 후 다시 시도해 주세요." };
  }

  revalidateTag(NEWS_TAG, "max");
  revalidatePath("/support/news");
  revalidatePath(`/support/news/${v.slug}`);
  if (current && current.slug !== v.slug) {
    // slug 변경 시 구 경로 캐시도 무효화.
    revalidatePath(`/support/news/${current.slug}`);
  }

  return { ok: true };
}
