"use client";

import { useMemo, useState } from "react";
import type { BusinessProject } from "@/shared/lib";

interface ProjectsExplorerProps {
  /** 서버에서 파생한 flat 실적(reverse chronological) */
  projects: readonly BusinessProject[];
  /** 서버에서 파생한 연도 축(내림차순) */
  years: readonly number[];
}

/** 전체 필터를 나타내는 sentinel 값. */
const ALL = "all" as const;

/**
 * 사업실적 탐색기. 연도 필터 칩(전체/연도별) + 필터된 실적 리스트를 렌더한다.
 * 서버 props만 소비하며, 유일한 상호작용(활성 연도 선택)만 클라이언트 경계로 격리한다.
 * 리스트는 연도·발주처·프로젝트명·수행기간 구성 + hairline 구획.
 */
export function ProjectsExplorer({ projects, years }: ProjectsExplorerProps) {
  const [activeYear, setActiveYear] = useState<number | typeof ALL>(ALL);

  const filtered = useMemo(
    () =>
      activeYear === ALL
        ? projects
        : projects.filter((p) => p.year === activeYear),
    [projects, activeYear],
  );

  return (
    <div className="mt-12 lg:mt-16">
      {/* 연도 필터 칩 */}
      <div
        className="flex flex-wrap gap-2.5"
        role="tablist"
        aria-label="연도 필터"
      >
        <FilterChip
          active={activeYear === ALL}
          onClick={() => setActiveYear(ALL)}
        >
          전체
        </FilterChip>
        {years.map((year) => (
          <FilterChip
            key={year}
            active={activeYear === year}
            onClick={() => setActiveYear(year)}
          >
            {year}
          </FilterChip>
        ))}
      </div>

      {/* 필터된 실적 리스트 — hairline 구획 + 행 hover로 185건 스캔성 유지 */}
      <ul className="mt-10 divide-y divide-hairline border-y border-hairline">
        {filtered.map((project) => (
          <li
            key={project.id}
            /* token 없음: 실적 행 그리드 64/180px + 프로젝트명 1fr + 기간 140px(sm+), 원본 리스트 레이아웃값 */
            className="grid grid-cols-1 gap-1.5 py-5 transition-colors duration-fast hover:bg-surface-white sm:grid-cols-[64px_180px_1fr_140px] sm:items-baseline sm:gap-x-6 sm:gap-y-0"
          >
            {/* 연도: 그룹 앵커 — 라이트 카드 번호 라벨 톤, 자릿수 정렬 */}
            <span className="font-display text-detail font-bold tabular-nums text-olive-muted">
              {project.year}
            </span>
            {/* 발주처: 보조 정보 */}
            <span className="text-detail text-ink-soft">{project.client}</span>
            {/* 프로젝트명: 주정보 — 행 내 최상위 위계 */}
            <span className="text-body-sm font-medium text-ink">
              {project.title}
            </span>
            {/* 수행기간: 보조 메타 — 우측 정렬, 자릿수 정렬 */}
            <span className="font-display text-meta tabular-nums text-muted sm:text-right">
              {project.period}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface FilterChipProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function FilterChip({ active, onClick, children }: FilterChipProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-detail font-medium transition-colors duration-fast ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-label/40 ${
        active
          ? "border-ink bg-ink text-white"
          : "border-hairline bg-surface-white text-ink-soft hover:border-olive-label hover:text-olive-label"
      }`}
    >
      {children}
    </button>
  );
}
