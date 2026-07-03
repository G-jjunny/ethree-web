import { SectionLabel } from "@/shared/ui";

interface PlaceholderHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
}

/**
 * PlaceholderPage/PlaceholderHub 공용 헤더 블록.
 * 내부 전용 컴포넌트 — index.ts로 export하지 않음.
 */
export function PlaceholderHeader({
  eyebrow,
  title,
  description,
}: PlaceholderHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <SectionLabel color="olive">{eyebrow}</SectionLabel>
      <h1 className="font-display mt-4 text-h1 font-extrabold text-ink">
        {title}
      </h1>
      {description && (
        <p className="mt-6 max-w-xl text-body-sm text-ink-soft">
          {description}
        </p>
      )}
    </div>
  );
}
