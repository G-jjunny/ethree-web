import Image from "next/image";
import { SectionLabel } from "@/shared/ui";
import { SITE } from "@/shared/constants";

/**
 * CEO 인사 도입부(1~3문단). 다크(ink) 밴드 위에 프레임 포트레이트 카드 +
 * 대형 인사 카피를 배치한 매거진식 "대표 서신" 모먼트.
 * 사진 원본이 작으므로(210×271) 프레임된 인물 카드로 의도화해 정제돼 보이게 한다.
 * 정적 텍스트/이미지뿐 — 서버 컴포넌트.
 */
export function CeoIntroSection() {
  return (
    <section className="relative overflow-hidden bg-ink py-16 lg:py-25">
      {/* 장식 원형 (랜딩 WhoWeAre 톤과 일관성) */}
      <div
        className="pointer-events-none absolute -top-32 -right-24 h-96 w-96 rounded-full bg-white/5"
        aria-hidden
      />
      <div className="content-container relative">
        {/* token 없음: CEO 사진 실제 폭 210px 고정 컬럼(에셋 원본 치수) */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[210px_1fr] lg:items-start lg:gap-20">
          <figure className="flex flex-col items-center gap-5 lg:items-start">
            <div className="rounded-image border border-white/20 bg-white/5 p-2">
              <Image
                src="/images/ceo-portrait.gif"
                alt={`이쓰리 대표이사 ${SITE.ceo}`}
                width={210}
                height={271}
                unoptimized
                className="rounded-image"
              />
            </div>
            <figcaption className="text-center lg:text-left">
              <p className="text-item font-bold text-white">{SITE.ceo}</p>
              <p className="mt-1 text-detail text-white/60">대표이사</p>
            </figcaption>
          </figure>

          <div className="lg:pt-1.5">
            <SectionLabel color="accent">CEO MESSAGE</SectionLabel>
            <p className="mt-6 text-h3 font-bold text-white lg:text-h2">
              안녕하십니까? 주식회사{" "}
              <strong className="font-bold text-brand">이쓰리(E3)</strong>{" "}
              대표이사 {SITE.ceo}입니다.
            </p>
            <p className="mt-8 max-w-2xl text-body-sm text-white/80">
              이쓰리는{" "}
              <strong className="font-bold text-brand">
                &apos;ECO(자연 환경)&apos;
              </strong>
              ,{" "}
              <strong className="font-bold text-brand">
                &apos;ENVIRONMENT(문명 환경)&apos;
              </strong>
              ,{" "}
              <strong className="font-bold text-brand">
                &apos;EDUCATION(환경 교육)&apos;
              </strong>
              의 세 가지 가치를 기반으로, 우리가 살고 있는 현재의 공간을
              보전하고 미래세대에게 건강하고 쾌적한 환경을 물려주는 것을 목표로
              설립된 환경 IT 융합 전문기업입니다.
            </p>
            <p className="mt-6 max-w-2xl text-body-sm text-white/80">
              &apos;융합&apos;이란 서로 다른 두 요소가 하나로 어우러지는
              과정입니다. 유무선 통신과 금융이 만나 모바일 뱅킹이 되었듯,
              저희는 환경과 IT의 융합을 통하여 기후위기 대응과 탄소중립 실현에
              기여하는 솔루션을 제공합니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
