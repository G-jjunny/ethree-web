import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_BASE_PATH } from "@/shared/constants";

/**
 * Next.js 16부터 `middleware` 파일 컨벤션은 deprecated되어 `proxy`로 대체되었다
 * (node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md).
 * 이 프로젝트는 `src/proxy.ts`(구 middleware.ts와 동일한 위치·실행 시점)를 사용한다.
 *
 * Proxy는 렌더링 컨텍스트 밖에서 실행되므로 `next/headers`의 `cookies()`를 쓸 수
 * 없다 — `shared/api/supabaseClient.ts`의 서버용 클라이언트를 재사용하지 않고,
 * NextRequest/NextResponse 쿠키 API로 직접 Supabase 클라이언트를 구성한다.
 */

const LOGIN_PATH = `${ADMIN_BASE_PATH}/login`;

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 로그인 페이지 자체는 보호하지 않는다.
  if (pathname === LOGIN_PATH) {
    return NextResponse.next();
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Supabase 키가 아직 연결되지 않은 상태 — fail-closed로 로그인 리다이렉트.
  // (키 연결 전 임시 상태. 키가 없으면 세션을 검증할 방법이 없으므로 항상 미인증으로 취급한다.)
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // getUser()는 매번 Auth 서버에 확인하는 검증된 사용자 정보를 반환한다.
  // getSession()은 쿠키만 읽어 위조 가능하므로 인가 판단에 쓰지 않는다.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  return response;
}

export const config = {
  // matcher는 빌드 타임에 정적으로 분석되어야 하므로 리터럴을 사용한다.
  // ADMIN_BASE_PATH("/console")가 바뀌면 이 값도 함께 수동 갱신해야 한다.
  matcher: ["/console/:path*"],
};
