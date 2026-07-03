import { SITE } from "@/shared/constants";

/**
 * 맺음말(7~9문단) + 서명. 신뢰감을 주는 8문단을 대형 다크 풀인용으로
 * 하이라이트하고(P7→P8→P9 읽기 순서 유지), 서명은 hairline 구분선 +
 * 이름 강조로 서신 마무리답게 정제한다.
 */
export function ClosingSection() {
  return (
    <section className="bg-surface py-16 lg:py-25">
      <div className="content-container">
        <div className="mx-auto max-w-3xl">
          <p className="text-body-sm text-ink-soft">
            앞으로 이쓰리는 다양한 환경 데이터를 통합하고 활용하여, 기후위기
            시대에 대응하는 탄소중립형 환경 플랫폼 기업으로 성장해 나갈
            것입니다.
          </p>

          {/* 핵심 메시지 대형 풀인용 (8문단) — 다크 인셋 카드 */}
          <blockquote className="my-12 rounded-card bg-ink px-8 py-11 lg:my-16 lg:px-14 lg:py-14">
            <span
              aria-hidden
              className="font-display block text-mega font-black leading-none text-accent/30"
            >
              &ldquo;
            </span>
            <p className="mt-1 text-h3 font-bold text-white lg:text-h2">
              저는 직원의 정신적·물질적 행복을 최우선으로 여기며, 고객 한 분
              한 분을 평생 보호해야 할 소중한 존재로 생각합니다.
            </p>
          </blockquote>

          <p className="text-body-sm text-ink-soft">
            매일의 작은 실천이 큰 변화를 만들어낸다는 믿음으로, 오늘도 고객,
            직원, 그리고 사회를 위한 발걸음을 멈추지 않겠습니다.
          </p>

          <footer className="mt-14 flex items-baseline justify-end gap-3 border-t border-hairline pt-10">
            <span className="text-detail text-ink-soft">대표이사</span>
            <span className="font-display text-h3 font-extrabold tracking-headline text-ink">
              {SITE.ceo}
            </span>
            <span className="text-detail text-ink-soft">올림</span>
          </footer>
        </div>
      </div>
    </section>
  );
}
