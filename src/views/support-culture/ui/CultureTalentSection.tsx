import Image from "next/image";
import { SectionHeader } from "@/shared/ui";
import type { CultureItem } from "@/features/culture";

export interface CultureTalentSectionProps {
  /** group='talent' 항목(sortOrder asc). getCultureItems 파생. */
  items: readonly CultureItem[];
}

/**
 * 인재상 섹션 — 이미지 + 텍스트(인재 특성 목록) 블록.
 * 좌측 이미지 슬롯 + 우측 특성 목록의 에디토리얼 2열 레이아웃(모바일 세로 스택).
 * 항목은 DB(getCultureItems)에서 props로 주입받는다. 섹션 대표 이미지는 이미지가 있는
 * 첫 항목의 image_url을 사용하고, 없으면 기존 placeholder를 유지한다. 서버 컴포넌트.
 */
export function CultureTalentSection({ items }: CultureTalentSectionProps) {
  const image = items.find((it) => it.imageUrl)?.imageUrl ?? null;

  return (
    <section className="bg-surface-white py-16 lg:py-25">
      <div className="content-container">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
          <div className="relative flex h-64 items-center justify-center overflow-hidden rounded-image bg-tint lg:h-96">
            {image ? (
              <Image
                src={image}
                alt="인재상 대표 이미지"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
                unoptimized
              />
            ) : (
              <span className="font-display text-mini tracking-label text-olive-muted">
                CULTURE IMAGE PLACEHOLDER
              </span>
            )}
          </div>

          <div>
            <SectionHeader
              tone="light"
              eyebrow="OUR PEOPLE"
              title={
                <>
                  이쓰리가 함께하고
                  <br />
                  싶은 사람
                </>
              }
              description="환경과 기술에 대한 진심으로 함께 성장하며 더 나은 내일을 만들어 갈 동료를 찾습니다."
              descriptionClassName="max-w-xl"
            />

            <ul className="mt-10 flex flex-col divide-y divide-hairline border-y border-hairline">
              {items.map((trait) => (
                <li key={trait.id} className="flex gap-6 py-6">
                  {trait.label && (
                    <span className="font-display text-item font-extrabold text-olive-muted">
                      {trait.label}
                    </span>
                  )}
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
