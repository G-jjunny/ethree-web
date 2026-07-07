import {
  Button,
  IconCard,
  SectionHeader,
  type IconCardShape,
} from "@/shared/ui";

interface BusinessCard {
  no: string;
  title: string;
  description: string;
  /** 아이콘 형태 */
  shape: IconCardShape;
}

const BUSINESS_CARDS: readonly BusinessCard[] = [
  {
    no: "01",
    title: "ENVIRONMENT SI",
    description:
      "환경IT서비스 전문기업으로 대국민 서비스, 행정업무 통합관리 등 효율적인 시스템 구축과 환경 정보시스템에 관한 기획에서부터 개발과 구축, 운영까지의 모든 서비스를 제공합니다.",
    shape: "rounded-square",
  },
  {
    no: "02",
    title: "ENVIRONMENT R&D",
    description:
      "환경의 변화, 그것에 대응하는 기초연구와 응용화 연구를 통한 환경IT 관련 기술개발의 리스크를 줄이고 성공 가능성을 높이기 위해 전문가 그룹이 끊임없이 연구합니다.",
    shape: "diamond",
  },
  {
    no: "03",
    title: "ENVIRONMENT CONSULTING",
    description:
      "환경IT 관련 기술개발 프로젝트 수행 경험이 풍부한 전문 그룹과 조직을 바탕으로 차별화된 컨설팅을 제공, 다양한 환경 분야 프로젝트에 최적화된 사업 수행을 제공합니다.",
    shape: "circle",
  },
];

export function BusinessSection() {
  return (
    <section className="bg-surface py-16 lg:py-30">
      <div className="content-container">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-10">
          <SectionHeader
            tone="light"
            eyebrow="ABOUT BUSINESS"
            title={
              <>
                환경과 융합된
                <br />
                다양한 솔루션 개발
              </>
            }
          />
          {/* token 없음: 문단 폭 420px, max-w-md(448px) 근사 */}
          <p className="max-w-md text-body-sm text-ink-soft">
            대국민 서비스, 행정업무 통합관리 등 효율적인 시스템 구축과 환경
            정보시스템에 관한 기획부터 개발, 구축, 운영까지 — 이쓰리가 모든
            과정을 책임집니다.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
          {BUSINESS_CARDS.map((card) => (
            <IconCard
              key={card.no}
              shape={card.shape}
              label={card.no}
              title={card.title}
              description={card.description}
            />
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <Button variant="dark">E3 BUSINESS 자세히보기</Button>
        </div>
      </div>
    </section>
  );
}
