import Link from "next/link";
import { SectionLabel } from "@/shared/ui";
import { buildMetadata } from "@/shared/lib";
import { ADMIN_BASE_PATH } from "@/shared/constants";
import { getAdminNewsList, NewsAdminTable } from "@/features/news";

export const metadata = buildMetadata({
  title: "NEWS 관리",
  description: "이쓰리 NEWS 콘텐츠 관리",
  path: "/console/news",
  noIndex: true,
});

/**
 * NEWS 관리 목록(서버 컴포넌트).
 * getAdminNewsList()로 초안 포함 전체를 로드해 NewsAdminTable에 전달한다.
 * "새 글" 버튼으로 작성 페이지(/console/news/new)로 이동한다.
 */
export default async function ConsoleNewsPage() {
  const items = await getAdminNewsList();

  return (
    <section className="flex flex-col gap-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-3">
          <SectionLabel color="olive">Console</SectionLabel>
          <h1 className="font-display text-h2 font-extrabold text-ink">
            NEWS 관리
          </h1>
          <p className="text-body-sm text-ink-soft">
            고객지원(Customer Support) NEWS의 소식 게시글을 등록·수정·삭제합니다.
          </p>
        </div>
        <Link
          href={`${ADMIN_BASE_PATH}/news/new`}
          className="inline-flex items-center justify-center rounded-pill bg-ink px-7 py-3.5 font-display text-sm font-bold text-white transition-colors duration-fast ease-out hover:opacity-90"
        >
          새 글
        </Link>
      </div>

      <NewsAdminTable items={items} />
    </section>
  );
}
