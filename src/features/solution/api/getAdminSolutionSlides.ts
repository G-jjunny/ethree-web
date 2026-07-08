import { createServerSupabaseClient } from "@/shared/api/supabaseServerClient";
import type { SolutionAdminItem, SolutionRow } from "../model/types";

/**
 * 관리자 콘솔 Solution 목록 getter(비활성 포함 전체).
 *
 * 공개 getter와 달리 로그인 세션 클라이언트를 쓴다 → RLS `admin_read`로
 * authenticated 롤이 비활성 슬라이드까지 전체 조회한다. 관리 목록은 항상 최신을
 * 보여야 하므로 unstable_cache로 감싸지 않는다(요청마다 조회).
 *
 * fallback: 에러/미연결 시 빈 배열 반환(관리 화면이 깨지지 않도록).
 */
export async function getAdminSolutionSlides(): Promise<SolutionAdminItem[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("solution_slides")
      .select(
        "id, sort_order, title, title_accent, description, image_url, is_active",
      )
      .order("sort_order", { ascending: true })
      .returns<SolutionRow[]>();

    if (error || !data) return [];

    return data.map((row) => ({
      id: row.id,
      title: row.title,
      titleAccent: row.title_accent,
      description: row.description,
      imageUrl: row.image_url,
      sortOrder: row.sort_order,
      isActive: row.is_active,
    }));
  } catch {
    return [];
  }
}
