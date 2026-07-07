import { SectionLabel, IconCard } from "@/shared/ui";
import type { CultureItem } from "@/features/culture";

export interface CultureValuesSectionProps {
  /** group='value' 항목(sortOrder asc). getCultureItems 파생. */
  items: readonly CultureItem[];
}

/**
 * 핵심가치 섹션 — 공용 IconCard 그리드로 가치 항목을 나열한다.
 * landing BusinessSection / about-greeting과 동일한 라이트 카드 톤을 재사용한다.
 * 항목은 DB(getCultureItems)에서 props로 주입받는다. 서버 컴포넌트.
 */
export function CultureValuesSection({ items }: CultureValuesSectionProps) {
  return (
    <section className="bg-surface py-16 lg:py-25">
      <div className="content-container">
        <div className="mb-14 max-w-2xl lg:mb-16">
          <SectionLabel color="olive">CORE VALUES</SectionLabel>
          <h2 className="font-display mt-4 text-h2 font-extrabold text-ink">
            우리가 일하는
            <br />
            방식의 기준
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((value) => (
            <IconCard
              key={value.id}
              shape="diamond"
              label={value.label ?? ""}
              title={value.title}
              description={value.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
