import { notFound } from "next/navigation";
import { SectionLabel } from "@/shared/ui";
import { buildMetadata } from "@/shared/lib";
import { getAdminSolutionSlideById, SolutionForm } from "@/features/solution";

export const metadata = buildMetadata({
  title: "솔루션 슬라이드 수정",
  description: "이쓰리 솔루션 캐러셀 슬라이드 수정",
  path: "/console/landing/solutions",
  noIndex: true,
});

interface ConsoleLandingSolutionsEditPageProps {
  params: Promise<{ id: string }>;
}

/**
 * 솔루션 슬라이드 수정 페이지(서버 컴포넌트).
 * id로 비활성 포함 단건을 조회해 SolutionForm을 update 모드로 프리필한다.
 * 없으면 notFound().
 */
export default async function ConsoleLandingSolutionsEditPage({
  params,
}: ConsoleLandingSolutionsEditPageProps) {
  const { id } = await params;
  const initialValues = await getAdminSolutionSlideById(id);

  if (!initialValues) {
    notFound();
  }

  return (
    <section className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <SectionLabel color="olive">Console</SectionLabel>
        <h1 className="font-display text-h2 font-extrabold text-ink">
          솔루션 슬라이드 수정
        </h1>
        <p className="text-body-sm text-ink-soft">
          제목·강조 텍스트·설명·이미지를 수정하고 노출 여부를 변경합니다.
        </p>
      </div>

      <div className="rounded-card border border-hairline bg-surface-white p-8">
        <SolutionForm mode="update" slideId={id} initialValues={initialValues} />
      </div>
    </section>
  );
}
