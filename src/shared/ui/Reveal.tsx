"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

export interface RevealProps {
  children: ReactNode;
  /** 등장 지연(초) — 같은 섹션 내 순차 등장에 사용 */
  delay?: number;
  className?: string;
}

/**
 * 스크롤 진입 시 아래에서 위로 페이드업하는 최소 모션 래퍼.
 * 브랜드가 플랫·무모션 기조이므로 강도를 최소(투명도 + 16px 이동)로 유지하고
 * ease-out(디자인 토큰과 동일한 cubic-bezier)로 절제된 감각만 더한다.
 * prefers-reduced-motion을 존중해 접근성 사용자에겐 즉시 정적 표시한다.
 * 여러 뷰 공용 스크롤 등장 모션 — shared/ui로 승격된 client 아일랜드.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
