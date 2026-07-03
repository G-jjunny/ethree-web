import Link from "next/link";
import { SectionLabel } from "@/shared/ui";

interface NewsItem {
  id: string;
  title: string;
  /** ISO 날짜 (YYYY-MM-DD) */
  date: string;
}

/**
 * 향후 Supabase 동적 콘텐츠 후보. 지금은 정적 상수로 유지하고
 * 교체 시 이 배열만 쿼리 결과로 대체한다.
 */
const NEWS_ITEMS: readonly NewsItem[] = [
  {
    id: "1",
    title:
      "서울대학교 보건대학원 이쓰리「화학물질 안전관리 특성화대학원 산학협력 MOU 체결식」체결",
    date: "2026-06-10",
  },
  {
    id: "2",
    title: "[완료] 이쓰리 8차 기후세미나 완료",
    date: "2025-10-01",
  },
  {
    id: "3",
    title: "[공지] 2025.09.30(화) 8차 기후세미나 진행 공지",
    date: "2025-09-18",
  },
];

export function NewsSection() {
  return (
    <section className="bg-surface pt-16 lg:pt-25">
      <div className="content-container">
        <div className="mb-11 flex flex-wrap items-end justify-between gap-10">
          <SectionLabel color="olive">NEWS</SectionLabel>
          <Link
            href="/support/news"
            className="text-eyebrow font-bold text-ink"
          >
            전체보기 →
          </Link>
        </div>

        <ul className="flex flex-col">
          {NEWS_ITEMS.map((item, index) => (
            <li
              key={item.id}
              className={`flex items-baseline justify-between border-t border-hairline py-5.5 ${
                index === NEWS_ITEMS.length - 1 ? "border-b" : ""
              }`}
            >
              <span className="text-list font-medium text-ink">
                {item.title}
              </span>
              <span className="text-meta ml-8 flex-none text-muted">
                {item.date}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
