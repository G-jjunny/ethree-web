"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import type { Partner } from "@/shared/lib";

export interface LogoCarouselProps {
  /** 순환 렌더할 파트너 목록. logoSrc가 있으면 이미지, 없으면 이름 타일로 표시. */
  logos: readonly Partner[];
  /** 컬럼 수(기본 4). */
  columnCount?: number;
}

/**
 * 컬럼별로 결정적(deterministic) 라운드로빈 분배 후, 짧은 컬럼은 인덱스 기반으로
 * 채워 길이를 맞춘다. Math.random을 쓰지 않아 SSR/CSR 결과가 동일 → 하이드레이션 안전.
 */
function distributeLogos(
  allLogos: readonly Partner[],
  columnCount: number,
): Partner[][] {
  const columns: Partner[][] = Array.from({ length: columnCount }, () => []);
  if (allLogos.length === 0) {
    return columns;
  }

  allLogos.forEach((logo, index) => {
    columns[index % columnCount].push(logo);
  });

  const maxLength = Math.max(...columns.map((col) => col.length));
  columns.forEach((col) => {
    while (col.length < maxLength) {
      col.push(allLogos[col.length % allLogos.length]);
    }
  });

  return columns;
}

interface PartnerCellProps {
  partner: Partner;
}

/** 라이트 타일 셀 — logoSrc 있으면 이미지, 없으면 이름 텍스트. */
function PartnerCell({ partner }: PartnerCellProps) {
  if (partner.logoSrc) {
    return (
      <Image
        src={partner.logoSrc}
        alt={partner.name}
        fill
        sizes="(min-width: 768px) 13rem, 8rem"
        className="object-contain p-4"
      />
    );
  }

  return (
    <span className="font-display px-3 text-center text-detail font-bold text-ink break-keep md:text-item">
      {partner.name}
    </span>
  );
}

interface LogoColumnProps {
  logos: Partner[];
  index: number;
  currentTime: number;
}

/** 컬럼별로 로고를 순환시키며 스프링/블러 enter·exit 애니메이션을 적용한다. */
function LogoColumn({ logos, index, currentTime }: LogoColumnProps) {
  const cycleInterval = 2000;
  const columnDelay = index * 200;
  const adjustedTime =
    (currentTime + columnDelay) % (cycleInterval * logos.length);
  const currentIndex = Math.floor(adjustedTime / cycleInterval);
  const current = useMemo(() => logos[currentIndex], [logos, currentIndex]);

  return (
    <motion.div
      className="relative h-20 w-32 overflow-hidden rounded-image bg-surface-white md:h-28 md:w-52"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.1,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={`${current.id}-${currentIndex}`}
          className="absolute inset-0 flex items-center justify-center"
          initial={{ y: "10%", opacity: 0, filter: "blur(8px)" }}
          animate={{
            y: "0%",
            opacity: 1,
            filter: "blur(0px)",
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 20,
              mass: 1,
              bounce: 0.2,
              duration: 0.5,
            },
          }}
          exit={{
            y: "-20%",
            opacity: 0,
            filter: "blur(6px)",
            transition: { duration: 0.3 },
          }}
        >
          <PartnerCell partner={current} />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * 21st.dev 스타일 로고 카러셀. 컬럼별로 로고를 순환시키며 블러/스프링으로 전환한다.
 * logoSrc가 있으면 이미지, 없으면 이름 타일로 표시 — admin 업로드 시 자동으로 이미지 전환.
 * distributeLogos가 결정적이라 useMemo 파생으로 SSR/CSR 결과가 동일(하이드레이션 안전).
 */
export function LogoCarousel({ logos, columnCount = 4 }: LogoCarouselProps) {
  const logoSets = useMemo(
    () => distributeLogos(logos, columnCount),
    [logos, columnCount],
  );
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime((prev) => prev + 100);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  if (logos.length === 0) {
    return null;
  }

  return (
    <div className="flex justify-center gap-4 md:gap-6">
      {logoSets.map((columnLogos, index) => (
        <LogoColumn
          key={index}
          logos={columnLogos}
          index={index}
          currentTime={currentTime}
        />
      ))}
    </div>
  );
}
