import { SectionHeader } from "@/shared/ui";
import { Reveal } from "./Reveal";

interface CoreValue {
  no: string;
  word: string;
  meaning: string;
  description: string;
}

/** 인사말에서 도출한 핵심가치 3종 (번호 + 영문 워드 + 한글 뜻 + 설명 문단). */
const CORE_VALUES: readonly CoreValue[] = [
  {
    no: "01",
    word: "ECO",
    meaning: "자연 환경",
    description:
      "우리가 딛고 선 자연을 지키는 일에서 출발합니다. 폭염·기후재난 대응 연구부터 자연자산 가치평가, 훼손된 생태의 복원까지, 현재의 공간을 보전해 미래세대에게 건강한 환경을 물려주는 것을 첫 번째 책임으로 삼습니다.",
  },
  {
    no: "02",
    word: "ENVIRONMENT",
    meaning: "문명 환경",
    description:
      "환경과 IT를 융합해 사람이 살아가는 문명의 환경을 개선합니다. 환경 데이터 기반 정책 지원, 공공 시스템 구축, 실내외 공기질 개선까지, 기술로 일상의 환경을 더 안전하고 쾌적하게 만듭니다.",
  },
  {
    no: "03",
    word: "EDUCATION",
    meaning: "환경 교육",
    description:
      "환경의 가치는 공유될 때 지속됩니다. 기후세미나와 연구·교류 활동으로 축적한 환경 지식을 사회와 나누고, 다음 세대가 환경을 이해하고 실천하도록 돕습니다.",
  },
];

/**
 * 핵심가치(ECO/ENVIRONMENT/EDUCATION) 에디토리얼 표현.
 * 3분할 카드 대신 hairline으로 구분된 가로 스택 행으로 배치하고, 큰 ghost 번호와
 * 대형 워드로 위계를 만들어 매거진식 정제감을 준다. 넉넉한 세로 여백(DENSITY 낮게)과
 * 순차 스크롤 등장으로 절제된 감각을 더한다.
 * 이 페이지 전용 표현이므로 shared/ui로 추출하지 않는다.
 */
export function CoreValuesSection() {
  return (
    <section className="bg-surface py-20 lg:py-28">
      <div className="content-container">
        <Reveal>
          <SectionHeader
            className="mb-14 max-w-2xl lg:mb-20"
            tone="light"
            eyebrow="CORE VALUES"
            title={
              <>
                이쓰리를 만드는
                <br />
                세 가지 핵심가치
              </>
            }
          />
        </Reveal>

        <div className="border-t border-hairline">
          {CORE_VALUES.map((value, i) => (
            <Reveal key={value.no} delay={i * 0.08}>
              <article className="grid grid-cols-1 gap-6 border-b border-hairline py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-16 lg:py-14">
                <div className="flex items-baseline gap-5 lg:gap-8">
                  <span className="font-display text-h1 font-extrabold leading-none text-olive-muted/40">
                    {value.no}
                  </span>
                  <div>
                    <h3 className="font-display text-h3 font-extrabold tracking-headline text-ink lg:text-h2">
                      {value.word}
                    </h3>
                    <p className="mt-2 text-detail text-olive-label">
                      {value.meaning}
                    </p>
                  </div>
                </div>
                <p className="text-body-sm text-ink-soft lg:pt-3">
                  {value.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
