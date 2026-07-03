import { SectionLabel } from "@/shared/ui";

interface WhoWeAreItem {
  label: string;
  title: string;
  description: string;
  /** 아이콘 형태: 원 / 마름모 */
  shape: "circle" | "diamond";
}

const ITEMS: readonly WhoWeAreItem[] = [
  {
    label: "ENVIRONMENT",
    title: "10년 이상 축적된 환경 전문성",
    description:
      "환경정책평가연구원 환경영향평가시스템 구축·운영을 성공적으로 이어온 핵심 환경마스터 그룹.",
    shape: "circle",
  },
  {
    label: "IT SOLUTION",
    title: "환경부 대표 시스템 구축·운영",
    description:
      "환경부의 대표 사이트로 자리매김한 시스템의 기획·개발·구축·운영을 지금까지 성공리에 관리합니다.",
    shape: "diamond",
  },
];

export function WhoWeAreSection() {
  return (
    <section className="relative overflow-hidden bg-olive py-16 lg:py-25">
      {/* 장식 원형 */}
      <div className="pointer-events-none absolute -top-40 -right-30 h-130 w-130 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -bottom-55 right-45 h-95 w-95 rounded-full border border-white/10" />

      <div className="content-container relative grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionLabel color="olive-soft">WHO WE ARE</SectionLabel>
          <h2 className="font-display mt-4.5 text-h1 font-extrabold text-white">
            환경과 IT, 두 영역을
            <br />
            깊이 있게 융합합니다
          </h2>
          {/* token 없음: 문단 폭 460px, max-w-md(448px) 근사 */}
          <p className="mt-6 max-w-md text-base leading-loose text-white/80">
            환경생태교육 및 운영, 폭염·영유아 건강지수 연구, 자연자산 가치평가,
            수변구역 조사·관리계획 등 환경 분야의 축적된 전문성과, 환경부 및
            산하기관 시스템 개발·오픈소스 기반 GIS 사업을 통해 쌓아온 IT 역량을
            바탕으로 최적의 솔루션을 만듭니다.
          </p>
        </div>

        <div className="flex flex-col gap-7">
          {ITEMS.map((item, index) => (
            <div
              key={item.label}
              className={`flex items-start gap-5 ${
                index < ITEMS.length - 1
                  ? "border-b border-white/12 pb-6.5"
                  : ""
              }`}
            >
              <div className="flex h-12 w-12 flex-none items-center justify-center rounded-full border border-white/20 bg-white/10">
                <div
                  className={
                    item.shape === "circle"
                      ? "h-4 w-4 rounded-full bg-accent"
                      : "h-4 w-4 rotate-45 bg-accent"
                  }
                />
              </div>
              <div>
                <SectionLabel color="olive-soft" size="sm">
                  {item.label}
                </SectionLabel>
                <h3 className="mt-2 text-item font-bold text-white">
                  {item.title}
                </h3>
                {/* token 없음: 문단 폭 420px, max-w-md(448px) 근사 */}
                <p className="mt-2 max-w-md text-detail text-white/75">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
