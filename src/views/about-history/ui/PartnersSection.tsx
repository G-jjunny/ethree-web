import { LogoCarousel, SectionHeader } from "@/shared/ui";
import { getPartners } from "@/shared/lib";

/**
 * 협력 기관 로고 카러셀. 올리브 밴드로 배경 리듬을 닫고 신뢰 요소를 더한다.
 * 데이터는 getPartners()(shared/lib)에서 가져오며, LogoCarousel이 client 경계라
 * 이 섹션 자체는 서버 컴포넌트로 유지된다.
 */
export function PartnersSection() {
  return (
    <section className="relative overflow-hidden bg-olive py-16 lg:py-25">
      {/* 장식 원형 */}
      <div
        className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full border border-white/10"
        aria-hidden
      />
      <div className="content-container relative">
        <SectionHeader
          className="max-w-2xl"
          tone="olive"
          eyebrow="PARTNERS"
          title="함께해온 기관"
          description="환경부를 비롯한 공공기관·연구기관·학계와 협력하며 환경 IT 융합의 현장을 함께 만들어 왔습니다."
        />

        <div className="mt-14">
          <LogoCarousel logos={getPartners()} columnCount={4} />
        </div>
      </div>
    </section>
  );
}
