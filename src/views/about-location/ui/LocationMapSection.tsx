import { SectionLabel } from "@/shared/ui";
import { SITE } from "@/shared/constants";
import { getDirections } from "@/shared/lib";

/**
 * 지도 + 주소 섹션. 크림(surface) 밴드 위에 대형 구글맵 임베드(hairline 프레임)와
 * 회사 주소·연락처 인포 패널을 2열로 배치한다. 지도 임베드는 API 키가 필요 없어
 * 서버 컴포넌트로 렌더된다("use client" 불필요).
 * 주소/tel/fax는 SITE(단일 소스)에서 소비하고, mapQuery만 getDirections()에서 받는다.
 */
export function LocationMapSection() {
  const { mapQuery } = getDirections();
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=17&output=embed`;

  return (
    <section className="bg-surface py-16 lg:py-25">
      <div className="content-container">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-stretch lg:gap-10">
          {/* 구글맵 임베드 — hairline 프레임 + 반응형 aspect 컨테이너.
              lg에서는 items-stretch로 주소 패널이 지도 높이에 맞춰 늘어난다. */}
          <div className="aspect-[4/3] overflow-hidden rounded-image border border-hairline lg:aspect-[16/10]">
            <iframe
              src={mapSrc}
              title="이쓰리 오시는 길 지도"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full"
            />
          </div>

          {/* 주소 인포 패널 — SITE 소비 */}
          <div className="flex flex-col justify-center rounded-image border border-hairline bg-surface-white p-8 lg:p-10">
            <SectionLabel color="olive">OFFICE</SectionLabel>
            <p className="font-display mt-4 text-h3 font-extrabold text-ink">
              {SITE.legalName}
            </p>

            <dl className="mt-8 space-y-6 border-t border-hairline pt-8">
              <div>
                <dt className="text-meta font-bold text-olive-label">주소</dt>
                <dd className="mt-2 text-body-sm text-ink-soft">
                  {SITE.address.line1}
                  <br />
                  {SITE.address.line2}
                </dd>
              </div>
              <div>
                <dt className="text-meta font-bold text-olive-label">전화</dt>
                <dd className="mt-2 text-body-sm text-ink-soft">
                  <a
                    href={`tel:${SITE.contact.tel}`}
                    className="transition-colors duration-fast ease-out hover:text-olive-label"
                  >
                    {SITE.contact.tel}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-meta font-bold text-olive-label">팩스</dt>
                <dd className="mt-2 text-body-sm text-ink-soft">
                  {SITE.contact.fax}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
