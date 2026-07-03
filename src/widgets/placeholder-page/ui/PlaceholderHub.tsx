import Link from "next/link";
import { PlaceholderHeader } from "./PlaceholderHeader";

export interface PlaceholderHubLink {
  label: string;
  href: string;
}

export interface PlaceholderHubProps {
  /** 소형 라벨, 예: "ABOUT E3" */
  eyebrow: string;
  /** 허브 제목, 예: "About E3" */
  title: string;
  /** 선택. 제목 아래 리드 문구 */
  description?: string;
  /** 하위 서브페이지 링크 카드 목록 (NAV_GROUPS[n].children 대응) */
  links: readonly PlaceholderHubLink[];
}

/**
 * 허브 페이지(about/support) 공용 placeholder.
 * PlaceholderPage와 동일한 헤더 + 하위 링크 카드 그리드.
 * 상호작용은 Link뿐 — 서버 컴포넌트로 사용 가능.
 */
export function PlaceholderHub({
  eyebrow,
  title,
  description,
  links,
}: PlaceholderHubProps) {
  return (
    <section className="bg-surface py-25 lg:py-30">
      <div className="content-container">
        <PlaceholderHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
        />

        <div className="mt-14 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center justify-between rounded-card border border-hairline bg-surface-white px-8 py-7 text-item font-bold text-ink transition-colors duration-fast ease-out hover:border-olive-label hover:text-olive-label"
            >
              {link.label}
              <span aria-hidden className="text-olive-label">
                →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
