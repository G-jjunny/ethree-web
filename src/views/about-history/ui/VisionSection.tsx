import Image from "next/image";
import { SectionLabel } from "@/shared/ui";

interface RoadmapPhase {
  no: string;
  /** 원문 로드맵 표기(E3 20XX). 연도 강조를 낮추기 위해 보조 라벨로 사용. */
  tag: string;
  text: string;
}

/** 회사 모토·향후 방향(원문 유지). */
const VISION_MOTTO =
  "직원들의 행복, 고객의 행복과 이익을 우선함을 회사의 모토로 삼아 꾸준히 노력해 왔습니다.";
const VISION_FUTURE =
  "안정적인 성장동력 사업으로 수익사업을 확대해 지속적인 성장을 꾀하며 사회에 공헌하도록 성실히 노력하겠습니다.";

/**
 * E3 비전 로드맵(원문 유지). 원 표기의 연도(2014/2015/2023)는 과거라
 * 연도를 전면에 세우지 않고 단계(PHASE) 서술로 프레이밍한다.
 * 원문 "E3 20XX" 표기는 보조 태그로 보존한다.
 */
const ROADMAP: readonly RoadmapPhase[] = [
  { no: "01", tag: "E3 2014", text: "환경 IT 전문화 기반 조성" },
  { no: "02", tag: "E3 2015", text: "환경·융합서비스 으뜸 회사 성장기반 구축" },
  { no: "03", tag: "E3 2023", text: "대한민국 환경·융합 서비스 으뜸 회사" },
];

/**
 * 비전 섹션. 다크(ink) 밴드로 신뢰감을 주고 모토 → 향후 방향 →
 * 비전 로드맵 순서로 회사의 지향을 서술한다. 정적 텍스트뿐 — 서버 컴포넌트.
 */
export function VisionSection() {
  return (
    <section className="relative overflow-hidden bg-ink py-16 lg:py-25">
      {/* 배경 이미지(E3 연혁) + 다크 오버레이 — 흰 텍스트 가독성 확보 */}
      <Image
        src="/images/E3_history.png"
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        className="pointer-events-none object-cover object-center"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-ink/80"
        aria-hidden
      />
      {/* 장식 원형 (랜딩/인사말 다크 밴드와 일관성) */}
      <div
        className="pointer-events-none absolute -top-32 -right-24 h-96 w-96 rounded-full bg-white/5"
        aria-hidden
      />
      <div className="content-container relative">
        <div className="max-w-3xl">
          <SectionLabel color="accent">OUR VISION</SectionLabel>
          <p className="mt-6 text-h3 font-bold text-white lg:text-h2">
            {VISION_MOTTO}
          </p>
          <p className="mt-8 max-w-2xl text-body-sm text-white/80">
            {VISION_FUTURE}
          </p>
        </div>

        <div className="mt-14 border-t border-white/12 pt-10 lg:mt-16 lg:pt-14">
          <SectionLabel color="olive-soft" size="sm">
            E3 VISION ROADMAP
          </SectionLabel>
          <div className="mt-8 grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8">
            {ROADMAP.map((phase, index) => (
              <div
                key={phase.no}
                className={
                  index < ROADMAP.length - 1
                    ? "sm:border-r sm:border-white/12 sm:pr-8"
                    : ""
                }
              >
                <span className="font-display block text-mega font-extrabold leading-none text-accent/35">
                  {phase.no}
                </span>
                <span className="font-display mt-5 block text-eyebrow tracking-label text-white/40 uppercase">
                  {phase.tag}
                </span>
                <p className="mt-2 text-item font-bold text-white">
                  {phase.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
