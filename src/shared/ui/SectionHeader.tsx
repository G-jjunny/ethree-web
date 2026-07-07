import type { ReactNode } from "react";
import { SectionLabel } from "./SectionLabel";

type SectionHeaderTone = "light" | "dark" | "olive";
type SectionHeaderLevel = "h1" | "h2";

export interface SectionHeaderProps {
  /** 섹션 eyebrow 라벨(대문자 소형 라벨). */
  eyebrow: ReactNode;
  /** 헤딩 텍스트. 다행 헤딩은 <br /> 포함 ReactNode 전달. */
  title: ReactNode;
  /** 선택. 헤딩 아래 리드 설명(stacked 헤더에서만 사용). split 헤더는 설명을 형제로 둔다. */
  description?: ReactNode;
  /**
   * 배경 톤에 맞춘 색상 세트:
   * light(크림/화이트: olive 라벨·ink 헤딩) ·
   * dark(다크 ink: accent 라벨·white 헤딩) ·
   * olive(올리브 밴드: olive-soft 라벨·white 헤딩)
   */
  tone?: SectionHeaderTone;
  /** 헤딩 레벨. 페이지 최상위 밴드 헤딩이면 h1, 일반 섹션은 h2(기본). */
  as?: SectionHeaderLevel;
  /** 루트 래퍼 클래스(max-w-*, mb-*, border-b 등 소비처 레이아웃 조정). */
  className?: string;
  /** 설명 문단 추가 클래스(max-w-* 등). */
  descriptionClassName?: string;
}

/**
 * 섹션 헤더 공용 컴포넌트(eyebrow SectionLabel + 헤딩 + 선택 설명).
 * 전 뷰에서 반복되던 `SectionLabel + h2(font-display mt-4 text-h2 font-extrabold)` 패턴을
 * 단일 소스로 통합해 정보 위계(디자인 원칙 1)를 전 페이지 일관 적용한다.
 * 색상/스케일/여백은 전부 design.md 토큰만 사용(하드코딩 없음).
 * split 레이아웃(헤딩 좌 · 설명 우)에서는 description 없이 사용하고 설명을 형제로 둔다.
 */
const TONE: Record<
  SectionHeaderTone,
  { label: "olive" | "accent" | "olive-soft"; heading: string; description: string }
> = {
  light: { label: "olive", heading: "text-ink", description: "text-ink-soft" },
  dark: { label: "accent", heading: "text-white", description: "text-white/80" },
  olive: {
    label: "olive-soft",
    heading: "text-white",
    description: "text-white/80",
  },
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  tone = "light",
  as = "h2",
  className,
  descriptionClassName,
}: SectionHeaderProps) {
  const toneSet = TONE[tone];
  const Heading = as;
  const headingSize = as === "h1" ? "text-h1" : "text-h2";

  const descriptionClasses = [
    "mt-6 text-body-sm",
    toneSet.description,
    descriptionClassName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={className}>
      <SectionLabel color={toneSet.label}>{eyebrow}</SectionLabel>
      <Heading
        className={`font-display mt-4 ${headingSize} font-extrabold ${toneSet.heading}`}
      >
        {title}
      </Heading>
      {description && <p className={descriptionClasses}>{description}</p>}
    </div>
  );
}
