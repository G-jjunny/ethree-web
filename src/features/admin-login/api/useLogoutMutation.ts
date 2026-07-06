import { useMutation } from "@tanstack/react-query";
// 주의: "@/shared/api" 배럴(index.ts)은 next/headers를 쓰는
// supabaseServerClient도 함께 re-export한다. 클라이언트 컴포넌트에서 소비되는
// 이 훅에서 배럴을 import하면 번들러가 서버 전용 모듈까지 클라이언트 번들
// 그래프에 포함시켜 빌드가 실패한다 — 반드시 각 파일에서 직접 import한다.
import { ApiError } from "@/shared/api/ApiError";
import { createBrowserSupabaseClient } from "@/shared/api/supabaseBrowserClient";

/**
 * 관리자 로그아웃 뮤테이션. 현재 Supabase Auth 세션을 종료한다.
 * 성공 후 로그인 페이지 리다이렉트는 호출 측(LogoutButton)에서 처리한다.
 */
export function useLogoutMutation() {
  return useMutation({
    mutationFn: async () => {
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.auth.signOut();

      if (error) throw new ApiError(error);
    },
  });
}
