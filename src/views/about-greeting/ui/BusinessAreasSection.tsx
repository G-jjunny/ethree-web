import { SectionHeader } from "@/shared/ui";

import { BusinessAreaCard } from "./BusinessAreaCard";

interface BusinessArea {
  no: string;
  titleEn: string;
  title: string;
  description: string;
  imageSrc?: string;
}

/** 사업분야 3종 (인사말 5~6문단 원문 키워드를 문단으로 재구성). */
const BUSINESS_AREAS: readonly BusinessArea[] = [
  {
    no: "01",
    titleEn: "CLIMATE & ENVIRONMENT",
    title: "기후 환경 분야",
    description:
      "폭염 대응 연구, 영유아 건강지수 개발, 기후위기 적응대책 수립부터 기후재난 대응, 기후·에너지 관리, 자연자산 가치평가, 환경자원 총량관리, 훼손지 생태복원까지 — 기후위기 시대에 필요한 환경 정책·연구 전 영역을 다룹니다.",
    imageSrc: "/images/about/environment-climate.jpg",
  },
  {
    no: "02",
    titleEn: "ENVIRONMENT IT",
    title: "환경 IT 분야",
    description:
      "환경부 및 산하기관 대상 시스템 개발·유지보수, 오픈소스 기반 GIS 플랫폼 구축, 환경영향평가 시스템 구축·운영까지 — 환경 데이터를 다루는 공공 IT 인프라를 설계하고 운영합니다.",
    imageSrc: "/images/about/environment-it.jpg",
  },
  {
    no: "03",
    titleEn: "ENVIRONMENT IoT",
    title: "환경 IoT 분야",
    description:
      "실내공기 측정·모니터링, 공기질 진단 컨설팅, 대기오염 감시 시스템, 오염물질 방지 운영 시스템부터 탄소중립 실현을 위한 환경 IoT 솔루션 개발까지 — 센서 기반 환경 모니터링 기술을 제공합니다.",
    imageSrc: "/images/about/environment-iot.jpg",
  },
];

export function BusinessAreasSection() {
  return (
    <section className="bg-surface py-16 lg:py-25">
      <div className="content-container">
        <SectionHeader
          className="mb-12 max-w-2xl"
          tone="light"
          eyebrow="OUR BUSINESS"
          title={
            <>
              환경과 IT를 잇는
              <br />세 가지 사업분야
            </>
          }
          description="특히 저희는 기후위기 적응 전략을 기반으로, 환경 데이터 기반 정책 지원, 실내외 공기질 개선, 환경플랫폼 구축, 탄소중립 기술 실현 등 다양한 활동을 전개하고 있습니다. 이쓰리의 환경 IT 기술력은 특히 환경영향평가 시스템 구축 사례를 통해 입증되었으며, 이는 지금도 환경부 대표 플랫폼으로서 안정적으로 운영되고 있습니다."
        />

        <div className="grid grid-cols-1 divide-y divide-hairline border-hairline sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:border-x">
          {BUSINESS_AREAS.map((area) => (
            <BusinessAreaCard
              key={area.no}
              no={area.no}
              titleEn={area.titleEn}
              title={area.title}
              description={area.description}
              imageSrc={area.imageSrc}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
