import { SectionLabel } from "@/shared/ui";
import { WELFARE } from "./support-culture.data";

/**
 * 복지·근무환경 섹션 — 올리브 밴드로 페이지 배경 리듬을 닫는다
 * (about-location DirectionsSection과 동일 톤). 좌측 리드 + 우측 복지 항목 그리드.
 * 이미지 슬롯은 상단 배너 placeholder로 두고 next/image 교체 슬롯 주석을 둔다.
 * 서버 컴포넌트.
 */
export function CultureWelfareSection() {
  return (
    <section className="relative overflow-hidden bg-olive py-16 lg:py-25">
      <div
        className="pointer-events-none absolute -top-40 -right-24 h-96 w-96 rounded-full border border-white/10"
        aria-hidden
      />
      <div className="content-container relative">
        <div className="max-w-2xl">
          <SectionLabel color="olive-soft">WORK ENVIRONMENT</SectionLabel>
          <h2 className="font-display mt-4 text-h2 font-extrabold text-white">
            {WELFARE.title}
          </h2>
          <p className="mt-6 text-body-sm text-white/80">
            {WELFARE.description}
          </p>
        </div>

        {/* next/image 교체 슬롯: 근무환경 대표 이미지(관리자 업로드 대상, Phase 3).
            지금은 placeholder 반투명 박스로 대체한다. */}
        <div className="mt-14 flex h-56 items-center justify-center overflow-hidden rounded-image bg-white/5 lg:h-72">
          <span className="font-display text-mini tracking-label text-white/40">
            WORKPLACE IMAGE PLACEHOLDER
          </span>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-x-16 gap-y-10 border-t border-white/12 pt-14 sm:grid-cols-2">
          {WELFARE.benefits.map((benefit) => (
            <div key={benefit.title}>
              <h3 className="text-item font-bold text-white">
                {benefit.title}
              </h3>
              <p className="mt-3 text-body-sm text-white/70">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
