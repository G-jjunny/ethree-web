import { SectionLabel } from "@/shared/ui";

interface PlaceholderHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
}

/**
 * 섹션 진입/leaf 페이지 공용 헤더 블록(eyebrow + 제목 + 선택 설명).
 * 각 뷰(GreetingView 등)에서 직접 재사용하므로 index.ts로 공개한다.
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
