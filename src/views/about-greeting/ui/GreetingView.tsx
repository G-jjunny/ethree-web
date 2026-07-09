import {
  PlaceholderHeader,
  PlaceholderSubNav,
} from "@/widgets/placeholder-page";
import { NAV_GROUPS } from "@/shared/constants";
import { CeoIntroSection } from "./CeoIntroSection";
import { CoreValuesSection } from "./CoreValuesSection";
import { BusinessAreasSection } from "./BusinessAreasSection";
import { ClosingSection } from "./ClosingSection";

const group = NAV_GROUPS.find((g) => g.href === "/about")!;

/**
 * 인사말 페이지 조합. 배경 밴드 리듬(크림→다크→크림→크림)으로
 * 신뢰감·깊이를 만드는 매거진식 대표 서신 구성. 얇았던 연혁 밴드는
 * CEO 편지 하단 신뢰 지표로 병합했다.
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
      <BusinessAreasSection />
      <CoreValuesSection />
      <ClosingSection />
    </>
  );
}
