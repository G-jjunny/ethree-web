import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionLabel } from "@/shared/ui";
import { buildMetadata } from "@/shared/lib";
import { getNewsBySlug, renderNewsBody } from "@/features/news";
import { SupportNewsBody } from "@/views/support-news";

interface NewsDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: NewsDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);

  if (!news) {
    return buildMetadata({
      title: "NEWS",
      path: "/support/news",
      noIndex: true,
    });
  }

  return buildMetadata({
    title: news.title,
    description: news.excerpt ?? news.title,
    path: `/support/news/${news.slug}`,
  });
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);

  if (!news) {
    notFound();
  }

  // 본문은 서버에서 generateHTML → DOMPurify 새니타이즈(XSS 방지) 후 렌더.
  const bodyHtml = renderNewsBody(news.body);

  return (
    <section className="bg-surface py-25 lg:py-30">
      <div className="content-container">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <SectionLabel color="olive">NEWS</SectionLabel>
          <h1 className="font-display mt-4 text-h1 font-extrabold text-ink">
            {news.title}
          </h1>
          <span className="text-meta mt-4 text-muted">{news.date}</span>
        </div>

        <SupportNewsBody html={bodyHtml} />
      </div>
    </section>
  );
}
