import type { Metadata } from "next";
import { SITE } from "@/shared/constants";

export interface BuildMetadataOptions {
  /** 페이지 고유 제목. `${title} | ${SITE.name}` 형태로 조립된다. */
  title: string;
  /** 선택. 미지정 시 SITE.description을 사용한다. */
  description?: string;
  /** 절대경로 (예: "/about/greeting"). canonical/OpenGraph URL 조립에 사용. */
  path: string;
  /** true면 검색엔진 색인을 차단한다 (관리자 페이지 등). */
  noIndex?: boolean;
}

/**
 * SITE 상수 기반으로 title/description/OpenGraph/Twitter/canonical을
 * 일관되게 조립하는 헬퍼. 모든 page.tsx(또는 generateMetadata)는
 * 이 함수를 통해서만 metadata를 선언한다.
 */
export function buildMetadata({
  title,
  description = SITE.description,
  path,
  noIndex = false,
}: BuildMetadataOptions): Metadata {
  const fullTitle = `${title} | ${SITE.name}`;
  const url = new URL(path, SITE.url).toString();

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE.name,
      locale: "ko_KR",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: fullTitle,
      description,
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}
