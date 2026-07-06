import {
  PlaceholderHeader,
  PlaceholderSubNav,
} from "@/widgets/placeholder-page";
import { SectionLabel } from "@/shared/ui";
import { getServices } from "@/shared/lib";
import { NAV_GROUPS } from "@/shared/constants";
import { ServiceRow } from "./ServiceRow";

const group = NAV_GROUPS.find((g) => g.href === "/business")!;

/**
 * 서비스소개 페이지 조합. business-intro와 동일한 공용 헤더 패턴 +
 * 배경 밴드 리듬(크림 헤더 → 다크 서비스 로우 목록)으로 사이트 톤을 유지한다.
 * 17개 서비스를 좌우 교차 에디토리얼 로우로 스캔성 있게 나열한다.
 * SiteHeader/SiteFooter는 (marketing) 그룹 layout이 렌더한다. 서버 컴포넌트.
 */
export function BusinessServiceView() {
  const services = getServices();

  return (
    <>
      <section className="bg-surface pt-25 pb-16 lg:pt-30">
        <div className="content-container">
          <PlaceholderHeader eyebrow="ABOUT BUSINESS" title="서비스소개" />
          <PlaceholderSubNav
            siblings={group.children}
            activeHref="/business/service"
          />
        </div>
      </section>

      <section className="bg-ink py-16 lg:py-30">
        <div className="content-container">
          <div className="mb-18 flex flex-wrap items-end justify-between gap-10 border-b border-white/12 pb-8.5">
            <div>
              <SectionLabel color="accent">SERVICES</SectionLabel>
              <h2 className="font-display mt-4 text-h2 font-extrabold text-white">
                환경과 융합된
                <br />
                다양한 솔루션 개발
              </h2>
            </div>
            {/* token 없음: 문단 폭 max-w-md(448px) 근사 — ServiceSection/BusinessAreasSection 밴드 헤더 리드와 동일 */}
            <p className="max-w-md text-body-sm text-white/70">
              환경IT 전문기업으로서 기획·개발·구축·운영까지 수행해 온 이쓰리의
              대표 서비스를 소개합니다.
            </p>
          </div>

          <div className="flex flex-col">
            {services.map((service, index) => (
              <ServiceRow
                key={service.id}
                service={service}
                index={index}
                isLast={index === services.length - 1}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
