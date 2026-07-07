import { createServerSupabaseClient } from "@/shared/api/supabaseServerClient";
import type { NewsAdminItem } from "../model";

/**
 * 관리자 콘솔 News 목록 getter(초안 포함 전체).
 *
 * 공개 getter와 달리 로그인 세션 클라이언트를 쓴다 → RLS `admin_read`로
 * authenticated 롤이 published=false 초안까지 전체 조회한다. 관리 목록은 항상 최신을
 * 보여야 하므로 unstable_cache로 감싸지 않는다(요청마다 조회).
 *
 * fallback: 에러/미연결 시 빈 배열 반환(관리 화면이 깨지지 않도록).
 */

interface AdminListRow {
  id: string;
  slug: string;
  title: string;
  published: boolean;
  published_at: string | null;
  created_at: string;
}

function deriveDate(publishedAt: string | null, createdAt: string): string {
  return (publishedAt ?? createdAt).slice(0, 10);
}

export async function getAdminNewsList(): Promise<NewsAdminItem[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("news")
      .select("id, slug, title, published, published_at, created_at")
      .order("created_at", { ascending: false })
      .returns<AdminListRow[]>();

    if (error || !data) return [];

    return data.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      date: deriveDate(row.published_at, row.created_at),
      published: row.published,
    }));
  } catch {
    return [];
  }
}
