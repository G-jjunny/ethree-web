import { Button, SectionLabel } from "@/shared/ui";
import { SITE } from "@/shared/constants";
import { SiteHeader } from "@/widgets/site-header";

/**
 * 히어로. 다크 배경 이미지(placeholder) 위에 헤더 오버레이 + 하단 정렬 카피/CTA.
 * 배경은 추후 실제 포레스트 사진으로 교체 예정 → placeholder 레이어를 분리해 둔다.
 */
export function HeroSection() {
  return (
    <section className="relative flex min-h-190 w-full flex-col">
      {/* 배경 placeholder — 실제 사진 교체 자리 */}
      <div className="absolute inset-0 z-0 bg-ink" aria-hidden />
      <div
        className="absolute inset-0 z-10 bg-linear-to-b from-black/70 via-black/35 to-black/80"
        aria-hidden
      />

      <SiteHeader />

      <div className="relative z-20 flex flex-1 flex-col justify-end px-16 pb-21">
        {/* token 없음: 히어로 카피 컬럼 폭 900px, max-w-4xl(896px) 근사 */}
        <div className="max-w-4xl">
          <SectionLabel color="accent" className="tracking-hero">
            {SITE.tagline}
          </SectionLabel>
          <h1 className="font-display tracking-headline mt-5.5 text-hero font-extrabold text-white">
            ECO YOUR FUTURE,
            <br />
            OUR VISION.
          </h1>
          {/* token 없음: 리드문 폭 600px, max-w-xl(576px) 근사 */}
          <p className="mt-6 max-w-xl text-lead text-white/80">
            이쓰리는 10년 이상 환경 IT 분야의 전문가들이 만든 환경 IT 융합서비스
            으뜸 기업입니다. 환경 정책 연구부터 시스템 구축, 운영까지 — 전 국민의
            쾌적한 삶의 질 개선을 위해 노력합니다.
          </p>
          <div className="mt-9 flex gap-3.5">
            <Button variant="primary">사업 소개 보기</Button>
            <Button variant="outline">문의하기</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
