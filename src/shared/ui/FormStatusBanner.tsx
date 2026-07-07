import type { ReactNode } from "react";

type FormStatusBannerVariant = "error" | "success";

export interface FormStatusBannerProps {
  children: ReactNode;
  /** error: 검증/실패 상태(text-danger, role=alert) · success: 성공 상태(bg-tint, role=status) */
  variant: FormStatusBannerVariant;
  className?: string;
}

/**
 * 폼 제출 상태 배너(성공/에러) 공용 컴포넌트.
 * 여러 관리자/공개 폼에서 반복되던 hairline 박스 + 상태 색상 마크업을 통합한다.
 * error → role="alert" · text-danger, success → role="status" · bg-tint · text-olive-label.
 * 색상/보더/라운드는 전부 design.md 토큰만 사용(하드코딩 없음).
 */
const VARIANT: Record<FormStatusBannerVariant, string> = {
  error: "text-danger",
  success: "bg-tint text-olive-label",
};

export function FormStatusBanner({
  children,
  variant,
  className,
}: FormStatusBannerProps) {
  const classes = [
    "rounded-card border border-hairline px-4 py-3 text-detail",
    VARIANT[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <p role={variant === "error" ? "alert" : "status"} className={classes}>
      {children}
    </p>
  );
}
