import {
  PlaceholderHeader,
  PlaceholderSubNav,
} from "@/widgets/placeholder-page";
import { NAV_GROUPS } from "@/shared/constants";
import { CareersProcessSection } from "./CareersProcessSection";
import { CareersContactSection } from "./CareersContactSection";

const group = NAV_GROUPS.find((g) => g.href === "/support")!;

/**
 * 인재채용 페이지 조합. business-service와 동일한 공용 헤더 밴드 패턴
 * (bg-surface pt-25 pb-16 lg:pt-30 + content-container) 위에 하위 페이지 SubNav를 둔다.
 * 채용 절차 스텝 → 지원/문의 폼 순으로 밴드를 이어 붙인다.
 * SiteHeader/SiteFooter는 (marketing) 그룹 layout이 렌더한다. 서버 컴포넌트.
 */
export function SupportCareersView() {
  return (
    <>
      <section className="bg-surface pt-25 pb-16 lg:pt-30">
        <div className="content-container">
          <PlaceholderHeader eyebrow="CUSTOMER SUPPORT" title="인재채용" />
          <PlaceholderSubNav
            siblings={group.children}
            activeHref="/support/careers"
          />
        </div>
      </section>

      <CareersProcessSection />
      <CareersContactSection />
    </>
  );
}
