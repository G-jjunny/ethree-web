// 서버 전용 · next/headers 미사용 · 클라 번들 유입 금지 · service_role 키 노출 절대 금지
//
// 이 모듈은 Supabase service_role 키로 RLS 를 우회하는 서버 전용 클라이언트를 만든다.
// Route Handler(`app/api/*`) 등 서버 코드에서만 import 한다. "use client" 컴포넌트나
// 그 하위에서 절대 참조하지 말 것 — service_role 키가 클라이언트 번들에 유입되면
// DB 전 권한이 노출된다. 이 파일은 shared/api 배럴(index.ts)에서 re-export 하지 않아
// (배럴은 클라 컴포넌트가 소비할 수 있으므로) 유출 표면을 원천 차단한다.
//
// cookies/세션을 쓰지 않으므로 `@supabase/supabase-js`의 순수 createClient 를 사용한다.

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

/**
 * service_role 키로 RLS 를 우회하는 서버 전용 Supabase 클라이언트.
 *
 * 용도: Route Handler(`/api/careers`)가 anon SELECT 가 막힌 `careers_settings`
 *   (수신 주소)를 읽고, `careers_submissions` 에 INSERT 할 때 사용한다.
 *
 * 주의: 키가 비어 있어도(미연결 환경) createClient 자체는 예외를 던지지 않는다 —
 *   실제 쿼리 시점에 에러가 반환되므로 호출부에서 graceful 하게 처리한다.
 *   세션 자동 갱신/저장을 끈다(서버 전용, 요청마다 1회성).
 */
export function createServiceRoleClient() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
