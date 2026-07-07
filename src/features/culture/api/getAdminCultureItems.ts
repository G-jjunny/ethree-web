import { createServerSupabaseClient } from "@/shared/api/supabaseServerClient";
import type { CultureItem, CultureItemRow } from "../model";

/**
 * 관리자 콘솔 Culture 항목 getter(전량, group·sort_order 정렬).
 *
 * 공개 getter와 달리 로그인 세션 클라이언트를 쓴다 → RLS `public_read`로 전량 조회.
 * 관리 화면은 항상 최신을 보여야 하므로 unstable_cache로 감싸지 않는다(요청마다 조회).
 *
 * fallback: 에러/미연결/미시드 시 빈 배열 반환(관리 화면이 깨지지 않도록 —
 *   공개 페이지와 달리 관리 화면은 실제 DB 상태를 보여야 하므로 정적값을 넣지 않는다).
 */
export async function getAdminCultureItems(): Promise<CultureItem[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("culture_items")
      .select("id, group, sort_order, title, description, label, image_url")
      .order("group", { ascending: true })
      .order("sort_order", { ascending: true })
      .returns<CultureItemRow[]>();

    if (error || !data) return [];

    return data.map((row) => ({
      id: row.id,
      group: row.group,
      sortOrder: row.sort_order,
      title: row.title,
      description: row.description,
      label: row.label,
      imageUrl: row.image_url,
    }));
  } catch {
    return [];
  }
}
