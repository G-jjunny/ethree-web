import {
  PlaceholderHeader,
  PlaceholderSubNav,
} from "@/widgets/placeholder-page";
import { NAV_GROUPS } from "@/shared/constants";
import { LocationMapSection } from "./LocationMapSection";
import { DirectionsSection } from "./DirectionsSection";

const group = NAV_GROUPS.find((g) => g.href === "/about")!;

/**
 * 오시는 길 페이지 조합. 인사말/연혁과 동일한 공용 헤더 패턴 +
 * 배경 밴드 리듬(크림 헤더 → 크림 지도/주소 → 올리브 오는 길)으로
 * 한 사이트 톤을 유지한다. 올리브 밴드로 마무리해 연혁 페이지와 리듬을 맞춘다.
 * SiteHeader/SiteFooter는 (marketing) 그룹 layout이 렌더한다.
 */
export function LocationView() {
  return (
    <>
      <section className="bg-surface pt-25 pb-16 lg:pt-30">
        <div className="content-container">
          <PlaceholderHeader eyebrow="ABOUT E3" title="오시는길" />
          <PlaceholderSubNav
            siblings={group.children}
            activeHref="/about/location"
          />
        </div>
      </section>
      <LocationMapSection />
      <DirectionsSection />
    </>
  );
}
