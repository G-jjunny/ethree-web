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
 * 리스트는 발주처·프로젝트명 2열 + hairline 구획.
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

      {/* 필터된 실적 리스트 */}
      <ul className="mt-10 divide-y divide-hairline border-t border-hairline">
        {filtered.map((project) => (
          <li
            key={project.id}
            className="grid grid-cols-1 gap-1 py-5 sm:grid-cols-[120px_160px_1fr] sm:items-baseline sm:gap-6"
          >
            <span className="font-display text-detail font-bold text-olive-muted">
              {project.year}
            </span>
            <span className="text-detail text-ink-soft">{project.client}</span>
            <span className="text-body-sm text-ink">{project.title}</span>
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
      className={`rounded-full px-4 py-2 text-detail font-medium transition-colors ${
        active
          ? "bg-ink text-white"
          : "border border-hairline bg-surface-white text-ink-soft hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
