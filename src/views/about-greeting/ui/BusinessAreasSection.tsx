import { IconCard, SectionLabel } from "@/shared/ui";
import type { IconCardShape } from "@/shared/ui";

interface BusinessArea {
  no: string;
  shape: IconCardShape;
  title: string;
  items: readonly string[];
}

/** 사업분야 3종 + 세부항목 (인사말 5~6문단에서 확장된 원문 목록). */
const BUSINESS_AREAS: readonly BusinessArea[] = [
  {
    no: "01",
    shape: "rounded-square",
    title: "기후환경 분야",
    items: [
      "폭염 대응 연구",
      "영유아 건강지수 개발",
      "기후위기 적응대책 수립",
      "기후재난 대응",
      "기후·에너지 관리",
      "자연자산 가치평가",
      "환경자원 총량관리",
      "훼손지 유형별 생태복원 등",
    ],
  },
  {
    no: "02",
    shape: "diamond",
    title: "환경 IT 분야",
    items: [
      "환경부 및 산하기관 대상 시스템 개발 및 유지보수",
      "오픈소스 기반 GIS 플랫폼 구축",
      "환경영향평가 시스템 구축 및 운영",
    ],
  },
  {
    no: "03",
    shape: "circle",
    title: "환경 IoT 분야",
    items: [
      "실내공기 측정 및 모니터링",
      "공기질 진단 컨설팅",
      "대기오염 감시 시스템",
      "오염물질 방지 운영 시스템",
      "기후위기 적응형 기술 및 탄소중립 실현을 위한 환경 IoT 솔루션 개발",
    ],
  },
];

export function BusinessAreasSection() {
  return (
    <section className="bg-surface py-16 lg:py-25">
      <div className="content-container">
        <div className="mb-16 max-w-2xl">
          <SectionLabel color="olive">OUR BUSINESS</SectionLabel>
          <h2 className="font-display mt-4 text-h2 font-extrabold text-ink">
            환경과 IT를 잇는
            <br />
            세 가지 사업분야
          </h2>
          <p className="mt-6 text-body-sm text-ink-soft">
            특히 저희는 기후위기 적응 전략을 기반으로, 환경 데이터 기반 정책
            지원, 실내외 공기질 개선, 환경플랫폼 구축, 탄소중립 기술 실현 등
            다양한 활동을 전개하고 있습니다. 이쓰리의 환경 IT 기술력은 특히
            환경영향평가 시스템 구축 사례를 통해 입증되었으며, 이는 지금도
            환경부 대표 플랫폼으로서 안정적으로 운영되고 있습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-7 lg:grid-cols-3">
          {BUSINESS_AREAS.map((area) => (
            <IconCard
              key={area.no}
              shape={area.shape}
              label={area.no}
              title={area.title}
              items={area.items}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
