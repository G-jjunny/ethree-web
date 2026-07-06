import { SectionLabel } from "@/shared/ui";
import {
  getHistoryByYear,
  getHistoryEvents,
  type HistoryCategory,
} from "@/shared/lib";
import { HistoryCategoryTag } from "./HistoryCategoryTag";

interface SummaryStat {
  value: string;
  label: string;
}

/** flat 배열에서 집계 요약을 파생한다(하드코딩 금지). */
function buildSummary(): SummaryStat[] {
  const events = getHistoryEvents();
  const foundingYear = events.reduce(
    (min, e) => Math.min(min, e.year),
    events[0]?.year ?? 0,
  );
  const count = (category: HistoryCategory) =>
    events.filter((e) => e.category === category).length;

  return [
    { value: String(foundingYear), label: "설립" },
    { value: `${count("patent")}건`, label: "특허" },
    { value: `${count("award")}건`, label: "수상·표창" },
    { value: `${count("cert")}건`, label: "인증·등록" },
  ];
}

/**
 * 연혁 타임라인. getHistoryByYear()를 소비해 인덱스형 2열 레이아웃으로
 * 렌더한다(좌: 대형 연도 / 우: hairline 구획 이벤트 리스트 + 세로 스파인).
 * 상단에는 배열에서 파생한 집계 요약을 배치해 신뢰·요약성을 준다.
 * 모바일은 연도 헤더 + 리스트 스택. 정적 데이터뿐 — 서버 컴포넌트.
 */
export function HistoryTimelineSection() {
  const groups = getHistoryByYear();
  const summary = buildSummary();

  return (
    <section className="bg-surface py-16 lg:py-25">
      <div className="content-container">
        <div className="max-w-2xl">
          <SectionLabel color="olive">HISTORY</SectionLabel>
          <h2 className="font-display mt-4 text-h2 font-extrabold text-ink">
            이쓰리가 걸어온 길
          </h2>
          <p className="mt-6 text-body-sm text-ink-soft">
            2010년 설립 이후 환경과 IT의 융합 현장에서 쌓아온 특허·수상·인증과
            주요 사업의 발자취입니다.
          </p>
        </div>

        {/* 파생 집계 요약 */}
        <dl className="mt-12 grid grid-cols-2 gap-8 border-y border-hairline py-10 sm:grid-cols-4 lg:mt-14">
          {summary.map((stat) => (
            <div key={stat.label}>
              <dt className="text-detail text-ink-soft">{stat.label}</dt>
              <dd className="font-display mt-2 text-4xl font-extrabold leading-none text-ink lg:text-h1">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>

        {/* 인덱스형 2열 타임라인 */}
        <ol className="mt-16 lg:mt-20">
          {groups.map((group) => (
            <li
              key={group.year}
              className="grid grid-cols-1 gap-4 pb-12 last:pb-0 lg:grid-cols-[180px_1fr] lg:gap-12 lg:pb-0"
            >
              {/* 연도 */}
              <div className="lg:pb-14">
                <div className="lg:sticky lg:top-28">
                  <span className="font-display block text-h1 font-extrabold leading-none text-olive-muted/60 lg:text-hero">
                    {group.year}
                  </span>
                  <span className="mt-2 block text-detail text-muted">
                    {group.events.length}건
                  </span>
                </div>
              </div>

              {/* 이벤트 리스트 + 세로 스파인(lg) */}
              <ul className="relative divide-y divide-hairline lg:border-l lg:border-hairline lg:pb-14 lg:pl-10">
                {/* 연도 마커 */}
                <span
                  aria-hidden
                  className="absolute -left-1 top-1.5 hidden h-2 w-2 rounded-full bg-olive-muted lg:block"
                />
                {group.events.map((event) => (
                  <li
                    key={event.id}
                    className="flex flex-col gap-2 py-5 first:pt-0 sm:flex-row-reverse sm:items-start sm:justify-end sm:gap-4"
                  >
                    <HistoryCategoryTag category={event.category} />
                    <p className="text-body-sm text-ink sm:flex-1">
                      {event.title}
                    </p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
