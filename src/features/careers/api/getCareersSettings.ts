import { createServerSupabaseClient } from "@/shared/api/supabaseServerClient";
import type { CareersSettings, CareersSettingsRow } from "../model";

/**
 * 관리자 콘솔이 소비하는 수신 이메일 설정 서버 getter.
 *
 * 인가: `createServerSupabaseClient()`(쿠키 기반 authenticated 세션)로 읽는다.
 *   RLS `admin_read`(authenticated SELECT) 정책이 커버한다. 이 값은 관리자만
 *   보는 데이터이므로 anon/캐시(unstable_cache) 경로가 아니라 세션 조회다 —
 *   요청마다 세션 컨텍스트로 읽는다(company-info getter 의 anon+cache 패턴과 다름).
 *
 * fallback: 테이블 미존재(마이그레이션 미실행)/키 미연결/쿼리 에러/행 없음 시
 *   예외를 던지지 않고 기본 settings 를 반환한다 — 빌드/렌더가 항상 정상.
 */

const DEFAULT_SETTINGS: CareersSettings = {
  recipientEmail: "",
  fromEmail: null,
  updatedAt: "",
};

function mapRowToSettings(row: CareersSettingsRow): CareersSettings {
  return {
    recipientEmail: row.recipient_email,
    fromEmail: row.from_email,
    updatedAt: row.updated_at,
  };
}

export async function getCareersSettings(): Promise<CareersSettings> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("careers_settings")
      .select("id, recipient_email, from_email, updated_at")
      .eq("id", 1)
      .single<CareersSettingsRow>();

    if (error || !data) return DEFAULT_SETTINGS;

    return mapRowToSettings(data);
  } catch {
    return DEFAULT_SETTINGS;
  }
}
