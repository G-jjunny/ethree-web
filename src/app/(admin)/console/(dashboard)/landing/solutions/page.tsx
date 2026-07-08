import Link from "next/link";
import { SectionLabel } from "@/shared/ui";
import { buildMetadata } from "@/shared/lib";
import { ADMIN_BASE_PATH } from "@/shared/constants";
import { getAdminSolutionSlides, SolutionAdminTable } from "@/features/solution";

export const metadata = buildMetadata({
  title: "솔루션 캐러셀 관리",
  description: "이쓰리 솔루션 캐러셀 콘텐츠 관리",
  path: "/console/landing/solutions",
  noIndex: true,
});

/**
 * 솔루션 캐러셀 관리 목록(서버 컴포넌트).
 * getAdminSolutionSlides()로 비활성 포함 전체를 로드해 SolutionAdminTable에 전달한다.
 * "새 슬라이드" 버튼으로 작성 페이지(/console/landing/solutions/new)로 이동한다.
 */
export default async function ConsoleLandingSolutionsPage() {
  const items = await getAdminSolutionSlides();

  return (
    <section className="flex flex-col gap-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-3">
          <SectionLabel color="olive">Console</SectionLabel>
          <h1 className="font-display text-h2 font-extrabold text-ink">
            솔루션 캐러셀 관리
          </h1>
          <p className="text-body-sm text-ink-soft">
            About Business 섹션의 솔루션 슬라이드를 등록·수정·삭제·순서변경합니다.
          </p>
        </div>
        <Link
          href={`${ADMIN_BASE_PATH}/landing/solutions/new`}
          className="inline-flex items-center justify-center rounded-pill bg-ink px-7 py-3.5 font-display text-sm font-bold text-white transition-colors duration-fast ease-out hover:opacity-90"
        >
          새 슬라이드
        </Link>
      </div>

      <SolutionAdminTable items={items} />
    </section>
  );
}
