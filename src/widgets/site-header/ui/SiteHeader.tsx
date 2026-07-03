import Link from "next/link";
import { Button } from "@/shared/ui";
import { SITE, NAV_GROUPS } from "@/shared/constants";

/**
 * 히어로 위 오버레이 네비게이션.
 * 다크 투명 배경 위에 놓이므로 흰색 계열 텍스트를 사용한다.
 */
export function SiteHeader() {
  return (
    <header className="relative z-20 flex w-full items-center justify-between px-16 py-7">
      <Link href="/" className="flex items-baseline gap-2.5">
        <span className="font-display text-logo font-extrabold text-white">
          {SITE.nameEn}
        </span>
        <span className="text-eyebrow text-white/60">{SITE.name}</span>
      </Link>

      <nav className="flex items-center gap-11">
        {NAV_GROUPS.map((group) => (
          <Link
            key={group.href}
            href={group.href}
            className="text-sm font-medium text-white/80 transition-colors duration-fast ease-out hover:text-white"
          >
            {group.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-3.5">
        <a
          href={`tel:${SITE.contact.tel}`}
          className="text-eyebrow text-white/55"
        >
          {SITE.contact.tel}
        </a>
        <Button variant="primary" size="sm">
          문의하기
        </Button>
      </div>
    </header>
  );
}
