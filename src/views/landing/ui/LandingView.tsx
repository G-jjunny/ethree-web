import { SiteHeader } from "@/widgets/site-header";
import { SiteFooter } from "@/widgets/site-footer";
import { HeroSection } from "./HeroSection";
import { WhoWeAreSection } from "./WhoWeAreSection";
import { NewsSection } from "./NewsSection";
import { BusinessSection } from "./BusinessSection";
import { ServiceSection } from "./ServiceSection";

/**
 * 랜딩 페이지 조합. 섹션/위젯을 순서대로 조립하기만 한다.
 * SiteHeader는 뷰포트 고정 오버레이라 히어로 외부 최상단에서 렌더한다.
 */
export function LandingView() {
  return (
    <>
      <SiteHeader />
      <HeroSection />
      <WhoWeAreSection />
      <NewsSection />
      <BusinessSection />
      <ServiceSection />
      <SiteFooter />
    </>
  );
}
