import { createServerSupabaseClient } from "@/shared/api/supabaseServerClient";
import type { CareersSubmission, CareersSubmissionRow } from "../model";

/**
 * 관리자 콘솔이 소비하는 제출 내역 목록 서버 getter.
 *
 * 인가: `createServerSupabaseClient()`(authenticated 세션)로 조회한다. RLS
 *   `admin_read`(authenticated SELECT) 정책이 커버하며, 추가로 `getUser()`로
 *   인가를 재확인해 세션 없는 접근이면 빈 배열을 반환한다(방어적 이중 확인).
 *
 * 정렬: `created_at desc`(인덱스 `idx_careers_submissions_created_at`) — 최신순.
 *
 * fallback: 테이블 미존재/미연결/에러/미인증 시 예외 없이 빈 배열 `[]` 반환 —
 *   관리자 페이지는 "제출 없음" 상태로 정상 렌더된다.
 */

function mapRowToSubmission(row: CareersSubmissionRow): CareersSubmission {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    message: row.message,
    emailSent: row.email_sent,
    createdAt: row.created_at,
  };
}

export async function getAdminSubmissions(): Promise<CareersSubmission[]> {
  try {
    const supabase = await createServerSupabaseClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) return [];

    const { data, error } = await supabase
      .from("careers_submissions")
      .select("id, name, email, message, email_sent, created_at")
      .order("created_at", { ascending: false })
      .returns<CareersSubmissionRow[]>();

    if (error || !data) return [];

    return data.map(mapRowToSubmission);
  } catch {
    return [];
  }
}
