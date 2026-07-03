import { SiteFooter } from "@/widgets/site-footer";
import { HeroSection } from "./HeroSection";
import { WhoWeAreSection } from "./WhoWeAreSection";
import { NewsSection } from "./NewsSection";
import { BusinessSection } from "./BusinessSection";
import { ServiceSection } from "./ServiceSection";

/**
 * 랜딩 페이지 조합. 섹션/위젯을 순서대로 조립하기만 한다.
 */
export function LandingView() {
  return (
    <>
      <HeroSection />
      <WhoWeAreSection />
      <NewsSection />
      <BusinessSection />
      <ServiceSection />
      <SiteFooter />
    </>
  );
}
