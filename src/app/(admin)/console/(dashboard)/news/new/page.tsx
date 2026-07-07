import { SectionLabel } from "@/shared/ui";
import { buildMetadata } from "@/shared/lib";
import { NewsForm } from "@/features/news";

export const metadata = buildMetadata({
  title: "새 NEWS 작성",
  description: "이쓰리 NEWS 새 글 작성",
  path: "/console/news/new",
  noIndex: true,
});

/**
 * NEWS 새 글 작성 페이지(서버 컴포넌트).
 * NewsForm을 create 모드로 렌더한다.
 */
export default function ConsoleNewsNewPage() {
  return (
    <section className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <SectionLabel color="olive">Console</SectionLabel>
        <h1 className="font-display text-h2 font-extrabold text-ink">
          새 NEWS 작성
        </h1>
        <p className="text-body-sm text-ink-soft">
          제목·슬러그·본문을 작성하고 발행 여부를 선택합니다.
        </p>
      </div>

      <div className="rounded-card border border-hairline bg-surface-white p-8">
        <NewsForm mode="create" />
      </div>
    </section>
  );
}
