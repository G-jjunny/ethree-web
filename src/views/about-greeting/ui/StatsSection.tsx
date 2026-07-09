import { SectionLabel } from "@/shared/ui";

interface Stat {
  value: string;
  label: string;
  descriptor: string;
}

/**
 * 연혁 마일스톤 3종(리드 문단에서 파생 — 신규 사실 창작 없음).
 * 창립 → 축적된 성과 → 비전 수립의 여정 노드로 배치한다.
 */
const STATS: readonly Stat[] = [
  {
    value: "2011",
    label: "창립",
    descriptor: "환경 IT 전문기업으로 출발",
  },
  {
    value: "160+",
    label: "환경 공공기관 프로젝트",
    descriptor: "지금까지 성공적으로 수행",
  },
  {
    value: "2018",
    label: "비전 수립",
    descriptor: "대한민국 환경 IT 융합 으뜸기업",
  },
];

/**
 * 연혁(OUR HISTORY). 올리브 밴드 위에 3개 마일스톤을 연결선으로 잇는
 * 여정 타임라인으로 표현한다. 모바일은 좌측 세로선, lg 이상은 상단 수평선에
 * 도트를 얹어 창립→성과→비전의 흐름을 대형 흰색 숫자로 강조한다.
 * 연결선/도트는 기존 흰색 투명도 유틸만 사용 — 신규 토큰 없음. 서버 컴포넌트.
 */
export function StatsSection() {
  return (
    <section className="relative overflow-hidden bg-olive py-16 lg:py-25">
      {/* 장식 원형 */}
      <div
        className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full border border-white/10"
        aria-hidden
      />
      <div className="content-container relative">
        <div className="max-w-2xl">
          <SectionLabel color="olive-soft">OUR HISTORY</SectionLabel>
          <p className="mt-6 text-body-sm text-white/80">
            2011년 창립 이후 현재까지 160건 이상의 환경 공공기관 프로젝트를
            성공적으로 수행하며, 2018년에는 &quot;대한민국 환경 IT 융합 분야의
            으뜸기업&quot;이라는 비전을 수립했습니다.
          </p>
        </div>

        <ol className="mt-14 grid grid-cols-1 sm:mt-16 sm:grid-cols-3">
          {STATS.map((stat) => (
            <li
              key={stat.label}
              className="relative border-l border-white/12 pb-10 pl-8 last:pb-0 sm:border-l-0 sm:border-t sm:pb-0 sm:pl-0 sm:pr-8 sm:pt-8"
            >
              {/* 여정 도트 (연결선 위) */}
              <span
                aria-hidden
                className="absolute -left-1.5 top-1 h-3 w-3 rounded-full border border-white/40 bg-white/20 sm:left-0 sm:-top-1.5"
              />
              <span className="font-display block text-5xl font-extrabold leading-none text-white lg:text-hero">
                {stat.value}
              </span>
              <p className="mt-4 text-item font-bold text-white">
                {stat.label}
              </p>
              <p className="mt-2 text-detail text-white/70">
                {stat.descriptor}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
