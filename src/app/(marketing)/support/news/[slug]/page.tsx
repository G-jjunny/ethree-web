import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionLabel } from "@/shared/ui";
import { buildMetadata, getNewsBySlug } from "@/shared/lib";

interface NewsDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: NewsDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const news = getNewsBySlug(slug);

  if (!news) {
    return buildMetadata({
      title: "NEWS",
      path: "/support/news",
      noIndex: true,
    });
  }

  return buildMetadata({
    title: news.title,
    description: news.title,
    path: `/support/news/${news.slug}`,
  });
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const news = getNewsBySlug(slug);

  if (!news) {
    notFound();
  }

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

        <div className="mx-auto mt-14 flex w-full max-w-2xl flex-col items-center gap-3 rounded-card border border-dashed border-hairline bg-surface-white px-8 py-14">
          <span className="text-detail font-medium text-ink-soft">
            콘텐츠 준비 중입니다.
          </span>
          <span className="text-meta text-muted">
            빠른 시일 내에 업데이트하겠습니다.
          </span>
        </div>
      </div>
    </section>
  );
}
