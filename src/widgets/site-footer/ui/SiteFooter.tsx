import Link from "next/link";
import { NAV_GROUPS } from "@/shared/constants";
import { getCompanyInfo } from "@/features/company-info";

/**
 * 전역 다크 푸터. 회사정보 1열 + 네비게이션 그룹 3열 + 카피라이트.
 * 회사정보는 DB(getCompanyInfo)에서 읽고, 미적용/오류 시 SITE로 폴백된다(getter 내부).
 * NAV_GROUPS는 회사정보가 아닌 사이트 구조 상수이므로 SITE(constants) 유지.
 */
export async function SiteFooter() {
  const company = await getCompanyInfo();

  return (
    <footer className="bg-ink pt-14 pb-8 lg:pt-20">
      <div className="content-container">
        {/* token 없음: 구조적 레이아웃 (회사정보 넓은 첫 컬럼 + 네비 3열) */}
        <div className="grid grid-cols-2 gap-10 border-b border-white/12 pb-14 lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:gap-14">
          {/* 회사정보 */}
          <div className="col-span-2 lg:col-span-1">
            <div className="font-display mb-4.5 text-2xl font-extrabold text-white">
              {company.nameEn}
            </div>
            <address className="text-meta leading-loose text-white/60 not-italic">
              {company.legalName}
              <br />
              대표이사 {company.ceo}
              <br />
              {company.address.line1}
              <br />
              {company.address.line2}
            </address>
          </div>

          {/* 네비게이션 그룹 */}
          {NAV_GROUPS.map((group) => (
            <div key={group.href}>
              <div className="text-caption tracking-caption mb-4.5 font-display font-bold uppercase text-white/40">
                {group.footerLabel}
              </div>
              <ul className="flex flex-col gap-3">
                {group.children.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-white/70 transition-colors duration-fast ease-out hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {group.footerLabel === "CUSTOMER SUPPORT" && (
                <div className="text-meta mt-6 leading-relaxed text-white/50">
                  Tel. {company.contact.tel}
                  <br />
                  Fax. {company.contact.fax}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-caption flex flex-col gap-2 pt-6 text-white/35 sm:flex-row sm:justify-between">
          <span>{company.copyright}</span>
          <span>{company.tagline}</span>
        </div>
      </div>
    </footer>
  );
}
