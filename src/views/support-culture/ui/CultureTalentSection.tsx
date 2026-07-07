import { SectionLabel } from "@/shared/ui";
import { TALENT_TRAITS } from "./support-culture.data";

/**
 * 인재상 섹션 — 이미지 + 텍스트(3가지 인재 특성) 블록.
 * 좌측 이미지 슬롯 + 우측 특성 목록의 에디토리얼 2열 레이아웃(모바일 세로 스택).
 * 이미지는 placeholder이며 next/image 교체 슬롯 주석을 둔다. 서버 컴포넌트.
 */
export function CultureTalentSection() {
  return (
    <section className="bg-surface-white py-16 lg:py-25">
      <div className="content-container">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
          {/* next/image 교체 슬롯: 인재상 대표 이미지(관리자 업로드 대상, Phase 3).
              지금은 placeholder 회색 박스로 대체한다. */}
          <div className="flex h-64 items-center justify-center overflow-hidden rounded-image bg-tint lg:h-96">
            <span className="font-display text-mini tracking-label text-olive-muted">
              CULTURE IMAGE PLACEHOLDER
            </span>
          </div>

          <div>
            <SectionLabel color="olive">OUR PEOPLE</SectionLabel>
            <h2 className="font-display mt-4 text-h2 font-extrabold text-ink">
              이쓰리가 함께하고
              <br />
              싶은 사람
            </h2>
            <p className="mt-6 max-w-xl text-body-sm text-ink-soft">
              환경과 기술에 대한 진심으로 함께 성장하며 더 나은 내일을 만들어 갈
              동료를 찾습니다.
            </p>

            <ul className="mt-10 flex flex-col divide-y divide-hairline border-y border-hairline">
              {TALENT_TRAITS.map((trait) => (
                <li key={trait.no} className="flex gap-6 py-6">
                  <span className="font-display text-item font-extrabold text-olive-muted">
                    {trait.no}
                  </span>
                  <div>
                    <h3 className="text-item font-bold text-ink">
                      {trait.title}
                    </h3>
                    <p className="mt-2 text-detail text-ink-soft">
                      {trait.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
