import Link from "next/link";
import { SectionLabel } from "@/shared/ui";
import { buildMetadata, getNewsList } from "@/shared/lib";
import { PlaceholderSubNav } from "@/widgets/placeholder-page";
import { NAV_GROUPS } from "@/shared/constants";

export const metadata = buildMetadata({
  title: "NEWS",
  description: "이쓰리의 소식을 확인하세요.",
  path: "/support/news",
});

const group = NAV_GROUPS.find((g) => g.href === "/support")!;

export default function NewsListPage() {
  const newsList = getNewsList();

  return (
    <section className="bg-surface py-25 lg:py-30">
      <div className="content-container">
        <div className="flex flex-col items-center text-center">
          <SectionLabel color="olive">CUSTOMER SUPPORT</SectionLabel>
          <h1 className="font-display mt-4 text-h1 font-extrabold text-ink">
            NEWS
          </h1>
        </div>

        <PlaceholderSubNav siblings={group.children} activeHref="/support/news" />

        <ul className="mt-14 flex flex-col">
          {newsList.map((item, index) => (
            <li
              key={item.id}
              className={`border-t border-hairline ${
                index === newsList.length - 1 ? "border-b" : ""
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
