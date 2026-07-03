import { SectionLabel } from "./SectionLabel";

export type IconCardShape = "rounded-square" | "diamond" | "circle";

export interface IconCardProps {
  /** 카드 상단 아이콘 도형 */
  shape: IconCardShape;
  /** 카드 상단 소형 라벨 (번호 "01" 등) */
  label: string;
  title: string;
  /** 선택. 본문 설명 (없으면 아이콘/라벨/제목 + items만 렌더링) */
  description?: string;
  /** 선택. 세부 불릿 목록 */
  items?: readonly string[];
  className?: string;
}

const SHAPE_CLASS: Record<IconCardShape, string> = {
  "rounded-square": "h-5.5 w-5.5 rounded-card border-2 border-olive-label",
  diamond: "h-5 w-5 rotate-45 rounded-card bg-olive-label",
  circle: "h-5.5 w-5.5 rounded-full border-2 border-olive-label",
};

/**
 * 라이트 배경 카드(아이콘 원 + 번호 라벨 + 제목 + 설명/불릿).
 * BusinessSection(landing)의 3카드 패턴을 공용화한 것 — 라이트 배경에서
 * 아이콘+번호+제목+설명(+선택적 불릿 목록) 구조가 3곳 이상 반복되어 추출.
 */
export function IconCard({
  shape,
  label,
  title,
  description,
  items,
  className,
}: IconCardProps) {
  const classes = [
    "flex flex-col gap-5 rounded-card border border-hairline bg-surface-white px-8 py-10",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={classes}>
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-tint">
        <div className={SHAPE_CLASS[shape]} />
      </div>
      <SectionLabel color="olive-muted" size="sm">
        {label}
      </SectionLabel>
      <h3 className="text-xl font-bold text-ink">{title}</h3>
      {description && (
        <p className="text-detail text-ink-soft">{description}</p>
      )}
      {items && items.length > 0 && (
        <ul className="flex flex-col gap-2.5 border-t border-hairline pt-5">
          {items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2.5 text-detail text-ink-soft"
            >
              <span
                aria-hidden
                className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-olive-muted"
              />
              {item}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
