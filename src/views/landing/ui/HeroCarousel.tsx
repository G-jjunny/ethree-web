"use client";

// import Image from "next/image"; // 실제 배경 이미지 확보 후 활성화
import {
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import { AnimatePresence, motion } from "motion/react";

import { HERO_SLIDES } from "./hero-slides.data";

/** autoplay 간격(ms). */
const AUTOPLAY_INTERVAL = 5000;

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

/**
 * 히어로 3슬라이드 자동 캐러셀.
 * - autoplay 5초, hover 시 일시정지, 인디케이터 클릭 시 이동 + 타이머 리셋.
 * - prefers-reduced-motion 감지 시 autoplay/전환 애니메이션 정지.
 * - 레이아웃 고정, 배경·텍스트만 cross-fade 전환.
 */
export function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  // 수동 이동 시 autoplay 타이머를 리셋하기 위한 nonce (effect 재실행 트리거).
  const [timerNonce, setTimerNonce] = useState(0);

  // prefers-reduced-motion 구독 (setState-in-effect 없이 안전하게 구독).
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  // autoplay 타이머. pause/reduced-motion 시 정지, timerNonce 변경 시 재시작.
  useEffect(() => {
    if (isPaused || prefersReducedMotion) {
      return;
    }
    const intervalId = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, AUTOPLAY_INTERVAL);
    return () => clearInterval(intervalId);
  }, [isPaused, prefersReducedMotion, timerNonce]);

  const goToSlide = useCallback((index: number) => {
    setActiveIndex(index);
    setTimerNonce((prev) => prev + 1); // 타이머 리셋
  }, []);

  const activeSlide = HERO_SLIDES[activeIndex];
  // reduced-motion 시 전환 애니메이션을 즉시(무모션)로 처리.
  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <div
      className="relative flex min-h-160 w-full flex-col lg:min-h-190"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 배경 레이어 — 슬라이드별 placeholder를 stack, active만 cross-fade */}
      <div className="absolute inset-0 z-0" aria-hidden>
        {HERO_SLIDES.map((slide, index) => (
          <motion.div
            key={slide.id}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: index === activeIndex ? 1 : 0 }}
            transition={transition}
          >
            {/* 배경 placeholder — 실제 사진 교체 자리 */}
            <div className="absolute inset-0 bg-ink" />
            {/*
              실제 이미지 확보 시 아래 슬롯 활성화 (next/image import도 함께 해제):
              {slide.imageSrc && (
                <Image
                  src={slide.imageSrc}
                  alt=""
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover"
                />
              )}
            */}
          </motion.div>
        ))}
      </div>

      {/* 가독성용 다크 스크림 — 상단(헤더 오버레이) 중간톤, 하단(콘텐츠) 강 */}
      <div
        className="absolute inset-0 z-10 bg-linear-to-b from-black/50 via-black/25 to-black/85"
        aria-hidden
      />

      {/* 콘텐츠 — 하단 정렬 */}
      <div className="relative z-20 flex flex-1 flex-col justify-end pb-16 lg:pb-21">
        <div className="content-container w-full">
          {/* 슬라이드 텍스트 — active 콘텐츠만 cross-fade, 레이아웃 고정 */}
          <div className="max-w-4xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide.id}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -16 }}
                transition={transition}
              >
                {/* 키워드 — 최상위 위계: 가장 크게·굵게 */}
                <h1 className="font-display tracking-headline text-4xl font-extrabold text-white sm:text-5xl lg:text-hero">
                  {activeSlide.keyword}
                </h1>
                {/* 태그라인 — 중간 위계: accent 포인트, 중간 스케일 */}
                <p className="font-display mt-4 text-2xl font-medium text-accent lg:text-h3">
                  {activeSlide.tagline}
                </p>
                {/* 본문 — 최하위 위계: 작은 스케일·저대비 */}
                <p className="mt-6 max-w-xl text-lead text-white/80">
                  {activeSlide.body}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 인디케이터 — 01_ 02_ 03_ (숫자 + 막대), 콘텐츠 맨 아래 고정 */}
          <ul className="mt-12 flex items-center gap-8">
            {HERO_SLIDES.map((slide, index) => {
              const isActive = index === activeIndex;
              const label = String(index + 1).padStart(2, "0");
              return (
                <li key={slide.id}>
                  <button
                    type="button"
                    onClick={() => goToSlide(index)}
                    aria-label={`슬라이드 ${index + 1}로 이동`}
                    aria-current={isActive ? "true" : undefined}
                    className="group flex items-center gap-3 focus-visible:outline-none"
                  >
                    {/* 숫자 — tabular-nums로 자리폭 고정(레이아웃 흔들림 방지) */}
                    <span
                      className={`font-display text-sm font-bold tracking-label tabular-nums transition-colors duration-fast ease-out group-focus-visible:text-white ${
                        isActive
                          ? "text-white"
                          : "text-white/40 group-hover:text-white/70"
                      }`}
                    >
                      {label}
                    </span>
                    {/* 막대(_) — active는 accent로 길게 확장(절제된 진행 연출) */}
                    <span
                      aria-hidden
                      className={`block h-px transition-all duration-fast ease-out ${
                        isActive
                          ? "w-10 bg-accent"
                          : "w-6 bg-white/40 group-hover:bg-white/70"
                      }`}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
