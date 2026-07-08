"use client";

import Image from "next/image";
import { useCallback, useState, useSyncExternalStore } from "react";
import { motion } from "motion/react";

import type { BusinessSolution } from "./business-solutions.data";

export interface SolutionCarouselProps {
  solutions: readonly BusinessSolution[];
}

/**
 * 솔루션별 배경 구분 틴트 — 실제 이미지(imageSrc) 미확보 시 카드 이미지 영역을
 * 가시화하기 위한 placeholder. imageSrc를 채우면 next/image가 이 위를 덮으므로
 * 실제 이미지로 자연스럽게 대체된다. 기존 토큰만 사용.
 */
const SOLUTION_BG_TINT = [
  "bg-linear-to-tr from-brand/25 via-transparent to-transparent",
  "bg-linear-to-tl from-accent/20 via-transparent to-transparent",
  "bg-linear-to-t from-olive/30 via-transparent to-transparent",
];

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/** matchMedia 구독 — reduced-motion 변경 시 리렌더 트리거. */
function subscribeReducedMotion(onChange: () => void) {
  const mql = window.matchMedia(REDUCED_MOTION_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/** SSR 스냅샷 — 서버에서는 모션 허용을 기본값으로. */
function getReducedMotionServerSnapshot() {
  return false;
}

/** active 기준 원형 상대 오프셋(-1: 좌, 0: 중앙, 1: 우)으로 정규화. */
function getRelativeOffset(index: number, active: number, len: number) {
  const half = Math.floor(len / 2);
  let offset = index - active;
  if (offset > half) offset -= len;
  if (offset < -half) offset += len;
  return offset;
}

/**
 * 솔루션 3단 중앙 강조 캐러셀 (수동 화살표 전용, autoplay 없음).
 * - activeIndex state + prev/next 무한 루프((i + len) % len).
 * - active 카드 중앙 크게, 좌우 인접 카드는 축소·저대비·부분 노출(peek).
 * - prefers-reduced-motion 시 전환 애니메이션 무모션 처리.
 * - 설명은 desktop hover 오버레이 + active 카드는 모바일에서 항상 노출(터치 폴백).
 */
export function SolutionCarousel({ solutions }: SolutionCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const len = solutions.length;

  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + len) % len);
  }, [len]);

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i + 1) % len);
  }, [len]);

  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const };

  const activeSolution = solutions[activeIndex];

  return (
    <div className="relative mx-auto max-w-5xl">
      {/* 카드 무대 — overflow-hidden으로 좌우 peek 카드를 부분 노출(clip). 화살표는 무대 세로 중앙 양옆 */}
      <div className="relative h-60 overflow-hidden sm:h-72 lg:h-88">
        {solutions.map((solution, index) => {
          const offset = getRelativeOffset(index, activeIndex, len);
          const isActive = offset === 0;
          const tint = SOLUTION_BG_TINT[index % SOLUTION_BG_TINT.length] ?? "";
          return (
            <motion.article
              key={solution.no}
              className="group absolute top-1/2 left-1/2 w-72 origin-center sm:w-80 lg:w-96"
              style={{ zIndex: len - Math.abs(offset) }}
              initial={false}
              animate={{
                x: `${-50 + offset * 58}%`,
                y: "-50%",
                scale: isActive ? 1 : 0.82,
                opacity: isActive ? 1 : 0.35,
              }}
              transition={transition}
            >
              {/* 이미지 영역 — placeholder 배경 + imageSrc 있으면 next/image로 덮음 */}
              <div className="relative aspect-4/3 overflow-hidden rounded-image bg-ink">
                <div className={`absolute inset-0 ${tint}`} aria-hidden />
                {solution.imageSrc && (
                  <Image
                    src={solution.imageSrc}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 24rem, (min-width: 640px) 20rem, 18rem"
                    className="object-cover"
                  />
                )}

                {/* 설명 오버레이 — desktop: group-hover fade / active: 모바일 항상 노출(터치 폴백) */}
                <div
                  className={`absolute inset-0 flex items-center justify-center bg-ink/85 p-6 text-center transition-opacity duration-fast ease-out sm:p-8 ${
                    isActive
                      ? "opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
                >
                  <p className="text-detail text-white/80">
                    {solution.description}
                  </p>
                </div>
              </div>
            </motion.article>
          );
        })}

        {/* 이전/다음 원형 화살표 — 무대(이미지) 세로 중앙 양옆. 다음은 brand 채움(레퍼런스) */}
        <button
          type="button"
          onClick={goPrev}
          aria-label="이전 솔루션"
          className="absolute top-1/2 left-0 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-hairline bg-surface-white text-ink shadow-sm transition-colors duration-fast ease-out hover:border-brand hover:text-brand focus-visible:border-brand focus-visible:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 sm:left-3"
        >
          <ChevronIcon direction="left" />
        </button>
        <button
          type="button"
          onClick={goNext}
          aria-label="다음 솔루션"
          className="absolute top-1/2 right-0 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-brand text-brand-ink shadow-sm transition-colors duration-fast ease-out hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface sm:right-3"
        >
          <ChevronIcon direction="right" />
        </button>
      </div>

      {/* 활성 솔루션 이름 — 무대 아래 중앙(활성 카드만) */}
      <div className="mt-8 text-center">
        <span className="block font-display text-xs font-bold tracking-label text-olive-muted">
          {activeSolution.no}
        </span>
        <h3 className="mt-1.5 font-display text-xl font-bold tracking-headline text-ink">
          {activeSolution.title}
        </h3>
      </div>
    </div>
  );
}

interface ChevronIconProps {
  direction: "left" | "right";
}

function ChevronIcon({ direction }: ChevronIconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={direction === "left" ? "rotate-0" : "rotate-180"}
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
