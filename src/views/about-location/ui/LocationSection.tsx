import { SectionLabel, Reveal } from "@/shared/ui";
import { SITE } from "@/shared/constants";
import { getDirections } from "@/shared/lib";

/**
 * 오시는 길 본문 단일 섹션(크림 미니멀). OFFICE 헤더(법인명 + 방문/문의 안내)
 * 아래 대형 풀와이드 지도(시각 앵커), 그 아래 주소·전화·팩스 인포 스트립과
 * 대중교통·부서 문의를 하나의 흐름으로 이어 별도 서브헤더 없이 정돈한다.
 * 블록 간격을 좁게 잡아(py-16 lg:py-24 · mt-10~16) 여백 과다를 피하고,
 * hairline 프레이밍 + 순차 Reveal로 인사말 톤과 정합한다.
 * 지도 임베드는 API 키가 필요 없어 서버 컴포넌트로 렌더된다(Reveal client 아일랜드만).
 */
export function LocationSection() {
  const { transit, departments, mapQuery } = getDirections();
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=17&output=embed`;

  return (
    <section className="bg-surface py-16 lg:py-24">
      <div className="content-container">
        {/* 헤더 — OFFICE + 법인명 + 방문/문의 안내 */}
        <Reveal>
          <SectionLabel color="olive">OFFICE</SectionLabel>
          <h2 className="mt-4 font-display text-h3 font-extrabold tracking-headline text-ink lg:text-h2">
            {SITE.legalName}
          </h2>
          <p className="mt-5 max-w-2xl text-body-sm text-ink-soft">
            지하철·버스 등 대중교통으로 편리하게 방문하실 수 있습니다. 문의
            사항은 담당 부서로 연락 주시기 바랍니다.
          </p>
        </Reveal>
        {/* 주소·전화·팩스 인포 스트립 — hairline 3열(모바일 세로 스택). */}
        <Reveal delay={0.12}>
          <dl className="mt-10 grid grid-cols-1 divide-y divide-hairline border-y border-hairline sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="py-6 sm:pr-8">
              <dt className="text-meta font-bold text-olive-label">주소</dt>
              <dd className="mt-3 text-body-sm text-ink-soft">
                {SITE.address.line1}
                <br />
                {SITE.address.line2}
              </dd>
            </div>
            <div className="py-6 sm:px-8">
              <dt className="text-meta font-bold text-olive-label">전화</dt>
              <dd className="mt-3 text-body-sm text-ink-soft">
                <a
                  href={`tel:${SITE.contact.tel}`}
                  className="duration-fast transition-colors ease-out hover:text-olive-label"
                >
                  {SITE.contact.tel}
                </a>
              </dd>
            </div>
            <div className="py-6 sm:pl-8">
              <dt className="text-meta font-bold text-olive-label">팩스</dt>
              <dd className="mt-3 text-body-sm text-ink-soft">
                {SITE.contact.fax}
              </dd>
            </div>
          </dl>
        </Reveal>

        {/* 풀와이드 구글맵 — 시각 앵커. hairline 프레임 + 넓은 aspect. */}
        <Reveal className="mt-10 lg:mt-14" delay={0.06}>
          <div className="aspect-[4/3] overflow-hidden rounded-image border border-hairline sm:aspect-[16/9] lg:aspect-[21/9]">
            <iframe
              src={mapSrc}
              title="이쓰리 오시는 길 지도"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full"
            />
          </div>
        </Reveal>

        {/* 대중교통 + 부서 문의 — 별도 서브헤더 없이 스트립 아래로 바로 이어붙임. */}
        <div className="mt-12 grid grid-cols-1 gap-10 lg:mt-16 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
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
                    className="duration-fast mt-1 block font-display text-item font-bold text-ink transition-colors ease-out hover:text-olive-label"
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
