import { SectionLabel, Reveal } from "@/shared/ui";
import { SITE } from "@/shared/constants";
import { getDirections } from "@/shared/lib";

/**
 * 지도 + 주소 섹션(크림 에디토리얼). 인사말 톤에 맞춰 넉넉한 여백(py-20 lg:py-28)과
 * hairline 프레이밍으로 정제했다. 상단 OFFICE eyebrow + 대형 legalName 헤딩,
 * 그 아래 풀와이드 구글맵(시각 앵커), 하단 주소·전화·팩스 hairline 인포 행.
 * 지도 임베드는 API 키가 필요 없어 서버 컴포넌트로 렌더된다(Reveal client 아일랜드만 상호작용).
 * 주소/tel/fax는 SITE(단일 소스)에서 소비하고, mapQuery만 getDirections()에서 받는다.
 */
export function LocationMapSection() {
  const { mapQuery } = getDirections();
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=17&output=embed`;

  return (
    <section className="bg-surface py-20 lg:py-28">
      <div className="content-container">
        <Reveal>
          <SectionLabel color="olive">OFFICE</SectionLabel>
          <h2 className="font-display mt-4 max-w-2xl text-h3 font-extrabold tracking-headline text-ink lg:text-h2">
            {SITE.legalName}
          </h2>
        </Reveal>

        {/* 풀와이드 구글맵 — 시각 앵커. hairline 프레임 + 넓은 aspect 컨테이너. */}
        <Reveal className="mt-12 lg:mt-16" delay={0.06}>
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

        {/* 하단 인포 행 — 주소·전화·팩스. hairline 3열(모바일 세로 스택). */}
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
                  className="transition-colors duration-fast ease-out hover:text-olive-label"
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
      </div>
    </section>
  );
}
