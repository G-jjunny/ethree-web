import { SectionLabel } from "@/shared/ui";
import { RECRUIT_STEPS } from "./support-careers.data";

/**
 * 채용 절차 섹션 — 번호 스텝 카드 그리드(서류 → 실무 면접 → 처우 협의 → 최종 합격).
 * 라이트 카드 톤(hairline 보더 + 대형 번호 타이포)으로 단계 흐름을 표현한다.
 * 서버 컴포넌트.
 */
export function CareersProcessSection() {
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

        <ol className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {RECRUIT_STEPS.map((step) => (
            <li
              key={step.no}
              className="flex flex-col gap-5 rounded-card border border-hairline bg-surface-white px-8 py-10"
            >
              <span className="font-display text-mega font-extrabold leading-none text-olive-muted/40">
                {step.no}
              </span>
              <div>
                <h3 className="text-item font-bold text-ink">{step.title}</h3>
                <p className="mt-3 text-detail text-ink-soft">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
