import { PlaceholderHeader } from "./PlaceholderHeader";
import { PlaceholderSubNav } from "./PlaceholderSubNav";

export interface PlaceholderHubLink {
  label: string;
  href: string;
}

export interface PlaceholderHubProps {
  /** 소형 라벨, 예: "ABOUT E3" */
  eyebrow: string;
  /** 허브 제목, 예: "About E3" */
  title: string;
  /** 선택. 제목 아래 리드 문구 */
  description?: string;
  /** 하위 서브페이지 링크 카드 목록 (NAV_GROUPS[n].children 대응) */
  links: readonly PlaceholderHubLink[];
}

/**
 * 허브 페이지(about/business/support) 공용 placeholder.
 * PlaceholderPage와 동일한 헤더 + `PlaceholderSubNav` 카드 그리드(activeHref 없이 호출 = 전부 비활성)를
 * 사용해 leaf 페이지의 서브내비게이션과 완전히 동일한 링크 그리드를 렌더링한다.
 * 상호작용은 Link뿐 — 서버 컴포넌트로 사용 가능.
 */
export function PlaceholderHub({
  eyebrow,
  title,
  description,
  links,
}: PlaceholderHubProps) {
  return (
    <section className="bg-surface py-25 lg:py-30">
      <div className="content-container">
        <PlaceholderHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
        />

        <PlaceholderSubNav siblings={links} />
      </div>
    </section>
  );
}
