import type { HistoryCategory } from "@/shared/lib";

interface HistoryCategoryTagProps {
  category: HistoryCategory;
}

/**
 * 연혁 이벤트 유형 태그. 라이트(surface) 밴드 위에서 읽히도록
 * 팔레트가 그린 모노톤인 점을 고려해 hairline 보더 + 톤이 구분되는
 * 텍스트 토큰으로 4개 카테고리를 구별한다(색상 신규 추가 없음).
 * 색보다 라벨 텍스트가 1차 식별자다.
 * 타임라인 섹션 전용 표현이라 shared/ui가 아닌 view 로컬에 둔다.
 */
const CATEGORY_META: Record<
  HistoryCategory,
  { label: string; className: string }
> = {
  patent: { label: "특허", className: "text-olive-label border-olive-label/40" },
  award: {
    label: "수상·표창",
    className: "text-olive-muted border-olive-muted/50",
  },
  cert: { label: "인증·등록", className: "text-ink-soft border-ink-soft/30" },
  business: { label: "사업·연구", className: "text-muted border-muted/40" },
};

export function HistoryCategoryTag({ category }: HistoryCategoryTagProps) {
  const meta = CATEGORY_META[category];

  return (
    <span
      className={`font-display inline-flex shrink-0 items-center rounded-pill border px-2.5 py-0.5 text-xs font-medium ${meta.className}`}
    >
      {meta.label}
    </span>
  );
}
