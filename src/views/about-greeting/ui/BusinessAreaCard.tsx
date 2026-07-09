import Image from "next/image";

import { SectionLabel } from "@/shared/ui";

/**
 * 카드별 배경 구분 틴트 — 실제 이미지(imageSrc) 미확보 시 placeholder를
 * 가시화하기 위한 톤. imageSrc를 채우면 next/image가 이 위를 덮으므로 실제
 * 이미지로 자연스럽게 대체된다. HeroCarousel/SolutionCarousel과 동일한
 * "다크 베이스(bg-ink) + 카드별 단일 색 틴트 로테이션" 패턴을 그대로 재사용.
 */
const AREA_BG_TINT = [
  "bg-linear-to-tr from-brand/20 via-transparent to-transparent",
  "bg-linear-to-tl from-accent/15 via-transparent to-transparent",
  "bg-linear-to-t from-olive/25 via-transparent to-transparent",
];

export interface BusinessAreaCardProps {
  /** 순번 ("01" 등) — 라벨 표기는 컴포넌트 내부에서 "{no} {titleEn}" 형태로 조립 */
  no: string;
  /** 라벨에 쓰일 영문명 (예: "CLIMATE & ENVIRONMENT") */
  titleEn: string;
  /** 큰 볼드 타이틀, 한글 (예: "기후 환경 분야") */
  title: string;
  description: string;
  /** 선택. 없으면 placeholder(틴트 배경 등 기존 톤)로 표시 */
  imageSrc?: string;
}

/**
 * OUR BUSINESS 섹션 전용 카드 — stcube.com Nelmastobart 섹션 레이아웃 참고.
 * CoreValuesSection과 동일한 divide-hairline 3구획 그리드 안에 들어가는 단일 카드.
 * 단, CoreValuesSection은 번호를 text-mega로 초대형 강조하는 반면, 이 카드는
 * 참고 사이트처럼 번호를 절제된 소형 라벨(SectionLabel sm)로만 표기하고
 * 라벨 대신 큰 볼드 타이틀 + 설명 문단 + 하단 이미지 슬롯으로 위계를 만든다.
 * 이 페이지(OUR BUSINESS) 전용 표현이므로 shared/ui로 추출하지 않는다.
 */
export function BusinessAreaCard({
  no,
  titleEn,
  title,
  description,
  imageSrc,
}: BusinessAreaCardProps) {
  const tintIndex = (Number(no) - 1 + AREA_BG_TINT.length) % AREA_BG_TINT.length;

  return (
    <article className="flex flex-col gap-6 py-10 sm:px-10 sm:py-12 sm:first:pl-0 sm:last:pr-0 lg:py-14">
      <div className="h-px w-10 bg-hairline" aria-hidden />

      <SectionLabel color="olive-muted" size="sm">
        {`${no} ${titleEn}`}
      </SectionLabel>

      <div className="flex flex-col gap-3">
        <h3 className="font-display text-xl font-bold text-ink">{title}</h3>
        <p className="text-body-sm text-ink-soft">{description}</p>
      </div>

      <div className="relative mt-auto aspect-square overflow-hidden rounded-tl-[10px] rounded-bl-[10px] rounded-tr-[30px] rounded-br-[30px] bg-ink">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div
            className={`absolute inset-0 ${AREA_BG_TINT[tintIndex] ?? AREA_BG_TINT[0]}`}
            aria-hidden
          />
        )}
      </div>
    </article>
  );
}
