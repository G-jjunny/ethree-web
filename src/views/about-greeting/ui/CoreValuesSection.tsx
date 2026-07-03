import { IconCard, SectionLabel } from "@/shared/ui";
import type { IconCardShape } from "@/shared/ui";

interface CoreValue {
  no: string;
  shape: IconCardShape;
  title: string;
  description: string;
}

/** 인사말 2문단에서 도출한 핵심가치 3종 (값 + 의미). */
const CORE_VALUES: readonly CoreValue[] = [
  { no: "01", shape: "circle", title: "ECO", description: "자연 환경" },
  {
    no: "02",
    shape: "diamond",
    title: "ENVIRONMENT",
    description: "문명 환경",
  },
  {
    no: "03",
    shape: "rounded-square",
    title: "EDUCATION",
    description: "환경 교육",
  },
];

export function CoreValuesSection() {
  return (
    <section className="bg-surface py-16 lg:py-25">
      <div className="content-container">
        <div className="mb-16 max-w-2xl">
          <SectionLabel color="olive">CORE VALUES</SectionLabel>
          <h2 className="font-display mt-4 text-h2 font-extrabold text-ink">
            이쓰리를 만드는
            <br />
            세 가지 핵심가치
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
          {CORE_VALUES.map((value) => (
            <IconCard
              key={value.no}
              shape={value.shape}
              label={value.no}
              title={value.title}
              description={value.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
