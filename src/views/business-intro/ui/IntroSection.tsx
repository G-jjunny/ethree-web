import { SectionLabel } from "@/shared/ui";

/**
 * 사업 개요 리드 섹션. 크림 밴드(bg-surface)에서 이쓰리 사업의 큰 그림을
 * 한 문단으로 제시하고, 아래 다크 사업영역 밴드로 자연스럽게 넘긴다.
 * 정적 텍스트뿐 — 서버 컴포넌트.
 */
export function IntroSection() {
  return (
    <section className="bg-surface pb-16 lg:pb-24">
      <div className="content-container">
        <div className="flex flex-wrap items-end justify-between gap-10 border-t border-hairline pt-16 lg:pt-20">
          <div>
            <SectionLabel color="olive">BUSINESS OVERVIEW</SectionLabel>
            <h2 className="font-display mt-4 text-h2 font-extrabold text-ink">
              환경과 IT를 잇는
              <br />
              융합 서비스 전문기업
            </h2>
          </div>
          <p className="max-w-md text-body-sm text-ink-soft">
            이쓰리는 환경IT 분야의 전문가 그룹으로, 대국민 서비스와 행정업무
            통합관리를 위한 시스템 구축부터 환경 정보시스템의 기획·개발·운영,
            그리고 환경 분야 연구개발과 컨설팅까지 아우르는 사업을 수행합니다.
          </p>
        </div>
      </div>
    </section>
  );
}
