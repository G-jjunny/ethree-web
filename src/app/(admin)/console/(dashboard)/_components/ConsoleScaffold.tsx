import { SectionLabel } from "@/shared/ui";

interface ConsoleScaffoldProps {
  /** 관리 페이지 제목 (예: "인사말 관리") */
  title: string;
  /** 무엇을 관리하는지 한 줄 안내 */
  description: string;
}

/**
 * 아직 편집 기능이 붙지 않은 관리 라우트용 재사용 스캐폴드(서버 컴포넌트).
 * 회사 정보 관리 페이지 톤(SectionLabel olive + font-display h2 + text-body-sm)을
 * 그대로 따르고, "준비 중" 안내 패널을 덧붙인다. 각 관리 page.tsx는
 * title/description만 전달하고, 실제 편집 폼은 Phase 2 이후 이 자리를 대체한다.
 */
export function ConsoleScaffold({ title, description }: ConsoleScaffoldProps) {
  return (
    <section className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <SectionLabel color="olive">Console</SectionLabel>
        <h1 className="font-display text-h2 font-extrabold text-ink">
          {title}
        </h1>
        <p className="text-body-sm text-ink-soft">{description}</p>
      </div>

      <div className="flex flex-col gap-3 rounded-card border border-hairline bg-surface-white p-8">
        <SectionLabel color="olive-muted" size="sm">
          준비 중
        </SectionLabel>
        <h2 className="font-display text-xl font-bold text-ink">
          곧 제공됩니다
        </h2>
        <p className="text-body-sm text-ink-soft">
          이 페이지의 편집 기능은 준비 중입니다. 공개 사이트에 노출되는
          콘텐츠를 이곳에서 직접 관리할 수 있도록 순차적으로 제공할 예정입니다.
        </p>
      </div>
    </section>
  );
}
