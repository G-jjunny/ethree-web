import { SectionLabel } from "@/shared/ui";
import { getDirections } from "@/shared/lib";

/**
 * 오는 길(대중교통) + 부서 문의 섹션. 올리브 밴드로 배경 리듬을 닫고
 * (연혁 PartnersSection과 동일 톤), 지하철/버스 안내와 부서 문의를
 * white/12 hairline 구획으로 정제한 매거진식 레이아웃으로 배치한다.
 * 데이터는 getDirections()(shared/lib) — 정적 텍스트뿐, 서버 컴포넌트.
 */
export function DirectionsSection() {
  const { transit, departments } = getDirections();

  return (
    <section className="relative overflow-hidden bg-olive py-16 lg:py-25">
      {/* 장식 원형 (연혁/인사말 올리브 밴드와 일관성) */}
      <div
        className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full border border-white/10"
        aria-hidden
      />
      <div className="content-container relative">
        <div className="max-w-2xl">
          <SectionLabel color="olive-soft">DIRECTIONS</SectionLabel>
          <h2 className="font-display mt-4 text-h2 font-extrabold text-white">
            오는 길
          </h2>
          <p className="mt-6 text-body-sm text-white/80">
            지하철·버스 등 대중교통으로 편리하게 방문하실 수 있습니다.
            문의 사항은 담당 부서로 연락 주시기 바랍니다.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-12 border-t border-white/12 pt-14 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          {/* 대중교통 (지하철/버스) */}
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
            {transit.map((group) => (
              <div key={group.mode}>
                <SectionLabel color="olive-soft" size="sm">
                  {group.mode}
                </SectionLabel>
                <dl className="mt-5">
                  {group.lines.map((line) => (
                    <div
                      key={`${group.mode}-${line.label}`}
                      className="flex gap-4 border-b border-white/12 py-4 first:border-t"
                    >
                      <dt className="w-14 shrink-0 text-item font-bold text-white">
                        {line.label}
                      </dt>
                      <dd className="text-body-sm text-white/80">
                        {line.detail}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>

          {/* 부서 문의 */}
          <div className="lg:border-l lg:border-white/12 lg:pl-16">
            <SectionLabel color="olive-soft" size="sm">
              CONTACT
            </SectionLabel>
            <ul className="mt-5">
              {departments.map((dept) => (
                <li
                  key={`${dept.name}-${dept.email}`}
                  className="border-b border-white/12 py-4 first:border-t"
                >
                  <p className="text-detail text-white/70">{dept.name}</p>
                  <a
                    href={`mailto:${dept.email}`}
                    className="font-display mt-1 block text-item font-bold text-white transition-colors duration-fast ease-out hover:text-brand"
                  >
                    {dept.email}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
