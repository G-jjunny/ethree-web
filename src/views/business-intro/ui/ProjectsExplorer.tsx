"use client";

import { useMemo, useRef, useState } from "react";
import type { BusinessProject } from "@/shared/lib";

interface ProjectsExplorerProps {
  /** 서버에서 파생한 flat 실적(reverse chronological) */
  projects: readonly BusinessProject[];
  /** 서버에서 파생한 연도 축(내림차순) */
  years: readonly number[];
}

/** 전체 필터를 나타내는 sentinel 값. */
const ALL = "all" as const;

/** 페이지당 실적 건수. */
const PAGE_SIZE = 20;

/**
 * 사업실적 탐색기. 연도 필터 칩(전체/연도별) + 필터·페이지된 실적 리스트를 렌더한다.
 * 서버 props만 소비하며, 상호작용(활성 연도 선택·페이지 이동)만 클라이언트 경계로 격리한다.
 * 필터 변경 시 page=1 리셋은 칩 onClick에서 setState를 함께 호출해 처리(useEffect 미사용).
 */
export function ProjectsExplorer({ projects, years }: ProjectsExplorerProps) {
  const [activeYear, setActiveYear] = useState<number | typeof ALL>(ALL);
  const [page, setPage] = useState(1);
  const listRef = useRef<HTMLUListElement>(null);

  const filtered = useMemo(
    () =>
      activeYear === ALL
        ? projects
        : projects.filter((p) => p.year === activeYear),
    [projects, activeYear],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  // 필터 결과 축소 등으로 page가 범위를 벗어나면 마지막 페이지로 clamp(렌더 시 파생만).
  const currentPage = Math.min(page, totalPages);
  const pageItems = useMemo(
    () =>
      filtered.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE,
      ),
    [filtered, currentPage],
  );

  const pager = buildPagerItems(currentPage, totalPages);

  /** 연도 필터 선택: 활성 연도 갱신과 동시에 페이지를 1로 리셋. */
  const selectYear = (year: number | typeof ALL) => {
    setActiveYear(year);
    setPage(1);
  };

  /** 페이지 이동 + 리스트 상단으로 부드럽게 스크롤. */
  const goToPage = (next: number) => {
    setPage(next);
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
          onClick={() => selectYear(ALL)}
        >
          전체
        </FilterChip>
        {years.map((year) => (
          <FilterChip
            key={year}
            active={activeYear === year}
            onClick={() => selectYear(year)}
          >
            {year}
          </FilterChip>
        ))}
      </div>

      {/* 필터된 실적 리스트 — hairline 구획 + 행 hover로 185건 스캔성 유지 */}
      <ul
        ref={listRef}
        className="mt-10 scroll-mt-24 divide-y divide-hairline border-y border-hairline"
      >
        {pageItems.map((project) => (
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

      {/* 번호형 페이저 — 필터 결과가 한 페이지를 넘을 때만 노출 */}
      {totalPages > 1 && (
        <nav
          className="mt-10 flex flex-wrap items-center justify-center gap-2"
          aria-label="사업실적 페이지"
        >
          <PagerButton
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="이전 페이지"
          >
            ‹ 이전
          </PagerButton>

          {pager.map((item, index) =>
            item === "ellipsis" ? (
              <span
                key={`ellipsis-${index}`}
                aria-hidden="true"
                className="px-2 text-detail text-muted"
              >
                …
              </span>
            ) : (
              <PagerButton
                key={item}
                active={item === currentPage}
                onClick={() => goToPage(item)}
                aria-current={item === currentPage ? "page" : undefined}
                aria-label={`${item}페이지`}
              >
                {item}
              </PagerButton>
            ),
          )}

          <PagerButton
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="다음 페이지"
          >
            다음 ›
          </PagerButton>
        </nav>
      )}
    </div>
  );
}

/**
 * 페이저 항목 배열을 생성한다. 현재 페이지 주변 + 처음/끝을 노출하고
 * 사이가 벌어지면 "ellipsis" sentinel을 끼운다.
 */
function buildPagerItems(
  current: number,
  total: number,
): readonly (number | "ellipsis")[] {
  // 페이지 수가 적으면 전부 노출.
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const items: (number | "ellipsis")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) items.push("ellipsis");
  for (let page = start; page <= end; page += 1) items.push(page);
  if (end < total - 1) items.push("ellipsis");

  items.push(total);
  return items;
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
          ? "border-brand bg-brand text-brand-ink"
          : "border-hairline bg-surface-white text-ink-soft hover:border-olive-label hover:text-olive-label"
      }`}
    >
      {children}
    </button>
  );
}

interface PagerButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  "aria-label"?: string;
  "aria-current"?: "page";
}

function PagerButton({
  onClick,
  children,
  active = false,
  disabled = false,
  ...aria
}: PagerButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      {...aria}
      className={`rounded-full border px-4 py-2 text-detail font-medium transition-colors duration-fast ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-label/40 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-hairline disabled:hover:text-ink-soft ${
        active
          ? "border-brand bg-brand text-brand-ink"
          : "border-hairline bg-surface-white text-ink-soft hover:border-olive-label hover:text-olive-label"
      }`}
    >
      {children}
    </button>
  );
}
