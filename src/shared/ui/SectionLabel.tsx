import type { ReactNode } from "react";

type SectionLabelColor =
  | "accent" // 다크 배경 위 라임 포인트 (히어로/서비스 eyebrow)
  | "olive" // 라이트 배경 위 (뉴스/사업 eyebrow)
  | "olive-soft" // 올리브/다크 밴드 위 (WHO WE ARE eyebrow)
  | "olive-muted" // 라이트 카드 번호 라벨 (01/02/03)
  | "ink" // 회색(muted) 패널 위 고대비 라벨
  | "muted"; // 다크 배경 위 저대비 라벨 (푸터 컬럼 라벨)

type SectionLabelSize = "sm" | "md";

export interface SectionLabelProps {
  children: ReactNode;
  /** 배경에 맞춘 텍스트 색상 */
  color?: SectionLabelColor;
  /** md: 섹션 eyebrow(13px/.2em) · sm: 소형 라벨(12px/.14em) */
  size?: SectionLabelSize;
  className?: string;
}

const COLOR: Record<SectionLabelColor, string> = {
  accent: "text-accent",
  olive: "text-olive-label",
  "olive-soft": "text-olive-soft",
  "olive-muted": "text-olive-muted",
  ink: "text-ink",
  muted: "text-white/40",
};

const SIZE: Record<SectionLabelSize, string> = {
  sm: "text-xs tracking-label",
  md: "text-eyebrow tracking-eyebrow",
};

export function SectionLabel({
  children,
  color = "accent",
  size = "md",
  className,
}: SectionLabelProps) {
  const classes = [
    "font-display font-bold uppercase",
    COLOR[color],
    SIZE[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <span className={classes}>{children}</span>;
}
