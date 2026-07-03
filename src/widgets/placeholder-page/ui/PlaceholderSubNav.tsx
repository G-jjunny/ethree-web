import Link from "next/link";

export interface PlaceholderSubNavItem {
  label: string;
  href: string;
}

export interface PlaceholderSubNavProps {
  /** 형제 페이지 목록 (2~3개 대응, 개수 가변) */
  siblings: readonly PlaceholderSubNavItem[];
  /** 현재 페이지 href — 일치 항목을 강조 표시 */
  activeHref?: string;
}

/**
 * 형제 leaf 페이지 간 이동 탭. `PlaceholderPage` 내부에서 기본 사용되며,
 * `PlaceholderPage` 구조에 맞지 않는 커스텀 마크업 페이지(예: /support/news
 * 리스트 페이지)에서도 독립적으로 사용할 수 있도록 공개 API로 노출한다.
 * 상호작용은 Link뿐 — 서버 컴포넌트로 사용 가능.
 */
export function PlaceholderSubNav({
  siblings,
  activeHref,
}: PlaceholderSubNavProps) {
  return (
    <nav
      aria-label="하위 페이지 내비게이션"
      className="mt-8 flex flex-wrap items-center justify-center gap-2 rounded-pill border border-hairline bg-surface-white p-1.5"
    >
      {siblings.map((item) => {
        const isActive = item.href === activeHref;

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={
              isActive
                ? "rounded-pill bg-ink px-5 py-2 font-display text-sm font-bold text-white"
                : "rounded-pill px-5 py-2 font-display text-sm font-bold text-ink-soft transition-colors duration-fast ease-out hover:text-olive-label"
            }
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
