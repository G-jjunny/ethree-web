import { SectionLabel } from "@/shared/ui";
import { RECRUIT_STEPS } from "./support-careers.data";

/**
 * 채용 절차 섹션 — 번호 뱃지 + 연결선 타임라인(서류 → 실무 면접 → 처우 협의 → 최종 합격).
 * 모바일은 세로 타임라인(뱃지 아래로 연결선), 데스크탑은 가로 타임라인(뱃지 사이 연결선)으로
 * 단계 흐름을 스캔성 있게 표현한다. 연결선/뱃지는 hairline·olive 토큰만 사용한다.
 * 서버 컴포넌트.
 */
export function CareersProcessSection() {
  const lastIndex = RECRUIT_STEPS.length - 1;

  return (
    <section className="bg-surface py-16 lg:py-25">
      <div className="content-container">
        <div className="mb-14 max-w-2xl lg:mb-16">
          <SectionLabel color="olive">RECRUIT PROCESS</SectionLabel>
          <h2 className="font-display mt-4 text-h2 font-extrabold text-ink">
            채용 절차
          </h2>
          <p className="mt-6 text-body-sm text-ink-soft">
            지원부터 최종 합격까지, 이쓰리의 채용은 다음 단계로 진행됩니다.
          </p>
        </div>

        <ol className="flex flex-col lg:flex-row">
          {RECRUIT_STEPS.map((step, index) => {
            const isLast = index === lastIndex;

            return (
              <li
                key={step.no}
                className="relative flex flex-1 gap-5 pb-10 last:pb-0 lg:flex-col lg:gap-6 lg:pb-0 lg:pr-8"
              >
                {!isLast && (
                  <>
                    {/* 모바일 세로 연결선 (뱃지 하단 → 다음 뱃지) */}
                    <span
                      aria-hidden
                      className="absolute top-10 bottom-0 left-5 w-px bg-hairline lg:hidden"
                    />
                    {/* 데스크탑 가로 연결선 (뱃지 중심 → 다음 뱃지 중심) */}
                    <span
                      aria-hidden
                      className="absolute top-5 left-5 hidden h-px w-full bg-hairline lg:block"
                    />
                  </>
                )}

                <span className="relative z-10 flex h-10 w-10 flex-none items-center justify-center rounded-full border border-hairline bg-surface-white font-display text-detail font-extrabold text-olive-label">
                  {step.no}
                </span>

                <div className="lg:pr-4">
                  <h3 className="text-item font-bold text-ink">{step.title}</h3>
                  <p className="mt-2 text-detail text-ink-soft">
                    {step.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
