import Link from "next/link";

export interface PlaceholderSubNavItem {
  label: string;
  href: string;
}

export interface PlaceholderSubNavProps {
  /** 형제 페이지 목록 (2~3개 대응, 개수 가변) */
  siblings: readonly PlaceholderSubNavItem[];
  /** 현재 페이지 href — 일치 항목을 강조 표시. 미전달 시(허브 컨텍스트) 전부 비활성 스타일 */
  activeHref?: string;
}

/**
 * 형제 페이지 탭(링크 카드 그리드). 현재 페이지를 activeHref로 강조한다.
 * 각 섹션 leaf 페이지(예: /support/news 리스트 페이지)에서 헤더 아래에
 * 독립적으로 사용하도록 공개 API로 노출한다.
 * 상호작용은 Link뿐 — 서버 컴포넌트로 사용 가능.
 */
export function PlaceholderSubNav({
  siblings,
  activeHref,
}: PlaceholderSubNavProps) {
  return (
    <nav
      aria-label="하위 페이지 내비게이션"
      className="mt-14 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3"
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
                ? "flex items-center justify-between rounded-card border border-olive-label bg-surface-white px-8 py-7 text-item font-bold text-olive-label transition-colors duration-fast ease-out"
                : "flex items-center justify-between rounded-card border border-hairline bg-surface-white px-8 py-7 text-item font-bold text-ink transition-colors duration-fast ease-out hover:border-olive-label hover:text-olive-label"
            }
          >
            {item.label}
            <span aria-hidden className="text-olive-label">
              →
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
