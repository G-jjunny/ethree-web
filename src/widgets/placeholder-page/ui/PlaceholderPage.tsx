import { PlaceholderHeader } from "./PlaceholderHeader";

export interface PlaceholderPageProps {
  /** 소형 라벨, 예: "ABOUT E3" */
  eyebrow: string;
  /** 페이지 제목, 예: "인사말" */
  title: string;
  /** 선택. 제목 아래 리드 문구 */
  description?: string;
}

/**
 * 콘텐츠가 아직 없는 서브페이지 공용 placeholder.
 * 크림 배경(bg-surface) + eyebrow/title(+description) + "콘텐츠 준비 중" 안내 카드.
 * 상호작용 없음 — 서버 컴포넌트로 사용 가능.
 */
export function PlaceholderPage({
  eyebrow,
  title,
  description,
}: PlaceholderPageProps) {
  return (
    <section className="bg-surface py-25 lg:py-30">
      <div className="content-container">
        <PlaceholderHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
        />

        <div className="mx-auto mt-14 flex w-full max-w-md flex-col items-center gap-3 rounded-card border border-dashed border-hairline bg-surface-white px-8 py-14">
          <span className="text-detail font-medium text-ink-soft">
            콘텐츠 준비 중입니다.
          </span>
          <span className="text-meta text-muted">
            빠른 시일 내에 업데이트하겠습니다.
          </span>
        </div>
      </div>
    </section>
  );
}
