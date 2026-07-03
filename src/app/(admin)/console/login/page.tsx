import { LoginForm } from "@/features/admin-login";
import { buildMetadata } from "@/shared/lib";
import { SITE } from "@/shared/constants";

export const metadata = buildMetadata({
  title: "관리자 로그인",
  description: `${SITE.name} 관리자 로그인`,
  path: "/console/login",
  noIndex: true,
});

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-6 py-16">
      <div className="flex w-full max-w-sm flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="font-display text-logo font-extrabold text-white">
            {SITE.nameEn}
          </span>
          <p className="text-detail text-white/60">관리자 로그인</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
