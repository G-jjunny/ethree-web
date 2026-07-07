import { SectionLabel } from "@/shared/ui";
import { buildMetadata } from "@/shared/lib";
import { getNewsList } from "@/features/news";
import { SupportNewsList } from "@/views/support-news";
import { PlaceholderSubNav } from "@/widgets/placeholder-page";
import { NAV_GROUPS } from "@/shared/constants";

export const metadata = buildMetadata({
  title: "NEWS",
  description: "이쓰리의 소식을 확인하세요.",
  path: "/support/news",
});

const group = NAV_GROUPS.find((g) => g.href === "/support")!;

export default async function NewsListPage() {
  const newsList = await getNewsList();

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

        <SupportNewsList items={newsList} />
      </div>
    </section>
  );
}
