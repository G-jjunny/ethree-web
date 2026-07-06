import { SectionLabel } from "@/shared/ui";

interface BusinessArea {
  no: string;
  title: string;
  description: string;
  /** Consulting처럼 세부 항목이 있는 경우에만 채운다 */
  bullets?: readonly string[];
}

/**
 * SI/R&D/Consulting 사업영역.
 * 설명 원문은 landing BusinessSection의 BUSINESS_CARDS 문구를 그대로 재사용한다(무변경).
 * Consulting 세부 6항목은 사업소개 전용 원문.
 * 향후 Supabase 동적 콘텐츠 후보이므로 컴포넌트 밖 뷰-로컬 상수로 분리한다.
 */
const BUSINESS_AREAS: readonly BusinessArea[] = [
  {
    no: "01",
    title: "ENVIRONMENT SI",
    description:
      "환경IT서비스 전문기업으로 대국민 서비스, 행정업무 통합관리 등 효율적인 시스템 구축과 환경 정보시스템에 관한 기획에서부터 개발과 구축, 운영까지의 모든 서비스를 제공합니다.",
  },
  {
    no: "02",
    title: "ENVIRONMENT R&D",
    description:
      "환경의 변화, 그것에 대응하는 기초연구와 응용화 연구를 통한 환경IT 관련 기술개발의 리스크를 줄이고 성공 가능성을 높이기 위해 전문가 그룹이 끊임없이 연구합니다.",
  },
  {
    no: "03",
    title: "ENVIRONMENT CONSULTING",
    description:
      "환경IT 관련 기술개발 프로젝트 수행 경험이 풍부한 전문 그룹과 조직을 바탕으로 차별화된 컨설팅을 제공, 다양한 환경 분야 프로젝트에 최적화된 사업 수행을 제공합니다.",
    bullets: [
      "환경분야 종합 솔루션 컨설팅",
      "법규 및 기준 적합성 컨설팅",
      "환경관리계획 수립 컨설팅",
      "정보화 전략 계획 수립 컨설팅",
      "비즈니스 프로세스 및 전략 컨설팅",
      "아웃소싱 컨설팅",
    ],
  },
];

function AreaImage() {
  return (
    <div className="flex h-64 items-center justify-center overflow-hidden rounded-image bg-white/5 lg:h-80">
      {/* next/image 교체 슬롯: 사업영역 대표 이미지 */}
      <span className="font-display text-mini tracking-label text-white/40">
        BUSINESS IMAGE PLACEHOLDER
      </span>
    </div>
  );
}

interface AreaTextProps {
  area: BusinessArea;
}

function AreaText({ area }: AreaTextProps) {
  return (
    <div>
      <SectionLabel color="accent" size="sm">
        {area.title}
      </SectionLabel>
      {/* token 없음: 문단 폭 440px, max-w-md(448px) 근사 (ServiceSection과 동일) */}
      <p className="mt-4 max-w-md text-body-sm text-white/70">
        {area.description}
      </p>
      {area.bullets && (
        <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-3 border-t border-white/12 pt-6 sm:grid-cols-2 lg:grid-cols-1">
          {area.bullets.map((bullet) => (
            <li
              key={bullet}
              className="flex items-start gap-2.5 text-detail text-white/70"
            >
              <span
                aria-hidden
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
              />
              {bullet}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * 사업영역 에디토리얼 로우. ServiceSection의 교차 로우/이미지 슬롯 패턴을
 * 재사용하되 이미지 비중을 메인으로 둔다. 짝수 행(02)만 lg+에서 좌우 교차.
 * 정적 데이터뿐 — 서버 컴포넌트.
 */
export function BusinessAreasSection() {
  return (
    <section className="bg-ink py-16 lg:py-30">
      <div className="content-container">
        <div className="mb-18 flex flex-wrap items-end justify-between gap-10 border-b border-white/12 pb-8.5">
          <div>
            <SectionLabel color="accent">BUSINESS AREAS</SectionLabel>
            <h2 className="font-display mt-4 text-h2 font-extrabold text-white">
              환경과 융합된
              <br />
              다양한 솔루션 개발
            </h2>
          </div>
          {/* token 없음: 문단 폭 420px, max-w-md(448px) 근사 (ServiceSection과 동일) */}
          <p className="max-w-md text-body-sm text-white/70">
            시스템 구축(SI), 연구개발(R&D), 컨설팅 세 축으로 환경 분야의 문제를
            IT로 풀어냅니다.
          </p>
        </div>

        <div className="flex flex-col">
          {BUSINESS_AREAS.map((area, index) => {
            const isLast = index === BUSINESS_AREAS.length - 1;
            const isReversed = index % 2 === 1;
            // 모바일: 번호/텍스트/이미지 세로 스택. lg+에서만 짝수 행 좌우 교차.
            const orderText = isReversed ? "lg:order-3" : "lg:order-2";
            const orderImage = isReversed ? "lg:order-2" : "lg:order-3";
            return (
              <div
                key={area.no}
                /* token 없음: 번호 88px + 텍스트 0.85fr + 이미지 1.15fr(이미지 메인 비중), ServiceSection 레이아웃 파생 */
                className={`grid grid-cols-1 gap-6 py-10 lg:grid-cols-[88px_minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center lg:gap-12 lg:py-16 ${
                  isLast ? "" : "border-b border-white/12"
                }`}
              >
                <span className="font-display text-mega font-extrabold leading-none text-accent/35 lg:order-1">
                  {area.no}
                </span>
                <div className={orderText}>
                  <AreaText area={area} />
                </div>
                <div className={orderImage}>
                  <AreaImage />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
