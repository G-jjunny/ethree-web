import Image from "next/image";
import { SectionLabel, Reveal } from "@/shared/ui";
import { SITE } from "@/shared/constants";

interface Milestone {
  value: string;
  label: string;
  note: string;
}

/**
 * 창립 → 축적된 성과 → 비전으로 이어지는 신뢰 지표.
 * 기존 올리브 OUR HISTORY 밴드(숫자 3개뿐이라 얇았음)를 CEO 편지 하단으로
 * 병합해 밴드 하나를 줄이고, 대신 편지의 신뢰도를 보강한다.
 * 리드 문단에서 파생한 사실만 사용 — 신규 사실 창작 없음.
 */
const MILESTONES: readonly Milestone[] = [
  { value: "2011", label: "창립", note: "환경 IT 전문기업으로 출발" },
  { value: "160+", label: "공공기관 프로젝트", note: "지금까지 성공적으로 수행" },
  { value: "2018", label: "비전 수립", note: "환경 IT 융합 으뜸기업" },
];

/**
 * CEO 인사 도입부. 다크(ink) 밴드 위에 프레임 포트레이트 + 대형 에디토리얼
 * 헤드라인 + 리드 문단을 배치한 "대표 서신" 모먼트.
 * 하단에는 창립·성과·비전 3개 지표를 hairline으로 구분한 신뢰 스트립으로 얹어
 * 별도 연혁 밴드 없이 편지 안에서 회사의 궤적을 함께 보여준다.
 * 정적 텍스트/이미지 — 스크롤 등장 모션만 Reveal(client) 아일랜드로 처리.
 */
export function CeoIntroSection() {
  return (
    <section className="relative overflow-hidden bg-ink py-20 lg:py-28">
      {/* 장식 원형 (랜딩 WhoWeAre 톤과 일관성) */}
      <div
        className="pointer-events-none absolute -top-32 -right-24 h-96 w-96 rounded-full bg-white/5"
        aria-hidden
      />
      <div className="content-container relative">
        {/* token 없음: CEO 사진 실제 폭 210px 기준 고정 컬럼(에셋 원본 치수) */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[220px_1fr] lg:items-start lg:gap-20">
          <Reveal>
            <figure className="flex flex-col items-center gap-5 lg:items-start">
              <div className="rounded-image border border-white/20 bg-white/5 p-2">
                <Image
                  src="/images/ceo-portrait.gif"
                  alt={`이쓰리 대표이사 ${SITE.ceo}`}
                  width={210}
                  height={271}
                  unoptimized
                  className="rounded-image"
                />
              </div>
              <figcaption className="text-center lg:text-left">
                <p className="text-item font-bold text-white">{SITE.ceo}</p>
                <p className="mt-1 text-detail text-white/60">대표이사</p>
              </figcaption>
            </figure>
          </Reveal>

          <Reveal delay={0.08} className="lg:pt-1.5">
            <SectionLabel color="accent">CEO MESSAGE</SectionLabel>
            <h2 className="mt-6 text-h3 font-extrabold tracking-headline text-white lg:text-h2">
              환경과 IT의 융합으로
              <br />
              내일의 환경을 짓습니다.
            </h2>

            <p className="mt-8 max-w-2xl text-body-sm text-white/70">
              안녕하십니까? 주식회사{" "}
              <strong className="font-bold text-white">이쓰리(E3)</strong>{" "}
              대표이사 {SITE.ceo}입니다.
            </p>
            <p className="mt-5 max-w-2xl text-body-sm text-white/80">
              이쓰리는{" "}
              <strong className="font-bold text-brand">ECO(자연 환경)</strong>,{" "}
              <strong className="font-bold text-brand">
                ENVIRONMENT(문명 환경)
              </strong>
              ,{" "}
              <strong className="font-bold text-brand">
                EDUCATION(환경 교육)
              </strong>
              의 세 가지 가치를 기반으로, 현재의 공간을 보전하고 미래세대에게
              건강하고 쾌적한 환경을 물려주기 위해 설립된 환경 IT 융합
              전문기업입니다.
            </p>
            <p className="mt-5 max-w-2xl text-body-sm text-white/80">
              유무선 통신과 금융이 만나 모바일 뱅킹이 되었듯, 저희는 환경과 IT의
              융합을 통하여 기후위기 대응과 탄소중립 실현에 기여하는 솔루션을
              제공합니다.
            </p>
          </Reveal>
        </div>

        {/* 신뢰 지표 — 기존 OUR HISTORY 밴드 병합 */}
        <Reveal delay={0.12}>
          <dl className="mt-16 grid grid-cols-1 border-t border-white/12 sm:mt-20 sm:grid-cols-3">
            {MILESTONES.map((m, i) => (
              <div
                key={m.value}
                className={`py-8 sm:py-10 ${
                  i > 0
                    ? "border-t border-white/12 sm:border-t-0 sm:border-l sm:border-white/12 sm:pl-10"
                    : "sm:pr-10"
                }`}
              >
                <dt className="font-display text-5xl font-extrabold leading-none text-white lg:text-hero">
                  {m.value}
                </dt>
                <dd className="mt-4">
                  <p className="text-item font-bold text-white">{m.label}</p>
                  <p className="mt-1 text-detail text-white/60">{m.note}</p>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
