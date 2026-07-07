import type { ReactNode } from "react";

type BadgeVariant = "active" | "muted";

export interface BadgeProps {
  children: ReactNode;
  /**
   * 조건부 상태 뱃지(디자인 원칙 3):
   * active(발행·진행 등 활성 상태: key color) · muted(초안·대기 등 비활성: 저대비 hairline).
   */
  variant?: BadgeVariant;
  className?: string;
}

/**
 * 조건부 상태 표시용 pill 뱃지(발행/초안 등).
 * 데이터의 상태(Status)를 key color로 직관 구분한다(디자인 원칙 3).
 * ※ 등록일·조회수·작성자 등 일반 정보성 값은 뱃지가 아니라 텍스트 + text-muted/text-meta로 표현한다.
 * 색상/보더/라운드는 전부 design.md 토큰만 사용(하드코딩 없음).
 */
const VARIANT: Record<BadgeVariant, string> = {
  active: "bg-tint text-olive-label",
  muted: "border border-hairline text-muted",
};

export function Badge({ children, variant = "active", className }: BadgeProps) {
  const classes = [
    "inline-flex items-center rounded-pill px-3 py-1 text-caption font-medium",
    VARIANT[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <span className={classes}>{children}</span>;
}
