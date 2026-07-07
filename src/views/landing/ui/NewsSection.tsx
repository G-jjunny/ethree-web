import Link from "next/link";
import { SectionLabel } from "@/shared/ui";
import { getNewsList } from "@/features/news";

/**
 * NEWS 데이터는 features/news(getNewsList) 서버 getter가 단일 소스다.
 * Supabase에서 published=true만 조회하며, 미연결/빈 DB 시 빈 배열 fallback.
 */
export async function NewsSection() {
  const newsItems = await getNewsList();

  return (
    <section className="bg-surface pt-16 lg:pt-25">
      <div className="content-container">
        <div className="mb-11 flex flex-wrap items-end justify-between gap-10">
          <SectionLabel color="olive">NEWS</SectionLabel>
          <Link
            href="/support/news"
            className="text-eyebrow font-bold text-ink"
          >
            전체보기 →
          </Link>
        </div>

        <ul className="flex flex-col">
          {newsItems.map((item, index) => (
            <li
              key={item.id}
              className={`border-t border-hairline ${
                index === newsItems.length - 1 ? "border-b" : ""
              }`}
            >
              <Link
                href={`/support/news/${item.slug}`}
                className="flex items-baseline justify-between py-5.5 transition-colors duration-fast ease-out hover:text-olive-label"
              >
                <span className="text-list font-medium text-ink">
                  {item.title}
                </span>
                <span className="text-meta ml-8 flex-none text-muted">
                  {item.date}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
