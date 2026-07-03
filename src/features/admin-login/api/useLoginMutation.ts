import { useMutation } from "@tanstack/react-query";
// 주의: "@/shared/api" 배럴(index.ts)은 next/headers를 쓰는
// supabaseServerClient도 함께 re-export한다. 클라이언트 컴포넌트에서 소비되는
// 이 훅에서 배럴을 import하면 번들러가 서버 전용 모듈까지 클라이언트 번들
// 그래프에 포함시켜 빌드가 실패한다 — 반드시 각 파일에서 직접 import한다.
import { ApiError } from "@/shared/api/ApiError";
import { createBrowserSupabaseClient } from "@/shared/api/supabaseBrowserClient";

export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * 관리자 로그인 뮤테이션. Supabase Auth 이메일/패스워드 로그인만 사용하며
 * 회원가입 플로우는 없다(계정은 Supabase 대시보드에서 수동 생성).
 */
export function useLoginMutation() {
  return useMutation({
    mutationFn: async ({ email, password }: LoginCredentials) => {
      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw new ApiError(error);

      return data;
    },
  });
}
