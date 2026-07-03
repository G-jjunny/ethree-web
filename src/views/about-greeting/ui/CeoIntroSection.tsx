import Image from "next/image";
import { SITE } from "@/shared/constants";

/**
 * CEO 사진 + 인사말 도입부(1~3문단: 인사 / 소개(핵심가치 언급) / 융합 철학).
 * 정적 텍스트/이미지뿐 — 서버 컴포넌트.
 */
export function CeoIntroSection() {
  return (
    <section className="bg-surface pb-16 lg:pb-25">
      <div className="content-container">
        {/* token 없음: CEO 사진 실제 폭 210px 고정 컬럼(에셋 원본 치수) */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[210px_1fr] lg:items-start lg:gap-16">
          <figure className="flex flex-col items-center gap-5 lg:items-start">
            <Image
              src="/images/ceo-portrait.gif"
              alt={`이쓰리 대표이사 ${SITE.ceo}`}
              width={210}
              height={271}
              unoptimized
              className="rounded-image border border-hairline"
            />
            <figcaption className="text-center lg:text-left">
              <p className="text-item font-bold text-ink">{SITE.ceo}</p>
              <p className="mt-1 text-detail text-ink-soft">대표이사</p>
            </figcaption>
          </figure>

          <div>
            <p className="text-lead text-ink">
              안녕하십니까? 주식회사 이쓰리(E3) 대표이사 {SITE.ceo}입니다.
            </p>
            <p className="mt-6 text-body-sm text-ink-soft">
              이쓰리는 &apos;ECO(자연 환경)&apos;, &apos;ENVIRONMENT(문명
              환경)&apos;, &apos;EDUCATION(환경 교육)&apos;의 세 가지 가치를
              기반으로, 우리가 살고 있는 현재의 공간을 보전하고 미래세대에게
              건강하고 쾌적한 환경을 물려주는 것을 목표로 설립된 환경 IT 융합
              전문기업입니다.
            </p>
            <p className="mt-6 text-body-sm text-ink-soft">
              &apos;융합&apos;이란 서로 다른 두 요소가 하나로 어우러지는
              과정입니다. 유무선 통신과 금융이 만나 모바일 뱅킹이 되었듯,
              저희는 환경과 IT의 융합을 통하여 기후위기 대응과 탄소중립
              실현에 기여하는 솔루션을 제공합니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
