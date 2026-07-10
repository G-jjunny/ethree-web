import Link from "next/link";
import { SITE } from "@/shared/constants";
import { Reveal } from "@/shared/ui";

/**
 * 맺음말 + 서명 + 마무리 CTA. 도입 문단 → 대형 풀인용 → 맺음 문단 →
 * 서명 → 다음 여정 CTA 순으로 서신을 닫는다. 인용은 배경/박스 없이 크림 위
 * 대형 ink 타이포그래피로 두고, 위아래 hairline 구분선과 넉넉한 여백으로
 * 이 섹션의 시각적 피크를 만든다(CoreValues 리듬과 정합). 큰 따옴표는 다크 대비
 * 대신 olive-muted ghost 포인트로 절제한다. 서명도 hairline 구분선으로 정제한다.
 * 정적 텍스트/링크 — 스크롤 등장 모션만 Reveal(client) 아일랜드로 처리.
 */
export function ClosingSection() {
  return (
    <section className="bg-surface py-20 lg:py-28">
      <div className="content-container">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <p className="text-body-sm text-ink-soft">
              앞으로 이쓰리는 다양한 환경 데이터를 통합하고 활용하여, 기후위기
              시대에 대응하는 탄소중립형 환경 플랫폼 기업으로 성장해 나갈
              것입니다.
            </p>
          </Reveal>

          {/* 핵심 메시지 대형 풀인용 — 크림 위 대형 ink 타이포(hairline로 프레이밍한 시각적 피크) */}
          <Reveal>
            <blockquote className="my-14 border-y border-hairline py-12 lg:my-20 lg:py-16">
              <span
                aria-hidden
                className="font-display block text-mega font-black leading-none text-olive-muted/40"
              >
                &ldquo;
              </span>
              <p className="mt-4 font-display text-h3 font-bold leading-snug tracking-headline text-ink lg:text-h2">
                직원의 정신적·물질적 행복을 최우선으로 여기며, 고객 한 분 한 분을
                평생 지켜야 할 소중한 존재로 생각합니다.
              </p>
            </blockquote>
          </Reveal>

          <Reveal>
            <p className="text-body-sm text-ink-soft">
              매일의 작은 실천이 큰 변화를 만들어낸다는 믿음으로, 오늘도 고객과
              직원, 그리고 사회를 위한 발걸음을 멈추지 않겠습니다.
            </p>

            <footer className="mt-14 flex items-baseline justify-end gap-3 border-t border-hairline pt-10">
              <span className="text-detail text-ink-soft">대표이사</span>
              <span className="font-display text-h3 font-extrabold tracking-headline text-ink">
                {SITE.ceo}
              </span>
              <span className="text-detail text-ink-soft">올림</span>
            </footer>
          </Reveal>
        </div>

        {/* 마무리 CTA — 서신 톤을 해치지 않는 절제된 안내 + 사업소개 링크 */}
        <Reveal>
          <div className="mt-16 flex flex-col items-center gap-5 text-center lg:mt-20">
            <p className="text-detail text-ink-soft">
              이쓰리가 만들어온 환경 솔루션을 확인해 보세요
            </p>
            <Link
              href="/business/intro"
              className="inline-flex items-center justify-center rounded-pill bg-ink px-7 py-3.5 font-display text-sm font-bold text-white transition-colors duration-fast ease-out hover:opacity-90"
            >
              E3의 사업 살펴보기
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
