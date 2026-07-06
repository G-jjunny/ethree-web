import Link from "next/link";
import type { ReactNode } from "react";
import { LogoutButton } from "@/features/admin-login";
import { SITE, ADMIN_BASE_PATH } from "@/shared/constants";

/**
 * 관리자 대시보드 크롬(상단바 + 섹션 내비).
 * 이 레이아웃은 `console/(dashboard)` route group에만 적용되므로
 * 로그인 페이지(`/console/login`, 그룹 밖)에는 크롬이 붙지 않는다.
 * route group은 URL에 영향을 주지 않아 `/console`, `/console/company` 경로는 유지된다.
 * 서버 컴포넌트로 두고 로그아웃 버튼(클라이언트)만 경계로 삽입한다.
 */
interface ConsoleDashboardLayoutProps {
  children: ReactNode;
}

const CONSOLE_NAV = [
  { label: "대시보드", href: ADMIN_BASE_PATH },
  { label: "회사 정보", href: `${ADMIN_BASE_PATH}/company` },
] as const;

export default function ConsoleDashboardLayout({
  children,
}: ConsoleDashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="bg-ink">
        <div className="content-container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <span className="font-display text-logo font-extrabold text-white">
              {SITE.nameEn}
            </span>
            <span aria-hidden className="h-4 w-px bg-white/20" />
            <span className="text-detail text-white/60">관리자</span>
          </div>
          <LogoutButton />
        </div>
        <nav className="border-t border-white/12">
          <div className="content-container flex gap-6 py-2">
            {CONSOLE_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex items-center py-1 text-sm font-medium text-white/70 transition-colors duration-fast ease-out hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      <main className="content-container flex-1 py-12">{children}</main>
    </div>
  );
}
