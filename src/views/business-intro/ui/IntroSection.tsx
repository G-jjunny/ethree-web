import Image from "next/image";
import { SectionHeader } from "@/shared/ui";
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
    <section className="relative overflow-hidden bg-surface-white py-16 lg:py-25">
      {/* 우측 배경 이미지 — 섹션 오른쪽 절반을 뷰포트 우측 끝까지 채운다(full-bleed).
          content-container에 갇히지 않고 섹션 레벨에 깔린다. lg+에서 좌:밝음 / 우:사진
          으로 분할되고, 모바일에선 섹션 전체 뒤에 깔린 뒤 좌측 헤더 카드가 불투명
          배경으로 덮는다. 실제 에셋 교체 시 src만 바꾸면 된다. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 lg:left-1/2"
      >
        <Image
          src="/images/Ethree_info_bg.jpg"
          alt=""
          aria-hidden
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover object-center"
        />
        {/* 스크림: 이미지 위 번호 가독성 확보 */}
        <div className="absolute inset-0 bg-ink/55" />
      </div>

      <div className="relative content-container">
        {/* token 없음: 섹션 최소 높이 560px — 좌측 헤더 카드/우측 이미지 배경 밴드 비율 */}
        <div className="grid grid-cols-1 lg:min-h-[560px] lg:grid-cols-2">
          {/* 좌측 — 밝은 배경에 녹아드는 스택형 섹션 헤더(하단 정렬).
              모바일에선 뒤 배경 이미지를 덮도록 불투명 배경 유지. */}
          <SectionHeader
            className="relative flex flex-col justify-end bg-surface-white p-8 lg:p-12"
            tone="light"
            eyebrow="BUSINESS OVERVIEW"
            title={
              <>
                환경과 IT를 잇는
                <br />
                융합 서비스 전문기업
              </>
            }
            description="이쓰리는 환경IT 분야의 전문가 그룹으로, 대국민 서비스와 행정업무 통합관리를 위한 시스템 구축부터 환경 정보시스템의 기획·개발·운영, 그리고 환경 분야 연구개발과 컨설팅까지 아우르는 사업을 수행합니다."
            descriptionClassName="max-w-md"
          />

          {/* 우측 — 섹션 우측 배경 이미지 위 번호 프리뷰(모바일 세로 스택 / lg+ 지그재그) */}
          <div className="relative flex flex-col gap-8 p-8 lg:block lg:p-12">
            {BUSINESS_AREAS.map((area, index) => (
              <div
                key={area.no}
                className={`relative ${ZIGZAG_LG[index]} lg:w-56`}
              >
                <span className="font-display text-mega leading-none font-extrabold text-accent">
                  {area.no}
                </span>
                <div className="mt-3 border-t border-white/12 pt-3">
                  <span className="font-display text-sm tracking-label text-white uppercase">
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
