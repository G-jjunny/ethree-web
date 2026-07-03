import {
  PlaceholderHeader,
  PlaceholderSubNav,
} from "@/widgets/placeholder-page";
import { NAV_GROUPS } from "@/shared/constants";
import { CeoIntroSection } from "./CeoIntroSection";
import { CoreValuesSection } from "./CoreValuesSection";
import { StatsSection } from "./StatsSection";
import { BusinessAreasSection } from "./BusinessAreasSection";
import { ClosingSection } from "./ClosingSection";

const group = NAV_GROUPS.find((g) => g.href === "/about")!;

/**
 * 인사말 페이지 조합. 헤더+서브내비 + 실콘텐츠 섹션을 순서대로 조립한다.
 * SiteHeader/SiteFooter는 (marketing) 그룹 layout이 렌더한다.
 */
export function GreetingView() {
  return (
    <>
      <section className="bg-surface pt-25 pb-16 lg:pt-30">
        <div className="content-container">
          <PlaceholderHeader eyebrow="ABOUT E3" title="인사말" />
          <PlaceholderSubNav
            siblings={group.children}
            activeHref="/about/greeting"
          />
        </div>
      </section>
      <CeoIntroSection />
      <CoreValuesSection />
      <StatsSection />
      <BusinessAreasSection />
      <ClosingSection />
    </>
  );
}
