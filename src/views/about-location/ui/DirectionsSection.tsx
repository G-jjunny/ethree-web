import { SectionHeader, SectionLabel, Reveal } from "@/shared/ui";
import { getDirections } from "@/shared/lib";

/**
 * 오는 길(대중교통) + 부서 문의 섹션(크림 에디토리얼).
 * 기존 올리브 밴드를 걷어내고 인사말 CoreValues 톤(hairline 구획 행 · 넉넉한 여백 ·
 * 순차 Reveal 등장)에 정합했다. SectionHeader tone="light"(olive 라벨·ink 헤딩) 아래
 * 대중교통 좌 / 부서 문의 우 2열을 hairline으로 나눈다. mailto/tel 링크는 hover 색 전이.
 * 데이터는 getDirections()(shared/lib) — 정적 텍스트뿐, 서버 컴포넌트(Reveal client 아일랜드만).
 */
export function DirectionsSection() {
  const { transit, departments } = getDirections();

  return (
    <section className="bg-surface py-20 lg:py-28">
      <div className="content-container">
        <Reveal>
          <SectionHeader
            className="mb-14 max-w-2xl lg:mb-20"
            tone="light"
            eyebrow="DIRECTIONS"
            title="오는 길"
            description="지하철·버스 등 대중교통으로 편리하게 방문하실 수 있습니다. 문의 사항은 담당 부서로 연락 주시기 바랍니다."
          />
        </Reveal>

        <div className="grid grid-cols-1 gap-12 border-t border-hairline pt-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16 lg:pt-16">
          {/* 대중교통 (지하철/버스) */}
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:gap-16">
            {transit.map((group, gi) => (
              <Reveal key={group.mode} delay={gi * 0.08}>
                <SectionLabel color="olive" size="sm">
                  {group.mode}
                </SectionLabel>
                <dl className="mt-5 border-t border-hairline">
                  {group.lines.map((line) => (
                    <div
                      key={`${group.mode}-${line.label}`}
                      className="flex gap-4 border-b border-hairline py-4"
                    >
                      <dt className="w-14 shrink-0 text-item font-bold text-ink">
                        {line.label}
                      </dt>
                      <dd className="text-body-sm text-ink-soft">
                        {line.detail}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            ))}
          </div>

          {/* 부서 문의 */}
          <Reveal
            delay={0.16}
            className="lg:border-l lg:border-hairline lg:pl-16"
          >
            <SectionLabel color="olive" size="sm">
              CONTACT
            </SectionLabel>
            <ul className="mt-5 border-t border-hairline">
              {departments.map((dept) => (
                <li
                  key={`${dept.name}-${dept.email}`}
                  className="border-b border-hairline py-4"
                >
                  <p className="text-detail text-ink-soft">{dept.name}</p>
                  <a
                    href={`mailto:${dept.email}`}
                    className="font-display mt-1 block text-item font-bold text-ink transition-colors duration-fast ease-out hover:text-olive-label"
                  >
                    {dept.email}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
