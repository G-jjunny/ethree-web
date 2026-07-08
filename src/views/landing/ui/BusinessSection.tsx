import { Button, SectionHeader } from "@/shared/ui";
import { getSolutionSlides } from "@/features/solution";

import { BUSINESS_SOLUTIONS } from "./business-solutions.data";
import { SolutionCarousel } from "./SolutionCarousel";

/**
 * About Business 섹션(서버).
 * Supabase `solution_slides`(getSolutionSlides)에서 활성 슬라이드를 가져오고,
 * 비어있으면(마이그레이션 미적용/데이터 없음) 로컬 fallback 상수를 사용한다.
 */
export async function BusinessSection() {
  const slides = await getSolutionSlides();
  const solutions = slides.length > 0 ? slides : BUSINESS_SOLUTIONS;

  return (
    <section className="bg-surface py-16 lg:py-30">
      <div className="content-container">
        {/* 중앙정렬 헤딩 + 서브타이틀(기존 우측 설명 문단 이동, 문구 보존) */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <SectionHeader
            tone="light"
            eyebrow="ABOUT BUSINESS"
            title={
              <>
                환경과 융합된
                <br />
                다양한 솔루션 개발
              </>
            }
          />
          <p className="mx-auto mt-6 max-w-xl text-body-sm text-ink-soft">
            대국민 서비스, 행정업무 통합관리 등 효율적인 시스템 구축과 환경
            정보시스템에 관한 기획부터 개발, 구축, 운영까지 — 이쓰리가 모든
            과정을 책임집니다.
          </p>
        </div>

        {/* 상호작용(캐러셀)만 클라이언트 경계로 분리 */}
        <SolutionCarousel solutions={solutions} />

        <div className="mt-14 flex justify-center">
          <Button variant="dark">E3 BUSINESS 자세히보기</Button>
        </div>
      </div>
    </section>
  );
}
