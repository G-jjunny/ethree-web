"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui";
import { ADMIN_BASE_PATH } from "@/shared/constants";
import { useLogoutMutation } from "../api/useLogoutMutation";

export interface LogoutButtonProps {
  /** 다크 상단바 외 배경에서 쓸 때 추가 클래스. */
  className?: string;
}

/**
 * 관리자 로그아웃 버튼. 클릭 시 세션을 종료하고 로그인 페이지로 이동한다.
 * 다크(ink) 상단바 위에서 쓰이므로 outline 변형을 기본으로 사용한다.
 */
export function LogoutButton({ className }: LogoutButtonProps) {
  const router = useRouter();
  const logoutMutation = useLogoutMutation();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        router.replace(`${ADMIN_BASE_PATH}/login`);
        router.refresh();
      },
    });
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleLogout}
      disabled={logoutMutation.isPending}
      className={className}
    >
      {logoutMutation.isPending ? "로그아웃 중..." : "로그아웃"}
    </Button>
  );
}
