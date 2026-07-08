import { HeroCarousel } from "./HeroCarousel";

/**
 * 히어로. Eco / Environment / Education 3슬라이드 자동 캐러셀.
 * 서버 컴포넌트로 섹션 골격만 유지하고 클라이언트 캐러셀을 렌더한다.
 * 헤더는 LandingView에서 고정 오버레이로 별도 렌더된다.
 */
export function HeroSection() {
  return (
    <section className="relative w-full">
      <HeroCarousel />
    </section>
  );
}
