import { SectionLabel } from "@/shared/ui";
import { getBusinessProjects, getProjectYears } from "@/shared/lib";
import { ProjectsExplorer } from "./ProjectsExplorer";

/**
 * 사업실적 섹션(핵심). 서버 컴포넌트에서 getter를 호출해 flat 실적/연도 축을
 * 파생하고, 연도 필터 상호작용만 ProjectsExplorer 클라이언트 경계로 넘긴다.
 * 헤더 집계(총 실적 건수·기간)는 배열에서 파생한다(하드코딩 금지). bg-surface.
 */
export function ProjectsSection() {
  const projects = getBusinessProjects();
  const years = getProjectYears();
  const latestYear = years[0];
  const earliestYear = years[years.length - 1];

  return (
    <section className="bg-surface py-16 lg:py-25">
      <div className="content-container">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[180px_1fr] lg:gap-12">
          <div className="lg:pt-1">
            <SectionLabel color="olive">PROJECTS</SectionLabel>
          </div>
          <div>
            <h2 className="font-display text-h2 font-extrabold text-ink">
              주요 사업실적
            </h2>
            <p className="mt-6 max-w-2xl text-body-sm text-ink-soft">
              환경부 및 산하기관과 함께 수행해 온 시스템 구축·운영·연구
              프로젝트입니다.
            </p>

            {/* 배열에서 파생한 집계 요약(하드코딩 금지) */}
            <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-hairline pt-8 sm:grid-cols-3 lg:mt-12">
              <div>
                <dt className="text-detail text-ink-soft">총 실적</dt>
                <dd className="font-display mt-2 text-4xl font-extrabold leading-none text-ink lg:text-h1">
                  {projects.length}건
                </dd>
              </div>
              <div>
                <dt className="text-detail text-ink-soft">수행 기간</dt>
                <dd className="font-display mt-2 text-4xl font-extrabold leading-none text-ink lg:text-h1">
                  {earliestYear}–{latestYear}
                </dd>
              </div>
              <div>
                <dt className="text-detail text-ink-soft">활동 연도</dt>
                <dd className="font-display mt-2 text-4xl font-extrabold leading-none text-ink lg:text-h1">
                  {years.length}개년
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <ProjectsExplorer projects={projects} years={years} />
      </div>
    </section>
  );
}
