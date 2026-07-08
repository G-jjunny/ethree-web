import { SectionLabel } from "@/shared/ui";
import { buildMetadata } from "@/shared/lib";
import { SolutionForm } from "@/features/solution";

export const metadata = buildMetadata({
  title: "새 솔루션 슬라이드 등록",
  description: "이쓰리 솔루션 캐러셀 새 슬라이드 등록",
  path: "/console/landing/solutions/new",
  noIndex: true,
});

/**
 * 솔루션 슬라이드 새 등록 페이지(서버 컴포넌트).
 * SolutionForm을 create 모드로 렌더한다.
 */
export default function ConsoleLandingSolutionsNewPage() {
  return (
    <section className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <SectionLabel color="olive">Console</SectionLabel>
        <h1 className="font-display text-h2 font-extrabold text-ink">
          새 솔루션 슬라이드 등록
        </h1>
        <p className="text-body-sm text-ink-soft">
          제목·강조 텍스트·설명·이미지를 등록하고 노출 여부를 선택합니다.
        </p>
      </div>

      <div className="rounded-card border border-hairline bg-surface-white p-8">
        <SolutionForm mode="create" />
      </div>
    </section>
  );
}
