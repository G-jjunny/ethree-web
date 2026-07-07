import Link from "next/link";
import Image from "next/image";
import type { NewsItem } from "@/features/news";

export interface SupportNewsListProps {
  items: readonly NewsItem[];
}

/**
 * 공개 News 리스트(카드 그리드) — 서버 컴포넌트, 데이터 배선 담당.
 * 커버 썸네일·제목·발췌·날짜를 카드로 배치한다. 빈 목록 시 안전한 빈 상태를 렌더한다.
 * 마크업 톤은 design(polish)이 후속으로 다듬는다(여기서는 구조·배선만).
 */
export function SupportNewsList({ items }: SupportNewsListProps) {
  if (items.length === 0) {
    return (
      <div className="mx-auto mt-14 flex w-full max-w-2xl flex-col items-center gap-3 rounded-card border border-dashed border-hairline bg-surface-white px-8 py-14 text-center">
        <span className="text-detail font-medium text-ink-soft">
          등록된 소식이 없습니다.
        </span>
        <span className="text-meta text-muted">
          새로운 소식을 준비 중입니다.
        </span>
      </div>
    );
  }

  return (
    <ul className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li key={item.id}>
          <Link
            href={`/support/news/${item.slug}`}
            className="group flex h-full flex-col overflow-hidden rounded-card border border-hairline bg-surface-white transition-colors duration-fast ease-out hover:border-brand"
          >
            <div className="relative aspect-video w-full overflow-hidden bg-tint">
              {item.coverImageUrl ? (
                <Image
                  src={item.coverImageUrl}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div
                  aria-hidden
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <span className="font-display text-h3 font-extrabold tracking-headline text-olive-muted">
                    E3
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-3 p-6">
              <span className="font-display text-meta text-muted">
                {item.date}
              </span>
              <h2 className="text-list font-medium text-ink transition-colors duration-fast ease-out group-hover:text-olive-label">
                {item.title}
              </h2>
              {item.excerpt ? (
                <p className="line-clamp-2 text-detail text-ink-soft">
                  {item.excerpt}
                </p>
              ) : null}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
