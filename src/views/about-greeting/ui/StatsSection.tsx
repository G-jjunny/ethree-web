import { SectionLabel } from "@/shared/ui";

interface Stat {
  value: string;
  label: string;
}

/** 인사말 4문단(연혁)에서 도출한 스탯 3종. */
const STATS: readonly Stat[] = [
  { value: "2011", label: "창립" },
  { value: "160+", label: "환경 공공기관 프로젝트" },
  { value: "2018", label: "비전 수립" },
];

export function StatsSection() {
  return (
    <section className="bg-ink py-16 lg:py-25">
      <div className="content-container">
        <div className="max-w-2xl">
          <SectionLabel color="accent">OUR HISTORY</SectionLabel>
          <p className="mt-6 text-body-sm text-white/70">
            2011년 창립 이후 현재까지 160건 이상의 환경 공공기관 프로젝트를
            성공적으로 수행하며, 2018년에는 &quot;대한민국 환경 IT 융합 분야의
            으뜸기업&quot;이라는 비전을 수립했습니다.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 border-t border-white/12 pt-14 sm:grid-cols-3">
          {STATS.map((stat, index) => (
            <div
              key={stat.label}
              className={
                index < STATS.length - 1
                  ? "sm:border-r sm:border-white/12 sm:pr-8"
                  : ""
              }
            >
              <span className="font-display text-h1 font-extrabold text-accent">
                {stat.value}
              </span>
              <p className="mt-2 text-detail text-white/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
