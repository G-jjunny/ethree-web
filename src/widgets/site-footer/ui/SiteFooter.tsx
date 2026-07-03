import Link from "next/link";
import { SITE, NAV_GROUPS } from "@/shared/constants";

/**
 * 전역 다크 푸터. 회사정보 1열 + 네비게이션 그룹 3열 + 카피라이트.
 */
export function SiteFooter() {
  return (
    <footer className="bg-ink pt-20 pb-8">
      <div className="content-container">
        {/* token 없음: 구조적 레이아웃 (회사정보 넓은 첫 컬럼 + 네비 3열) */}
        <div className="grid grid-cols-[1.3fr_1fr_1fr_1fr] gap-14 border-b border-white/12 pb-14">
          {/* 회사정보 */}
          <div>
            <div className="font-display mb-4.5 text-2xl font-extrabold text-white">
              {SITE.nameEn}
            </div>
            <address className="text-meta leading-loose text-white/60 not-italic">
              {SITE.legalName}
              <br />
              대표이사 {SITE.ceo}
              <br />
              {SITE.address.line1}
              <br />
              {SITE.address.line2}
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
                  Tel. {SITE.contact.tel}
                  <br />
                  Fax. {SITE.contact.fax}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-caption flex justify-between pt-6 text-white/35">
          <span>{SITE.copyright}</span>
          <span>{SITE.tagline}</span>
        </div>
      </div>
    </footer>
  );
}
