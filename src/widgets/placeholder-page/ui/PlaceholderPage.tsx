import { PlaceholderHeader } from "./PlaceholderHeader";
import { PlaceholderSubNav } from "./PlaceholderSubNav";
import type { PlaceholderSubNavItem } from "./PlaceholderSubNav";

export interface PlaceholderPageProps {
  /** 소형 라벨, 예: "ABOUT E3" */
  eyebrow: string;
  /** 페이지 제목, 예: "인사말" */
  title: string;
  /** 선택. 제목 아래 리드 문구 */
  description?: string;
  /** 선택. 형제 leaf 페이지 목록 — 주어지면 헤더 아래 탭 내비게이션 렌더링 */
  siblings?: readonly PlaceholderSubNavItem[];
  /** 선택. siblings 중 현재 페이지 href — 강조 표시에 사용 */
  activeHref?: string;
}

/**
 * 콘텐츠가 아직 없는 서브페이지 공용 placeholder.
 * 크림 배경(bg-surface) + eyebrow/title(+description) + "콘텐츠 준비 중" 안내 카드.
 * siblings가 주어지면 헤더 아래 형제 페이지 탭 내비게이션을 함께 렌더링한다.
 * 상호작용은 siblings의 Link뿐 — 서버 컴포넌트로 사용 가능.
 */
export function PlaceholderPage({
  eyebrow,
  title,
  description,
  siblings,
  activeHref,
}: PlaceholderPageProps) {
  return (
    <section className="bg-surface py-25 lg:py-30">
      <div className="content-container">
        <PlaceholderHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
        />

        {siblings && siblings.length > 0 && (
          <PlaceholderSubNav siblings={siblings} activeHref={activeHref} />
        )}

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
