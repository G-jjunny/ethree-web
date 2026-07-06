import { SectionLabel } from "@/shared/ui";

/**
 * 함께해온 기관. 연혁·뉴스 원문에 문서화된 협력·발주·수상 기관에서만 추린
 * 목록으로, 임의 창작 없이 근거 있는 이름만 담는다(로고 없이 텍스트).
 */
const PARTNERS: readonly string[] = [
  "환경부",
  "국토교통부",
  "조달청",
  "한국환경연구원",
  "유역환경청",
  "정몽구재단",
  "고려대학교 오정리질리언스연구원",
  "서울대학교 보건대학원",
  "벤처기업협회",
  "한국산업기술진흥협회",
  "소프트웨어산업협회",
];

/**
 * 협력 기관 그리드. 올리브 밴드로 배경 리듬을 닫고 신뢰 요소를 더한다.
 * 정적 텍스트뿐 — 서버 컴포넌트.
 */
export function PartnersSection() {
  return (
    <section className="relative overflow-hidden bg-olive py-16 lg:py-25">
      {/* 장식 원형 */}
      <div
        className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full border border-white/10"
        aria-hidden
      />
      <div className="content-container relative">
        <div className="max-w-2xl">
          <SectionLabel color="olive-soft">PARTNERS</SectionLabel>
          <h2 className="font-display mt-4 text-h2 font-extrabold text-white">
            함께해온 기관
          </h2>
          <p className="mt-6 text-body-sm text-white/80">
            환경부를 비롯한 공공기관·연구기관·학계와 협력하며 환경 IT 융합의
            현장을 함께 만들어 왔습니다.
          </p>
        </div>

        <ul className="mt-14 grid grid-cols-2 gap-px border border-white/12 bg-white/12 sm:grid-cols-3 lg:grid-cols-4">
          {PARTNERS.map((partner) => (
            <li
              key={partner}
              className="flex min-h-24 items-center bg-olive px-6 py-8 text-item font-bold text-white"
            >
              {partner}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
