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
 * 사업 개요 섹션. full-bleed 다크 배경 사진 위에 좌측 불투명 회색 패널(스택형
 * 섹션 헤더)과 우측 SI/R&D/Consulting 번호 프리뷰(지그재그)를 오버레이한다.
 * 좌측 패널은 섹션 높이에 stretch되어 우측 번호 영역과 경계가 맞닿는다(gap-0).
 * 배경 이미지는 뷰포트 폭을 꽉 채우고, 내부 콘텐츠만 content-container로 감싼다.
 * 상세는 아래 BusinessAreasSection(다크 밴드). 정적 콘텐츠뿐 — 서버 컴포넌트.
 */
export function IntroSection() {
  return (
    <section className="relative overflow-hidden bg-ink">
      {/* full-bleed 배경 이미지 교체 슬롯 — 실제 에셋 확보 시 아래 placeholder를
          next/image로 교체:
          <Image src="/images/business-overview.png" alt="" aria-hidden fill
            sizes="100vw" className="pointer-events-none object-cover object-center" /> */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white/5"
      >
        <span className="font-display text-mini tracking-label text-white/40">
          BUSINESS IMAGE PLACEHOLDER
        </span>
      </div>

      {/* 스크림: 배경 이미지 위 우측 번호 가독성 확보 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-ink/55"
      />

      <div className="relative content-container">
        {/* token 없음: 섹션 최소 높이 560px — full-bleed 사진 밴드의 세로 비율 */}
        <div className="grid grid-cols-1 lg:min-h-[560px] lg:grid-cols-2">
          {/* 좌측 — 불투명 회색 패널(스택형 섹션 헤더, 콘텐츠 하단 정렬) */}
          <div className="flex flex-col justify-end bg-muted p-8 lg:p-12">
            <SectionLabel color="ink" size="sm">
              BUSINESS OVERVIEW
            </SectionLabel>
            <h2 className="mt-4 font-display text-h2 font-extrabold text-ink">
              환경과 IT를 잇는
              <br />
              융합 서비스 전문기업
            </h2>
            <p className="mt-6 max-w-md text-body-sm text-ink">
              이쓰리는 환경IT 분야의 전문가 그룹으로, 대국민 서비스와 행정업무
              통합관리를 위한 시스템 구축부터 환경 정보시스템의 기획·개발·운영,
              그리고 환경 분야 연구개발과 컨설팅까지 아우르는 사업을 수행합니다.
            </p>
          </div>

          {/* 우측 — 배경 이미지 위 번호 프리뷰(모바일 세로 스택 / lg+ 지그재그) */}
          <div className="relative flex flex-col gap-8 p-8 lg:block lg:p-12">
            {BUSINESS_AREAS.map((area, index) => (
              <div key={area.no} className={`${ZIGZAG_LG[index]} lg:w-56`}>
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
