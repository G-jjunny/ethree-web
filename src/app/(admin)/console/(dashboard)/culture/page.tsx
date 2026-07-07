import { SectionLabel } from "@/shared/ui";
import { buildMetadata } from "@/shared/lib";
import { getAdminCultureItems, CultureAdminManager } from "@/features/culture";

export const metadata = buildMetadata({
  title: "기업문화 관리",
  description: "이쓰리 기업문화 콘텐츠 관리",
  path: "/console/culture",
  noIndex: true,
});

/**
 * 기업문화 관리(서버 컴포넌트).
 * getAdminCultureItems()로 전량(group·sort_order 정렬)을 로드해 CultureAdminManager에
 * 전달한다. group(인재상·핵심가치·복지 인트로·복지)별로 항목을 추가/수정/삭제하고
 * 이미지를 업로드한다.
 */
export default async function ConsoleCulturePage() {
  const items = await getAdminCultureItems();

  return (
    <section className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <SectionLabel color="olive">Console</SectionLabel>
        <h1 className="font-display text-h2 font-extrabold text-ink">
          기업문화 관리
        </h1>
        <p className="text-body-sm text-ink-soft">
          고객지원(Customer Support) 기업문화 페이지의 인재상·핵심가치·복지
          문구와 이미지를 관리합니다.
        </p>
      </div>

      <CultureAdminManager items={items} />
    </section>
  );
}
