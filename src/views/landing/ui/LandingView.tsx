import { HeroSection } from "./HeroSection";
import { WhoWeAreSection } from "./WhoWeAreSection";
import { NewsSection } from "./NewsSection";
import { BusinessSection } from "./BusinessSection";
import { ServiceSection } from "./ServiceSection";

/**
 * 랜딩 페이지 조합. 섹션을 순서대로 조립하기만 한다.
 * SiteHeader/SiteFooter는 (marketing) 그룹 layout이 렌더한다.
 */
export function LandingView() {
  return (
    <>
      <HeroSection />
      <WhoWeAreSection />
      <NewsSection />
      <BusinessSection />
      <ServiceSection />
    </>
  );
}
