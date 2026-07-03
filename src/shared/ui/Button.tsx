import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "dark" | "outline";
type ButtonSize = "sm" | "md";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary: 브랜드 라임 pill · dark: 잉크 pill · outline: 투명+보더(다크 배경용) */
  variant?: ButtonVariant;
  /** sm: 헤더/네비 · md: 히어로·섹션 CTA */
  size?: ButtonSize;
  children: ReactNode;
}

const BASE =
  "inline-flex items-center justify-center rounded-pill font-display font-bold whitespace-nowrap transition-colors duration-fast ease-out disabled:opacity-50 disabled:pointer-events-none";

const VARIANT: Record<ButtonVariant, string> = {
  primary: "bg-brand text-brand-ink hover:bg-brand-hover",
  dark: "bg-ink text-white hover:opacity-90",
  outline: "bg-transparent border border-white/40 text-white hover:bg-white/10",
};

const SIZE: Record<ButtonSize, string> = {
  sm: "px-6 py-2.5 text-eyebrow",
  md: "px-7 py-3.5 text-sm",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = [BASE, VARIANT[variant], SIZE[size], className]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
