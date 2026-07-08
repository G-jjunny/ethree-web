"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ADMIN_BASE_PATH } from "@/shared/constants";
import { Badge } from "@/shared/ui";
// 배럴 서버유출 방지: 클라 컴포넌트이므로 하위 파일에서 직접 import.
import type { SolutionAdminItem } from "../model/types";
import { deleteSolutionSlide } from "../api/deleteSolutionSlide";
import { reorderSolutionSlides } from "../api/reorderSolutionSlides";

export interface SolutionAdminTableProps {
  items: readonly SolutionAdminItem[];
}

const CELL_CLASS = "px-4 py-3 text-sm text-ink";
const HEAD_CLASS = "px-4 py-3 text-detail font-medium text-ink-soft text-left";
const ACTION_LINK_CLASS =
  "text-detail font-medium text-olive-label transition-colors duration-fast ease-out hover:text-ink";
const ORDER_BUTTON_CLASS =
  "flex size-7 items-center justify-center rounded-card border border-hairline text-ink-soft transition-colors duration-fast ease-out hover:border-brand hover:text-brand disabled:opacity-30 disabled:pointer-events-none";

/**
 * 관리자 Solution 슬라이드 목록 테이블("use client").
 * 순서(위/아래 이동)·제목(강조 텍스트 포함)·노출상태·수정 링크·삭제를 렌더한다.
 * 순서 변경/삭제는 Server Action 호출 후 router.refresh로 목록을 갱신한다.
 */
export function SolutionAdminTable({ items }: SolutionAdminTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sorted = [...items].sort((a, b) => a.sortOrder - b.sortOrder);

  const handleDelete = (item: SolutionAdminItem) => {
    const confirmed = window.confirm(
      `"${item.title} ${item.titleAccent}" 슬라이드를 삭제하시겠습니까? 되돌릴 수 없습니다.`,
    );
    if (!confirmed) return;

    setError(null);
    setBusyId(item.id);
    startTransition(async () => {
      const result = await deleteSolutionSlide(item.id);
      setBusyId(null);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      router.refresh();
    });
  };

  const handleMove = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;

    const nextOrder = [...sorted];
    const [moved] = nextOrder.splice(index, 1);
    nextOrder.splice(targetIndex, 0, moved);

    setError(null);
    setBusyId(moved.id);
    startTransition(async () => {
      const result = await reorderSolutionSlides(nextOrder.map((s) => s.id));
      setBusyId(null);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      router.refresh();
    });
  };

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-card border border-dashed border-hairline bg-surface-white px-8 py-14 text-center">
        <span className="text-detail font-medium text-ink-soft">
          등록된 슬라이드가 없습니다.
        </span>
        <span className="text-meta text-muted">
          우측 상단의 &quot;새 슬라이드&quot; 버튼으로 첫 슬라이드를 등록하세요.
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
              <th className={HEAD_CLASS}>순서</th>
              <th className={HEAD_CLASS}>제목</th>
              <th className={HEAD_CLASS}>노출</th>
              <th className={`${HEAD_CLASS} text-right`}>관리</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((item, index) => (
              <tr
                key={item.id}
                className="border-b border-hairline last:border-b-0"
              >
                <td className={CELL_CLASS}>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      aria-label="위로 이동"
                      disabled={index === 0 || (isPending && busyId === item.id)}
                      onClick={() => handleMove(index, -1)}
                      className={ORDER_BUTTON_CLASS}
                    >
                      &#8593;
                    </button>
                    <button
                      type="button"
                      aria-label="아래로 이동"
                      disabled={
                        index === sorted.length - 1 ||
                        (isPending && busyId === item.id)
                      }
                      onClick={() => handleMove(index, 1)}
                      className={ORDER_BUTTON_CLASS}
                    >
                      &#8595;
                    </button>
                  </div>
                </td>
                <td className={CELL_CLASS}>
                  <span className="font-medium">
                    {item.title}{" "}
                    <span className="text-brand">{item.titleAccent}</span>
                  </span>
                </td>
                <td className={CELL_CLASS}>
                  <Badge variant={item.isActive ? "active" : "muted"}>
                    {item.isActive ? "노출" : "숨김"}
                  </Badge>
                </td>
                <td className={`${CELL_CLASS} text-right`}>
                  <div className="inline-flex items-center gap-4">
                    <Link
                      href={`${ADMIN_BASE_PATH}/landing/solutions/${item.id}/edit`}
                      className={ACTION_LINK_CLASS}
                    >
                      수정
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      disabled={isPending && busyId === item.id}
                      className="text-detail font-medium text-danger transition-colors duration-fast ease-out hover:opacity-80 disabled:opacity-50"
                    >
                      {isPending && busyId === item.id ? "처리 중..." : "삭제"}
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
