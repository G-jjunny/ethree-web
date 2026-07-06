import {
  PlaceholderHeader,
  PlaceholderSubNav,
} from "@/widgets/placeholder-page";
import { NAV_GROUPS } from "@/shared/constants";
import { IntroSection } from "./IntroSection";
import { BusinessAreasSection } from "./BusinessAreasSection";
import { ProjectsSection } from "./ProjectsSection";

const group = NAV_GROUPS.find((g) => g.href === "/business")!;

/**
 * 사업소개 페이지 조합. about-history와 동일한 공용 헤더 패턴 +
 * 배경 밴드 리듬(크림→다크→크림)으로 사이트 톤을 유지한다.
 * 크림(헤더/사업 개요) → 다크(SI/R&D/Consulting 사업영역) → 크림(사업실적).
 * SiteHeader/SiteFooter는 (marketing) 그룹 layout이 렌더한다.
 */
export function BusinessIntroView() {
  return (
    <>
      <section className="bg-surface pt-25 pb-16 lg:pt-30">
        <div className="content-container">
          <PlaceholderHeader eyebrow="ABOUT BUSINESS" title="사업소개" />
          <PlaceholderSubNav
            siblings={group.children}
            activeHref="/business/intro"
          />
        </div>
      </section>
      <IntroSection />
      <BusinessAreasSection />
      <ProjectsSection />
    </>
  );
}
