import { notFound } from "next/navigation";
import { SectionLabel } from "@/shared/ui";
import { buildMetadata } from "@/shared/lib";
import { getAdminNewsById, NewsForm } from "@/features/news";

export const metadata = buildMetadata({
  title: "NEWS 수정",
  description: "이쓰리 NEWS 글 수정",
  path: "/console/news",
  noIndex: true,
});

interface ConsoleNewsEditPageProps {
  params: Promise<{ id: string }>;
}

/**
 * NEWS 수정 페이지(서버 컴포넌트).
 * id로 초안 포함 단건을 조회해 NewsForm을 update 모드로 프리필한다.
 * 없으면 notFound().
 */
export default async function ConsoleNewsEditPage({
  params,
}: ConsoleNewsEditPageProps) {
  const { id } = await params;
  const initialValues = await getAdminNewsById(id);

  if (!initialValues) {
    notFound();
  }

  return (
    <section className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <SectionLabel color="olive">Console</SectionLabel>
        <h1 className="font-display text-h2 font-extrabold text-ink">
          NEWS 수정
        </h1>
        <p className="text-body-sm text-ink-soft">
          제목·슬러그·본문을 수정하고 발행 여부를 변경합니다.
        </p>
      </div>

      <div className="rounded-card border border-hairline bg-surface-white p-8">
        <NewsForm mode="update" newsId={id} initialValues={initialValues} />
      </div>
    </section>
  );
}
