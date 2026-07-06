import { SectionLabel } from "@/shared/ui";
import { SITE } from "@/shared/constants";

/** CI 개념 원문(변경 금지). 기존 홈페이지 CI of E3 섹션 카피. */
const CI_CONCEPT =
  "푸른 나뭇잎 안에 E와 3를 유기적으로 결합하여 환경의 미래를 만들어가는 E3의 이미지를 형상화하였습니다.";

interface CiMeaning {
  /** 심볼 요소 */
  symbol: string;
  /** 원문에서 도출한 의미(창작 금지 — 원문 문장 범위 내) */
  desc: string;
}

/** 심볼 의미 — CI_CONCEPT 문장에서만 도출(원문에 없는 내용 창작 금지). */
const CI_MEANINGS: readonly CiMeaning[] = [
  { symbol: "푸른 나뭇잎", desc: "환경" },
  { symbol: "E + 3", desc: "유기적 결합" },
  { symbol: "미래", desc: "환경의 미래를 만들어가는 이미지" },
];

/**
 * E3 CI 마크 — 디자인 시스템 기반 대체 표현.
 * 브랜드 그린 잎 형태(rounded-tl/br-full) 패널 안에 사이트 공용 "E3"
 * 워드마크(font-display extrabold)를 얹어 "푸른 나뭇잎 + E와 3의 유기적
 * 결합"을 은유한다. 잎맥 선으로 나뭇잎 모티프를 보강한다.
 * 실제 로고 raster 확보 시 이 마크 전체를 next/image로 교체한다.
 */
function E3Mark() {
  return (
    <div className="relative flex aspect-square w-full items-center justify-center rounded-tl-full rounded-br-full bg-brand">
      {/* 잎맥(midrib) — 잎의 두 꼭짓점을 잇는 대각선으로 나뭇잎 형태 은유 */}
      <span
        aria-hidden
        className="absolute h-px w-2/3 -rotate-45 bg-brand-ink/15"
      />
      <span className="font-display text-hero font-extrabold text-brand-ink">
        {SITE.nameEn}
      </span>
    </div>
  );
}

/**
 * CI of E3 섹션. 연녹(tint) 밴드로 다크 비전 밴드 다음에 브랜드 마크를
 * 깔끔하게 제시한다. 좌: E3 마크(흰 패널 위) / 우: 개념 원문 + 심볼 의미.
 * 정적 콘텐츠뿐 — 서버 컴포넌트.
 */
export function CiSection() {
  return (
    <section className="bg-tint py-16 lg:py-25">
      <div className="content-container">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* 마크: 실제 로고 이미지 확보 시 아래 흰 패널 내부를 next/image(/images/e3-logo.*)로 교체 */}
          <div className="flex justify-center lg:justify-start">
            <div className="w-full max-w-xs rounded-image bg-surface-white p-10 sm:p-14">
              <E3Mark />
            </div>
          </div>

          {/* 개념 + 심볼 의미 */}
          <div className="max-w-xl">
            <SectionLabel color="olive">CI OF E3</SectionLabel>
            <p className="mt-6 text-h3 font-bold text-ink lg:text-h2">
              {CI_CONCEPT}
            </p>

            <dl className="mt-10 grid grid-cols-1 gap-x-8 gap-y-6 border-t border-hairline pt-8 sm:grid-cols-3">
              {CI_MEANINGS.map((item) => (
                <div key={item.symbol}>
                  <dt className="font-display text-item font-bold text-ink">
                    {item.symbol}
                  </dt>
                  <dd className="mt-2 text-detail text-ink-soft">
                    {item.desc}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
