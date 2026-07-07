export interface SupportNewsBodyProps {
  /**
   * 서버에서 이미 generateHTML + DOMPurify 새니타이즈를 거친 안전한 HTML.
   * (renderNewsBody 반환값 — 이 컴포넌트는 새니타이즈를 수행하지 않는다.)
   */
  html: string;
}

/**
 * 공개 News 상세 본문 렌더 영역 — 서버 컴포넌트.
 * 전달받은 HTML은 **이미 새니타이즈 완료**된 값이므로 prose 영역에 주입한다.
 * 마크업 톤(prose 타이포)은 design(polish)이 후속으로 다듬는다.
 */
export function SupportNewsBody({ html }: SupportNewsBodyProps) {
  return (
    <div
      className="prose mx-auto mt-12 w-full max-w-2xl border-t border-hairline pt-12"
      // html은 renderNewsBody에서 DOMPurify로 새니타이즈된 신뢰 가능한 값이다.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
