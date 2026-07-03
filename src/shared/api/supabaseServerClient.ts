import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * 서버 컴포넌트 / Route Handler / Server Action에서 사용하는 Supabase 클라이언트.
 * Next.js `cookies()`(비동기) 기반이다.
 *
 * 주의: `next/headers`를 import하므로 클라이언트 번들에 절대 포함되면 안 된다.
 * "use client" 컴포넌트나 그 하위에서 import하는 파일은 이 모듈을 참조하지 말 것 —
 * 브라우저용은 `supabaseBrowserClient.ts`의 `createBrowserSupabaseClient`를 쓴다.
 *
 * Proxy(`src/proxy.ts`, 구 middleware)는 렌더링 컨텍스트 밖에서 실행되어
 * `next/headers`의 `cookies()`를 사용할 수 없다 — Proxy는 NextRequest/NextResponse
 * 쿠키 API로 직접 Supabase 클라이언트를 구성한다(이 함수를 재사용하지 않음).
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Component 렌더링 중 호출되면 쿠키를 쓸 수 없다(읽기 전용 컨텍스트).
          // 세션 갱신은 Proxy(src/proxy.ts)가 매 요청마다 처리하므로 무시해도 안전하다.
        }
      },
    },
  });
}
