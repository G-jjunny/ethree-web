import { SectionLabel } from "@/shared/ui";
import { BUSINESS_AREAS } from "./business-areas.data";

/**
 * lg+ 지그재그 좌표(01 상단-좌 / 02 중단-우 / 03 하단-좌).
 * 색·스페이싱 토큰과 무관한 순수 레이아웃 좌표라 arbitrary 값을 사용한다.
 */
const ZIGZAG_LG: readonly string[] = [
  "lg:absolute lg:left-12 lg:top-[44%]" /* token 없음: 지그재그 좌표(01 상단-좌) */,
  "lg:absolute lg:right-12 lg:top-[60%]" /* token 없음: 지그재그 좌표(02 중단-우) */,
  "lg:absolute lg:bottom-12 lg:left-12" /* token 없음: 지그재그 좌표(03 하단-좌) */,
];

/**
 * 좌측 정의(dictionary) 카드. 밝은 카드 위에 대형 디스플레이 워드 OVERVIEW와
 * 발음기호풍 장식 태그, hairline 구분선, 기존 개요 문단(원문 무변경)을 담는다.
 * lg+에서는 우측 다크 패널과 높이를 맞추고 정의 블록을 카드 하단으로 정렬한다.
 */
function OverviewCard() {
  return (
    <div className="flex flex-col rounded-image border border-hairline bg-surface-white p-8 lg:p-12">
      <SectionLabel color="olive" size="sm">
        BUSINESS OVERVIEW
      </SectionLabel>

      <div className="mt-12 lg:mt-auto">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <span className="font-display text-h1 font-extrabold uppercase tracking-headline text-ink lg:text-hero">
            OVERVIEW
          </span>
          {/* 순수 장식 발음기호 태그 — 스크린리더 제외 */}
          <span aria-hidden className="font-display text-item text-muted">
            [ˈəʊ.və.vjuː]
          </span>
        </div>

        <div className="mt-8 border-t border-hairline pt-8">
          <p className="text-body-sm text-ink-soft">
            이쓰리는 환경IT 분야의 전문가 그룹으로, 대국민 서비스와 행정업무
            통합관리를 위한 시스템 구축부터 환경 정보시스템의 기획·개발·운영,
            그리고 환경 분야 연구개발과 컨설팅까지 아우르는 사업을 수행합니다.
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * 우측 다크 이미지 패널. next/image 교체 슬롯 위에 좌상단 대형 제목(원문 유지)과
 * SI/R&D/Consulting 사업영역 번호 프리뷰를 얹는다. 모바일은 세로 스택,
 * lg+에서는 지그재그로 절대 배치한다. 상세는 아래 BusinessAreasSection.
 */
function OverviewPanel() {
  return (
    <div className="relative overflow-hidden rounded-image bg-ink p-8 lg:min-h-[560px] lg:p-12">
      {/* token 없음: 패널 최소 높이 560px, 정의 카드와 균형을 맞추는 레이아웃 값 */}

      {/* next/image 교체 슬롯: 사업 개요 대표 이미지 */}
      <div
        aria-hidden
        className="absolute inset-0 flex items-center justify-center bg-white/5"
      >
        <span className="font-display text-mini tracking-label text-white/40">
          BUSINESS IMAGE PLACEHOLDER
        </span>
      </div>

      <h2 className="relative font-display text-h2 font-extrabold text-white">
        환경과 IT를 잇는
        <br />
        융합 서비스 전문기업
      </h2>

      <div className="mt-12 flex flex-col gap-8 lg:mt-0 lg:block">
        {BUSINESS_AREAS.map((area, index) => (
          <div key={area.no} className={`${ZIGZAG_LG[index]} lg:w-56`}>
            <span className="font-display text-mega font-extrabold leading-none text-accent/35">
              {area.no}
            </span>
            <div className="mt-3 border-t border-white/12 pt-3">
              <span className="font-display text-sm uppercase tracking-label text-white/80">
                {area.title}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 사업 개요 리드 섹션. 크림 밴드(bg-surface)에서 좌 정의 카드 / 우 다크 이미지
 * 패널의 2분할로 사업의 큰 그림을 제시하고, 아래 다크 사업영역 밴드로 넘긴다.
 * 우측 다크 블록은 라운드 카드로 담아 아래 다크 밴드와 뭉치지 않게 크림 여백을 둔다.
 * 정적 텍스트뿐 — 서버 컴포넌트.
 */
export function IntroSection() {
  return (
    <section className="bg-surface pb-16 lg:pb-24">
      <div className="content-container">
        <div className="border-t border-hairline pt-16 lg:pt-20">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
            <OverviewCard />
            <OverviewPanel />
          </div>
        </div>
      </div>
    </section>
  );
}
