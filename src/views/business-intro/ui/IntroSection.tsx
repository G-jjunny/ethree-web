import Image from "next/image";
import { SectionLabel } from "@/shared/ui";
import { BUSINESS_AREAS } from "./business-areas.data";

/**
 * lg+ 지그재그 좌표(01 상단-좌 / 02 중단-우 / 03 하단-좌).
 * 색·스페이싱 토큰과 무관한 순수 레이아웃 좌표라 arbitrary 값을 사용한다.
 * top-[46%]만 arbitrary이며 나머지는 표준 스페이싱 토큰이다.
 */
const ZIGZAG_LG: readonly string[] = [
  "lg:absolute lg:left-12 lg:top-16" /* 01 상단-좌 */,
  "lg:absolute lg:right-12 lg:top-[46%]" /* token 없음: 지그재그 세로 좌표(02 중단-우) */,
  "lg:absolute lg:bottom-16 lg:left-12" /* 03 하단-좌 */,
];

/**
 * 사업 개요 섹션. 밝은(surface-white) 밴드 위에 좌측 스택형 섹션 헤더(섹션과 동일
 * 배경이라 종이처럼 녹아듦)와 우측 이미지 패널을 2단으로 배치한다. 배경 사진은
 * full-bleed가 아니라 우측 컬럼 내부에만 국소화되며, 그 위 어두운 스크림 → SI/R&D/
 * Consulting 번호 프리뷰(지그재그) 순으로 오버레이된다. 좌우 컬럼은 gap-0로 맞닿고
 * 그리드 stretch로 우측 이미지 패널이 섹션 높이를 채운다. 내부는 content-container.
 * 아래 BusinessAreasSection(다크 밴드)과 명암 대비로 자연 구분. 서버 컴포넌트.
 */
export function IntroSection() {
  return (
    <section className="bg-surface-white">
      <div className="content-container">
        {/* token 없음: 섹션 최소 높이 560px — 좌측 헤더 카드/우측 이미지 패널 밴드 비율 */}
        <div className="grid grid-cols-1 lg:min-h-[560px] lg:grid-cols-2">
          {/* 좌측 — 섹션과 동일 배경(밝음)에 녹아드는 스택형 섹션 헤더(하단 정렬) */}
          <div className="flex flex-col justify-end bg-surface-white p-8 lg:p-12">
            <SectionLabel color="olive">BUSINESS OVERVIEW</SectionLabel>
            <h2 className="mt-4 font-display text-h2 font-extrabold text-ink">
              환경과 IT를 잇는
              <br />
              융합 서비스 전문기업
            </h2>
            <p className="mt-6 max-w-md text-body-sm text-ink-soft">
              이쓰리는 환경IT 분야의 전문가 그룹으로, 대국민 서비스와 행정업무
              통합관리를 위한 시스템 구축부터 환경 정보시스템의 기획·개발·운영,
              그리고 환경 분야 연구개발과 컨설팅까지 아우르는 사업을 수행합니다.
            </p>
          </div>

          {/* 우측 — 이미지 배경 패널(각진 블록) 위 번호 프리뷰(모바일 세로 스택 / lg+ 지그재그) */}
          <div className="relative flex flex-col gap-8 overflow-hidden p-8 lg:block lg:p-12">
            {/* 우측 영역 한정 배경 이미지 — 장식용(alt="")이라 aria-hidden 처리 */}
            <Image
              src="/images/Ethree_info_bg.png"
              alt=""
              aria-hidden
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="pointer-events-none object-cover object-center"
            />

            {/* 스크림: 이미지 위 번호 가독성 확보 */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-ink/55"
            />

            {BUSINESS_AREAS.map((area, index) => (
              <div
                key={area.no}
                className={`relative ${ZIGZAG_LG[index]} lg:w-56`}
              >
                <span className="font-display text-mega font-extrabold leading-none text-accent">
                  {area.no}
                </span>
                <div className="mt-3 border-t border-white/12 pt-3">
                  <span className="font-display text-sm uppercase tracking-label text-white">
                    {area.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
