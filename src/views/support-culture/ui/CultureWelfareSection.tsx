import Image from "next/image";
import { SectionHeader } from "@/shared/ui";
import type { CultureItem } from "@/features/culture";

export interface CultureWelfareSectionProps {
  /** group='welfare_intro' 단건(섹션 헤더 title/description + 배너 이미지). */
  intro: CultureItem | null;
  /** group='welfare' benefit 항목(sortOrder asc). */
  benefits: readonly CultureItem[];
}

/**
 * 복지·근무환경 섹션 — 올리브 밴드로 페이지 배경 리듬을 닫는다
 * (about-location DirectionsSection과 동일 톤). 좌측 리드 + 우측 복지 항목 그리드.
 * 인트로 텍스트/배너 이미지와 benefit 항목을 DB(getCultureItems)에서 props로 주입받는다.
 * 배너 이미지는 intro.imageUrl이 있으면 렌더, 없으면 기존 placeholder를 유지. 서버 컴포넌트.
 */
export function CultureWelfareSection({
  intro,
  benefits,
}: CultureWelfareSectionProps) {
  const bannerImage = intro?.imageUrl ?? null;

  return (
    <section className="relative overflow-hidden bg-olive py-16 lg:py-25">
      <div
        className="pointer-events-none absolute -top-40 -right-24 h-96 w-96 rounded-full border border-white/12"
        aria-hidden
      />
      <div className="content-container relative">
        {intro && (
          <SectionHeader
            className="max-w-2xl"
            tone="olive"
            eyebrow="WORK ENVIRONMENT"
            title={intro.title}
            description={intro.description}
          />
        )}

        <div className="relative mt-14 flex h-56 items-center justify-center overflow-hidden rounded-image bg-white/5 lg:h-72">
          {bannerImage ? (
            <Image
              src={bannerImage}
              alt="근무환경 대표 이미지"
              fill
              sizes="100vw"
              className="object-cover"
              unoptimized
            />
          ) : (
            <span className="font-display text-mini tracking-label text-white/40">
              WORKPLACE IMAGE PLACEHOLDER
            </span>
          )}
        </div>

        <div className="mt-14 grid grid-cols-1 gap-x-16 gap-y-10 border-t border-white/12 pt-14 sm:grid-cols-2">
          {benefits.map((benefit) => (
            <div key={benefit.id}>
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
