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
 * cream 중심 에디토리얼(크림 헤더 → 크림 지도/주소 → 크림 오는 길)로
 * 최근 인사말 톤과 정합한다. 대형 풀와이드 지도가 시각 앵커 역할을 하고,
 * 섹션은 hairline 프레이밍 + Reveal 스크롤 등장으로 정제된다.
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
