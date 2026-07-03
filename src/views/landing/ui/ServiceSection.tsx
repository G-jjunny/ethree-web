import { Button, SectionLabel } from "@/shared/ui";

interface ServiceRow {
  no: string;
  label: string;
  title: string;
  description: string;
}

/**
 * 대표 서비스 에디토리얼 로우. 향후 Supabase 동적 콘텐츠 후보이므로
 * 컴포넌트 밖 상수로 분리한다. 짝수 행(02)은 이미지/텍스트 좌우를 교차한다.
 */
const SERVICE_ROWS: readonly ServiceRow[] = [
  {
    no: "01",
    label: "공간정보 · GIS",
    title: "제주특별자치도 공간포털",
    description:
      "제주특별자치도의 다양한 공간정보를 통합 제공하는 대국민 공간포털 시스템을 구축·운영합니다.",
  },
  {
    no: "02",
    label: "국토환경 · 평가",
    title: "국토환경성 평가지도",
    description:
      "국토의 환경성을 등급화하여 개발과 보전이 조화된 국토관리를 지원하는 평가지도 시스템입니다.",
  },
  {
    no: "03",
    label: "환경영향평가",
    title: "환경영향평가 정보지원시스템",
    description:
      "개발사업의 환경영향을 사전에 평가·검토하여 친환경적 국토개발을 지원하는 환경부 대표 시스템입니다.",
  },
];

function ServiceImage() {
  return (
    <div className="flex h-60 items-center justify-center overflow-hidden rounded-image bg-white/5">
      {/* 실제 서비스 스크린샷 교체 자리 */}
      <span className="font-display text-mini tracking-label text-white/40">
        SERVICE IMAGE PLACEHOLDER
      </span>
    </div>
  );
}

interface ServiceTextProps {
  row: ServiceRow;
}

function ServiceText({ row }: ServiceTextProps) {
  return (
    <div>
      <SectionLabel color="accent" size="sm">
        {row.label}
      </SectionLabel>
      <h3 className="mt-3.5 text-h3 font-bold text-white">{row.title}</h3>
      {/* token 없음: 문단 폭 440px, max-w-md(448px) 근사 */}
      <p className="mt-4 max-w-md text-body-sm text-white/70">
        {row.description}
      </p>
    </div>
  );
}

export function ServiceSection() {
  return (
    <section className="bg-ink py-30">
      <div className="content-container">
        <div className="mb-18 flex flex-wrap items-end justify-between gap-10 border-b border-white/12 pb-8.5">
          <div>
            <SectionLabel color="accent">ABOUT SERVICE</SectionLabel>
            <h2 className="font-display mt-4 text-h2 font-extrabold text-white">
              이쓰리가 만든
              <br />
              대표 시스템
            </h2>
          </div>
          {/* token 없음: 문단 폭 420px, max-w-md(448px) 근사 */}
          <p className="max-w-md text-body-sm text-white/70">
            환경부 및 산하기관과 함께 기획부터 개발, 구축, 운영까지 책임지고 있는
            이쓰리의 대표 서비스를 소개합니다.
          </p>
        </div>

        <div className="flex flex-col">
          {SERVICE_ROWS.map((row, index) => {
            const isLast = index === SERVICE_ROWS.length - 1;
            const isReversed = index % 2 === 1;
            return (
              <div
                key={row.no}
                /* token 없음: 로우 그리드 110px + 2열, 원본 레이아웃값 */
                className={`grid grid-cols-[110px_1fr_1fr] items-center gap-12 py-14 ${
                  isLast ? "" : "border-b border-white/12"
                }`}
              >
                <span className="font-display text-mega font-extrabold leading-none text-accent/35">
                  {row.no}
                </span>
                {isReversed ? (
                  <>
                    <ServiceImage />
                    <ServiceText row={row} />
                  </>
                ) : (
                  <>
                    <ServiceText row={row} />
                    <ServiceImage />
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-16 flex justify-center">
          <Button variant="primary">E3 SERVICE 자세히보기</Button>
        </div>
      </div>
    </section>
  );
}
