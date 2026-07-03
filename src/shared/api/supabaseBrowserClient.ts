import { createBrowserClient } from "@supabase/ssr";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * 브라우저(클라이언트 컴포넌트)에서 사용하는 Supabase 클라이언트.
 * 쿠키 저장은 @supabase/ssr이 자동으로 처리한다.
 *
 * 주의: 이 파일은 `next/headers`를 import하지 않는다 — "use client" 컴포넌트에서
 * 안전하게 번들링되도록 서버 전용 클라이언트(`supabaseServerClient.ts`)와 분리했다.
 */
export function createBrowserSupabaseClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
