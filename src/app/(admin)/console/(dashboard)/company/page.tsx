import { SectionLabel } from "@/shared/ui";
import { buildMetadata } from "@/shared/lib";
import { getCompanyInfo, CompanyInfoForm } from "@/features/company-info";

export const metadata = buildMetadata({
  title: "회사 정보 관리",
  description: "이쓰리 회사 메타정보 관리",
  path: "/console/company",
  noIndex: true,
});

/**
 * 회사 정보 관리 페이지(서버 컴포넌트).
 * getCompanyInfo()로 현재값을 로드해 CompanyInfoForm에 프리필한다.
 * 대시보드 크롬 route group((dashboard)) 안에 위치한다.
 */
export default async function ConsoleCompanyPage() {
  const company = await getCompanyInfo();

  return (
    <section className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <SectionLabel color="olive">Console</SectionLabel>
        <h1 className="font-display text-h2 font-extrabold text-ink">
          회사 정보 관리
        </h1>
        <p className="text-body-sm text-ink-soft">
          공개 사이트(헤더·푸터)에 노출되는 회사 메타정보를 수정합니다.
        </p>
      </div>

      <div className="rounded-card border border-hairline bg-surface-white p-8">
        <CompanyInfoForm initialValues={company} />
      </div>
    </section>
  );
}
