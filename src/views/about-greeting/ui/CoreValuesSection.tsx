import { SectionLabel } from "@/shared/ui";

interface CoreValue {
  no: string;
  title: string;
  meaning: string;
}

/** 인사말 2문단에서 도출한 핵심가치 3종 (값 + 의미). */
const CORE_VALUES: readonly CoreValue[] = [
  { no: "01", title: "ECO", meaning: "자연 환경" },
  { no: "02", title: "ENVIRONMENT", meaning: "문명 환경" },
  { no: "03", title: "EDUCATION", meaning: "환경 교육" },
];

/**
 * 핵심가치(ECO/ENVIRONMENT/EDUCATION) 에디토리얼 표현.
 * 반복적인 IconCard(landing BusinessSection 톤) 대신 대형 번호 타이포 +
 * 넓은 여백 + hairline 구획으로 정제된 매거진식 레이아웃으로 차별화한다.
 * 이 페이지 전용 표현이므로 shared/ui로 추출하지 않는다(IconCard는 그대로 유지).
 */
export function CoreValuesSection() {
  return (
    <section className="bg-surface py-16 lg:py-25">
      <div className="content-container">
        <div className="mb-14 max-w-2xl lg:mb-16">
          <SectionLabel color="olive">CORE VALUES</SectionLabel>
          <h2 className="font-display mt-4 text-h2 font-extrabold text-ink">
            이쓰리를 만드는
            <br />
            세 가지 핵심가치
          </h2>
        </div>

        <div className="grid grid-cols-1 divide-y divide-hairline border-y border-hairline sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {CORE_VALUES.map((value) => (
            <article
              key={value.no}
              className="flex flex-col gap-6 py-10 sm:px-10 sm:py-12 sm:first:pl-0 sm:last:pr-0 lg:py-14"
            >
              <span className="font-display text-mega font-extrabold leading-none text-olive-muted/40">
                {value.no}
              </span>
              <div>
                <h3 className="font-display text-h3 font-extrabold text-ink">
                  {value.title}
                </h3>
                <p className="mt-3 text-body-sm text-ink-soft">
                  {value.meaning}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
