"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { createServerSupabaseClient } from "@/shared/api/supabaseServerClient";
import { newsFormSchema } from "../model/schema";
import type { CreateNewsInput, NewsMutationResult } from "../model/types";
import { NEWS_TAG } from "./newsTag";

/**
 * News 생성 Server Action.
 *
 * 인가: 세션 클라이언트로 `getUser()` 확인(미인증 거부). **service_role 금지** —
 *   RLS `admin_insert`가 authenticated 세션을 검증한다.
 * 검증: 클라 입력을 신뢰하지 않고 zod로 재파싱.
 * published_at: 발행(published=true)인데 값이 없으면 now()로 세팅(schema.md 규칙).
 * 무효화: 성공 시 태그 + 목록/상세 경로 revalidate.
 */
export async function createNews(
  input: CreateNewsInput,
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
  const { error } = await supabase.from("news").insert({
    slug: v.slug,
    title: v.title,
    excerpt: v.excerpt ? v.excerpt : null,
    cover_image_url: v.coverImageUrl ? v.coverImageUrl : null,
    body: v.body,
    published: v.published,
    published_at: v.published ? new Date().toISOString() : null,
  });

  if (error) {
    if (error.code === "23505") {
      return { ok: false, message: "이미 사용 중인 슬러그입니다." };
    }
    return { ok: false, message: "저장에 실패했습니다. 잠시 후 다시 시도해 주세요." };
  }

  revalidateTag(NEWS_TAG, "max");
  revalidatePath("/support/news");
  revalidatePath(`/support/news/${v.slug}`);

  return { ok: true };
}
