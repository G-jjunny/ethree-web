import { createServerSupabaseClient } from "@/shared/api/supabaseServerClient";
import type { SolutionFormValues } from "../model/types";

/**
 * 관리자 수정 폼 초기값 getter(비활성 포함, id 기준).
 *
 * 로그인 세션 클라이언트 → RLS `admin_read`로 비활성 슬라이드까지 단건 조회.
 * 반환은 폼 값 형태(SolutionFormValues)로 매핑해 SolutionForm 프리필에 바로 사용한다
 * (null 컬럼은 빈 문자열로 폴백).
 *
 * fallback: 미존재/에러/미연결 시 null 반환 — 호출부(edit page)가 notFound() 처리.
 */

interface AdminDetailRow {
  title: string;
  title_accent: string;
  description: string;
  image_url: string | null;
  is_active: boolean;
}

export async function getAdminSolutionSlideById(
  id: string,
): Promise<SolutionFormValues | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("solution_slides")
      .select("title, title_accent, description, image_url, is_active")
      .eq("id", id)
      .single<AdminDetailRow>();

    if (error || !data) return null;

    return {
      title: data.title,
      titleAccent: data.title_accent,
      description: data.description,
      imageUrl: data.image_url ?? "",
      isActive: data.is_active,
    };
  } catch {
    return null;
  }
}
