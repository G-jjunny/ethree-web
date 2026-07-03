"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/shared/ui";
import { ADMIN_BASE_PATH } from "@/shared/constants";
import { useLoginMutation } from "../api/useLoginMutation";

export interface LoginFormProps {
  /** 로그인 성공 후 이동할 경로. 기본값은 관리자 대시보드. */
  redirectTo?: string;
}

/**
 * 관리자 로그인 폼. 이메일/비밀번호 입력 + 제출 버튼.
 * Supabase 키가 아직 연결되지 않은 상태라면 뮤테이션이 실패하며
 * 아래 에러 메시지 영역에 원인이 그대로 노출된다(키 연결 전 임시 동작).
 */
export function LoginForm({ redirectTo = ADMIN_BASE_PATH }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = useLoginMutation();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          router.replace(redirectTo);
          router.refresh();
        },
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm flex-col gap-5"
    >
      <div className="flex flex-col gap-2">
        <label
          htmlFor="admin-login-email"
          className="text-detail font-medium text-white/80"
        >
          이메일
        </label>
        <input
          id="admin-login-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded-card border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors duration-fast ease-out focus:border-brand"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="admin-login-password"
          className="text-detail font-medium text-white/80"
        >
          비밀번호
        </label>
        <input
          id="admin-login-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="rounded-card border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors duration-fast ease-out focus:border-brand"
        />
      </div>

      {loginMutation.isError && (
        <p className="text-detail text-danger">
          {loginMutation.error instanceof Error
            ? loginMutation.error.message
            : "로그인에 실패했습니다."}
        </p>
      )}

      <Button
        type="submit"
        variant="primary"
        size="md"
        disabled={loginMutation.isPending}
        className="mt-2 w-full"
      >
        {loginMutation.isPending ? "로그인 중..." : "로그인"}
      </Button>
    </form>
  );
}
