import { buildMetadata } from "@/shared/lib";

export const metadata = buildMetadata({
  title: "관리자 대시보드",
  description: "이쓰리 관리자 대시보드",
  path: "/console",
  noIndex: true,
});

export default function AdminDashboardPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-surface px-6 py-16 text-center">
      <h1 className="font-display text-h1 font-extrabold text-ink">
        관리자 대시보드
      </h1>
      <p className="text-body-sm text-ink-soft">준비 중입니다.</p>
    </main>
  );
}
