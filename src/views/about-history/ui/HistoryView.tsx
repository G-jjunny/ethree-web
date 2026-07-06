import {
  PlaceholderHeader,
  PlaceholderSubNav,
} from "@/widgets/placeholder-page";
import { NAV_GROUPS } from "@/shared/constants";
import { VisionSection } from "./VisionSection";
import { HistoryTimelineSection } from "./HistoryTimelineSection";
import { PartnersSection } from "./PartnersSection";

const group = NAV_GROUPS.find((g) => g.href === "/about")!;

/**
 * 연혁 및 비전 페이지 조합. 인사말(GreetingView)과 동일한 공용 헤더 패턴 +
 * 배경 밴드 리듬(크림→다크→크림→올리브)으로 한 사이트 톤을 유지한다.
 * SiteHeader/SiteFooter는 (marketing) 그룹 layout이 렌더한다.
 */
export function HistoryView() {
  return (
    <>
      <section className="bg-surface pt-25 pb-16 lg:pt-30">
        <div className="content-container">
          <PlaceholderHeader eyebrow="ABOUT E3" title="연혁 및 비전" />
          <PlaceholderSubNav
            siblings={group.children}
            activeHref="/about/history"
          />
        </div>
      </section>
      <VisionSection />
      <HistoryTimelineSection />
      <PartnersSection />
    </>
  );
}
