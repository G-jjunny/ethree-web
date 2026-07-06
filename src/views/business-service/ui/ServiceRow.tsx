import { SectionLabel } from "@/shared/ui";
import type { ServiceItem } from "@/shared/lib";

interface ServiceRowProps {
  service: ServiceItem;
  /** 목록 내 순번(0-base). 짝수/홀수로 좌우 교차 · 하단 hairline 여부 판단 */
  index: number;
  /** 마지막 로우면 하단 구획선 생략 */
  isLast: boolean;
}

function ServiceImage() {
  return (
    <div className="flex h-64 items-center justify-center overflow-hidden rounded-image bg-white/5 lg:h-80">
      {/* next/image 교체 슬롯: 서비스 스크린샷(service.imageSrc — 관리자 업로드 대상).
          지금은 미지정이라 placeholder로 대체한다. */}
      <span className="font-display text-mini tracking-label text-white/40">
        SERVICE IMAGE PLACEHOLDER
      </span>
    </div>
  );
}

interface ServiceMetaProps {
  label: string;
  value: string;
}

/** 개발 언어 | 사업 수행 연도 — 값이 있을 때만 렌더된다. */
function ServiceMeta({ label, value }: ServiceMetaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <SectionLabel color="muted" size="sm">
        {label}
      </SectionLabel>
      <span className="text-detail text-white/70">{value}</span>
    </div>
  );
}

function ServiceText({ service }: { service: ServiceItem }) {
  return (
    <div>
      <h3 className="text-h3 font-bold text-white">{service.title}</h3>
      {/* summary = 레거시 그린 태그라인. text-accent(다크 위 라임) + font-medium으로
          description(white/70)과 위계 분리. token 없음: 가독 폭 max-w-lg(512px) 근사 —
          텍스트-메인(1.1fr) 컬럼에 맞춘 측정폭 */}
      <p className="mt-4 max-w-lg text-body-sm font-medium text-accent">
        {service.summary}
      </p>
      {/* description(optional) — summary와 동일 가독 폭(max-w-lg) 유지 */}
      {service.description && (
        <p className="mt-4 max-w-lg text-body-sm text-white/70">
          {service.description}
        </p>
      )}

      <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-3 border-t border-white/12 pt-6 sm:grid-cols-2">
        {service.features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2.5 text-detail text-white/70"
          >
            <span
              aria-hidden
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
            />
            {feature}
          </li>
        ))}
      </ul>

      {(service.devLanguage || service.year) && (
        <div className="mt-6 flex flex-wrap gap-x-12 gap-y-4 border-t border-white/12 pt-6">
          {service.devLanguage && (
            <ServiceMeta label="개발 언어" value={service.devLanguage} />
          )}
          {service.year && (
            <ServiceMeta label="사업 수행 연도" value={service.year} />
          )}
        </div>
      )}
    </div>
  );
}

/**
 * 서비스소개 전용 에디토리얼 로우. landing ServiceSection / business-intro
 * BusinessAreasSection의 교차 로우·이미지 슬롯 패턴을 재사용하되,
 * features 불릿 리스트와 optional 푸터 메타(개발 언어 | 연도)를 추가한다.
 * 짝수 로우(index % 2 === 1)는 lg+에서 이미지/텍스트 좌우를 교차한다.
 * 정적 데이터뿐 — 서버 컴포넌트.
 */
export function ServiceRow({ service, index, isLast }: ServiceRowProps) {
  const isReversed = index % 2 === 1;
  // 모바일: 번호/텍스트/이미지 세로 스택. lg+에서만 짝수 로우 좌우 교차.
  const orderText = isReversed ? "lg:order-3" : "lg:order-2";
  const orderImage = isReversed ? "lg:order-2" : "lg:order-3";

  return (
    <div
      /* 순수 레이아웃 좌표(색·스페이싱 토큰 무관): 번호 88px + 텍스트 1.1fr +
         이미지 0.9fr — 텍스트-메인 비중. BusinessAreasSection(이미지-메인, 0.85/1.15)의
         대칭 변형이라 Tailwind 표준 유틸로 대체 불가한 arbitrary 트랙 템플릿 */
      className={`grid grid-cols-1 gap-6 py-10 lg:grid-cols-[88px_minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-12 lg:py-16 ${
        isLast ? "" : "border-b border-white/12"
      }`}
    >
      <span className="font-display text-mega font-extrabold leading-none text-accent/35 lg:order-1">
        {service.id}
      </span>
      <div className={orderText}>
        <ServiceText service={service} />
      </div>
      <div className={orderImage}>
        <ServiceImage />
      </div>
    </div>
  );
}
