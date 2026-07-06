import Image from "next/image";
import { SectionLabel } from "@/shared/ui";

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
 * CI of E3 섹션. 연녹(tint) 밴드로 다크 비전 밴드 다음에 브랜드 마크를
 * 제시한다. 좌: 로고 변형 2×2 그리드 / 우: 개념 원문 + 심볼 의미.
 * 정적 콘텐츠뿐 — 서버 컴포넌트.
 *
 * 로고 2×2 배치:
 *  윗줄 — 일반 로고 / 색상 이미지 (투명 배경 → 흰 패널에 object-contain)
 *  아랫줄 — 다크 / 그라디언트 (배경 내장 이미지 → 타일을 꽉 채움 object-cover)
 */
export function CiSection() {
  return (
    <section className="bg-tint py-16 lg:py-25">
      <div className="content-container">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* 로고 변형 2×2 */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {/* 윗줄 좌: 일반 로고 */}
            <div className="flex aspect-3/2 items-center justify-center rounded-image border border-hairline bg-surface-white p-6">
              <Image
                src="/images/E3_Logo.png"
                alt="이쓰리 로고"
                width={200}
                height={100}
                className="max-h-full w-auto max-w-full object-contain"
              />
            </div>
            {/* 윗줄 우: 색상 이미지 */}
            <div className="flex aspect-3/2 items-center justify-center rounded-image border border-hairline bg-surface-white p-6">
              <Image
                src="/images/E3_color.png"
                alt="이쓰리 브랜드 색상"
                width={80}
                height={100}
                className="max-h-full w-auto max-w-full object-contain"
              />
            </div>
            {/* 아랫줄 좌: 다크 배경용 로고 (배경 내장) */}
            <div className="aspect-3/2 overflow-hidden rounded-image border border-hairline">
              <Image
                src="/images/E3_Logo_dark.png"
                alt="이쓰리 로고 (다크 배경용)"
                width={143}
                height={100}
                className="h-full w-full object-cover"
              />
            </div>
            {/* 아랫줄 우: 그라디언트 로고 (배경 내장) */}
            <div className="aspect-3/2 overflow-hidden rounded-image border border-hairline">
              <Image
                src="/images/E3_Logo_gradient.png"
                alt="이쓰리 로고 (그라디언트)"
                width={143}
                height={100}
                className="h-full w-full object-cover"
              />
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
