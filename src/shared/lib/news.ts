export interface NewsItem {
  id: string;
  /** URL 슬러그. `/support/news/[slug]` 상세 라우트에 사용. */
  slug: string;
  title: string;
  /** ISO 날짜 (YYYY-MM-DD) */
  date: string;
}

/**
 * 향후 Supabase 동적 콘텐츠 후보. 지금은 정적 상수를 반환하고
 * 교체 시 이 함수 내부만 쿼리 로직으로 바꾸면 된다(호출부는 변경 없음).
 */
const NEWS_ITEMS: readonly NewsItem[] = [
  {
    id: "1",
    slug: "chemical-safety-mou",
    title:
      "서울대학교 보건대학원 이쓰리「화학물질 안전관리 특성화대학원 산학협력 MOU 체결식」체결",
    date: "2026-06-10",
  },
  {
    id: "2",
    slug: "8th-climate-seminar-completed",
    title: "[완료] 이쓰리 8차 기후세미나 완료",
    date: "2025-10-01",
  },
  {
    id: "3",
    slug: "8th-climate-seminar-notice",
    title: "[공지] 2025.09.30(화) 8차 기후세미나 진행 공지",
    date: "2025-09-18",
  },
];

/** NEWS 목록. 최신 데이터가 먼저 오도록 상수 자체 순서를 유지한다. */
export function getNewsList(): readonly NewsItem[] {
  return NEWS_ITEMS;
}

/** slug로 단건 조회. 없으면 undefined — 호출부에서 notFound() 처리. */
export function getNewsBySlug(slug: string): NewsItem | undefined {
  return NEWS_ITEMS.find((item) => item.slug === slug);
}
