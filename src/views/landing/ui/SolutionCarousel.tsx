"use client";

import Image from "next/image";
import { useCallback, useState, useSyncExternalStore } from "react";
import { motion } from "motion/react";

import type { SolutionSlide } from "@/features/solution/model/types";

export interface SolutionCarouselProps {
  solutions: readonly SolutionSlide[];
}

/**
 * 솔루션별 배경 구분 틴트 — 실제 이미지(imageUrl) 미확보 시 카드 이미지 영역을
 * 가시화하기 위한 placeholder. imageUrl을 채우면 next/image가 이 위를 덮으므로
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
 * - active 카드에만 이미지 좌측 하단 title 오버레이(강조 텍스트 titleAccent는 브랜드 색상).
 * - 설명(description)은 무대 아래 활성 슬라이드 기준으로 중앙 노출.
 * - prefers-reduced-motion 시 전환 애니메이션 무모션 처리.
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

  if (len === 0) {
    return null;
  }

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
              key={solution.id}
              className="absolute top-1/2 left-1/2 w-72 origin-center sm:w-80 lg:w-96"
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
              {/* 이미지 영역 — placeholder 배경 + imageUrl 있으면 next/image로 덮음 */}
              <div className="relative aspect-4/3 overflow-hidden rounded-image">
                <div className={`absolute inset-0 ${tint}`} aria-hidden />
                {solution.imageUrl && (
                  <Image
                    src={solution.imageUrl}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 24rem, (min-width: 640px) 20rem, 18rem"
                    className="object-cover"
                    unoptimized
                  />
                )}

                {/* 타이틀 오버레이 — active 카드에만 노출, 좌측 하단, 가독성 스크림 */}
                {/* {isActive && (
                  <div className="absolute inset-0 flex items-end bg-linear-to-t from-ink/90 via-ink/40 to-transparent p-5 sm:p-6"></div>
                )} */}
              </div>
              {isActive && (
                <h3 className="font-display text-lg font-bold tracking-headline sm:text-xl">
                  {solution.title}{" "}
                  <span className="text-brand">{solution.titleAccent}</span>
                </h3>
              )}
            </motion.article>
          );
        })}

        {/* 이전/다음 원형 화살표 — 무대(이미지) 세로 중앙 양옆. 다음은 brand 채움(레퍼런스) */}
        <button
          type="button"
          onClick={goPrev}
          aria-label="이전 솔루션"
          className="duration-fast absolute top-1/2 left-0 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-hairline bg-surface-white text-ink shadow-sm transition-colors ease-out hover:border-brand hover:text-brand focus-visible:border-brand focus-visible:text-brand focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:outline-none sm:left-3"
        >
          <ChevronIcon direction="left" />
        </button>
        <button
          type="button"
          onClick={goNext}
          aria-label="다음 솔루션"
          className="duration-fast absolute top-1/2 right-0 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-brand text-brand-ink shadow-sm transition-colors ease-out hover:bg-brand-hover focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none sm:right-3"
        >
          <ChevronIcon direction="right" />
        </button>
      </div>

      {/* 활성 솔루션 설명 — 무대 아래 중앙(기존 title/no 자리를 description이 대체) */}
      <div className="mt-8 text-center">
        <p className="mx-auto max-w-xl text-body-sm text-ink-soft">
          {activeSolution.description}
        </p>
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
