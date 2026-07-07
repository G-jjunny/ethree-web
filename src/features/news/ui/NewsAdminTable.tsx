"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ADMIN_BASE_PATH } from "@/shared/constants";
// 배럴 서버유출 방지: 클라 컴포넌트이므로 하위 파일에서 직접 import.
import type { NewsAdminItem } from "../model/types";
import { deleteNews } from "../api/deleteNews";

export interface NewsAdminTableProps {
  items: readonly NewsAdminItem[];
}

const CELL_CLASS = "px-4 py-3 text-sm text-ink";
const HEAD_CLASS = "px-4 py-3 text-detail font-medium text-ink-soft text-left";
const ACTION_LINK_CLASS =
  "text-detail font-medium text-olive-label transition-colors duration-fast ease-out hover:text-ink";

/**
 * 관리자 News 목록 테이블("use client").
 * 제목·발행상태·날짜·수정 링크·삭제(확인 후 deleteNews)를 렌더한다.
 * 삭제는 Server Action 호출 후 router.refresh로 목록을 갱신한다.
 */
export function NewsAdminTable({ items }: NewsAdminTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = (item: NewsAdminItem) => {
    const confirmed = window.confirm(
      `"${item.title}" 글을 삭제하시겠습니까? 되돌릴 수 없습니다.`,
    );
    if (!confirmed) return;

    setError(null);
    setDeletingId(item.id);
    startTransition(async () => {
      const result = await deleteNews(item.id);
      setDeletingId(null);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      router.refresh();
    });
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-card border border-dashed border-hairline bg-surface-white px-8 py-14 text-center">
        <span className="text-detail font-medium text-ink-soft">
          등록된 글이 없습니다.
        </span>
        <span className="text-meta text-muted">
          우측 상단의 &quot;새 글&quot; 버튼으로 첫 글을 작성하세요.
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {error && (
        <p role="alert" className="text-detail text-danger">
          {error}
        </p>
      )}
      <div className="overflow-x-auto rounded-card border border-hairline bg-surface-white">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-hairline">
              <th className={HEAD_CLASS}>제목</th>
              <th className={HEAD_CLASS}>상태</th>
              <th className={HEAD_CLASS}>날짜</th>
              <th className={`${HEAD_CLASS} text-right`}>관리</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-b border-hairline last:border-b-0"
              >
                <td className={CELL_CLASS}>
                  <span className="font-medium">{item.title}</span>
                  <span className="mt-0.5 block text-meta text-muted">
                    /{item.slug}
                  </span>
                </td>
                <td className={CELL_CLASS}>
                  <span
                    className={
                      item.published
                        ? "text-detail font-medium text-olive-label"
                        : "text-detail font-medium text-muted"
                    }
                  >
                    {item.published ? "발행" : "초안"}
                  </span>
                </td>
                <td className={`${CELL_CLASS} text-muted`}>{item.date}</td>
                <td className={`${CELL_CLASS} text-right`}>
                  <div className="inline-flex items-center gap-4">
                    <Link
                      href={`${ADMIN_BASE_PATH}/news/${item.id}/edit`}
                      className={ACTION_LINK_CLASS}
                    >
                      수정
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      disabled={isPending && deletingId === item.id}
                      className="text-detail font-medium text-danger transition-colors duration-fast ease-out hover:opacity-80 disabled:opacity-50"
                    >
                      {isPending && deletingId === item.id
                        ? "삭제 중..."
                        : "삭제"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
