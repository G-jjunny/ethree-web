import { createServerSupabaseClient } from "@/shared/api/supabaseServerClient";
import type { NewsFormValues } from "../model";
import { EMPTY_DOC } from "../model";

/**
 * 관리자 수정 폼 초기값 getter(초안 포함, id 기준). body 포함.
 *
 * 로그인 세션 클라이언트 → RLS `admin_read`로 초안까지 단건 조회.
 * 반환은 폼 값 형태(NewsFormValues)로 매핑해 NewsForm 프리필에 바로 사용한다
 * (null 컬럼은 빈 문자열/빈 doc로 폴백).
 *
 * fallback: 미존재/에러/미연결 시 null 반환 — 호출부(edit page)가 notFound() 처리.
 */

interface AdminDetailRow {
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  body: NewsFormValues["body"];
  published: boolean;
}

export async function getAdminNewsById(
  id: string,
): Promise<NewsFormValues | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("news")
      .select("slug, title, excerpt, cover_image_url, body, published")
      .eq("id", id)
      .single<AdminDetailRow>();

    if (error || !data) return null;

    return {
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt ?? "",
      coverImageUrl: data.cover_image_url ?? "",
      body: data.body ?? EMPTY_DOC,
      published: data.published,
    };
  } catch {
    return null;
  }
}
