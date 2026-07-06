import Link from "next/link";
import { SectionLabel } from "@/shared/ui";
import { buildMetadata } from "@/shared/lib";
import { ADMIN_BASE_PATH } from "@/shared/constants";

export const metadata = buildMetadata({
  title: "관리자 대시보드",
  description: "이쓰리 관리자 대시보드",
  path: "/console",
  noIndex: true,
});

/**
 * 대시보드 홈 — 관리 항목 진입 카드 그리드.
 * 향후 서비스/실적 관리 카드가 추가되므로 배열 기반 확장 구조로 둔다.
 */
interface ManageItem {
  title: string;
  description: string;
  href: string;
}

const MANAGE_ITEMS: readonly ManageItem[] = [
  {
    title: "회사 정보 관리",
    description: "회사 메타정보(주소·연락처·소개)를 수정합니다.",
    href: `${ADMIN_BASE_PATH}/company`,
  },
] as const;

export default function AdminDashboardPage() {
  return (
    <section className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <SectionLabel color="olive">Console</SectionLabel>
        <h1 className="font-display text-h2 font-extrabold text-ink">
          대시보드
        </h1>
        <p className="text-body-sm text-ink-soft">
          관리할 항목을 선택하세요.
        </p>
      </div>

      <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {MANAGE_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex flex-col gap-3 rounded-card border border-hairline bg-surface-white p-6 transition-colors duration-fast ease-out hover:border-ink"
          >
            <h2 className="text-xl font-bold text-ink transition-colors duration-fast ease-out group-hover:text-olive-label">
              {item.title}
            </h2>
            <p className="text-detail text-ink-soft">{item.description}</p>
            <span
              aria-hidden
              className="mt-1 text-xl text-olive-muted transition-all duration-fast ease-out group-hover:translate-x-1 group-hover:text-ink"
            >
              →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
