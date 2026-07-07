"use client";

import { useState } from "react";
import { SectionLabel, Button } from "@/shared/ui";
// 배럴 서버유출 방지: 클라 컴포넌트이므로 하위 파일에서 직접 import.
import type { CultureGroup, CultureItem } from "../model/types";
import { CultureItemForm } from "./CultureItemForm";

export interface CultureAdminManagerProps {
  /** getAdminCultureItems() 로 로드한 전량(group·sort_order 정렬). */
  items: readonly CultureItem[];
}

interface GroupMeta {
  group: CultureGroup;
  title: string;
  description: string;
  /** welfare_intro 는 단건이라 추가를 막는다(schema.md 정책). */
  allowAdd: boolean;
}

const GROUP_META: readonly GroupMeta[] = [
  {
    group: "talent",
    title: "인재상",
    description: "이쓰리가 지향하는 인재의 특성. 배지(01·02·03)와 함께 노출됩니다.",
    allowAdd: true,
  },
  {
    group: "value",
    title: "핵심가치",
    description: "조직이 일하는 방식의 기준. IconCard 그리드로 노출됩니다.",
    allowAdd: true,
  },
  {
    group: "welfare_intro",
    title: "복지 섹션 인트로",
    description: "복지·근무환경 섹션의 헤더 제목/설명. 단건이므로 수정만 가능합니다.",
    allowAdd: false,
  },
  {
    group: "welfare",
    title: "복지·근무환경",
    description: "구성원이 몰입할 수 있는 환경을 소개하는 benefit 항목.",
    allowAdd: true,
  },
];

/**
 * 기업문화 콘텐츠 관리 UI("use client").
 * group(인재상/핵심가치/복지 인트로/복지)별로 항목 목록 + 수정/삭제 폼과 추가 폼을
 * 렌더한다. 저장/삭제는 각 CultureItemForm 이 Server Action + router.refresh 로 처리한다.
 * 마크업은 뼈대(명백한 토큰) 위주 — 정교한 스타일은 design polish 단계.
 */
export function CultureAdminManager({ items }: CultureAdminManagerProps) {
  const [addingGroup, setAddingGroup] = useState<CultureGroup | null>(null);

  const itemsByGroup = (group: CultureGroup): CultureItem[] =>
    items
      .filter((it) => it.group === group)
      .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="flex flex-col gap-12">
      {GROUP_META.map((meta) => {
        const groupItems = itemsByGroup(meta.group);
        const isAdding = addingGroup === meta.group;

        return (
          <section key={meta.group} className="flex flex-col gap-6">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-hairline pb-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <SectionLabel color="olive" size="sm">
                    {meta.title}
                  </SectionLabel>
                  <span className="inline-flex items-center rounded-pill border border-hairline px-3 py-1 text-caption font-medium text-muted">
                    {meta.allowAdd ? `${groupItems.length}개 항목` : "단건 항목"}
                  </span>
                </div>
                <p className="text-body-sm text-ink-soft">{meta.description}</p>
              </div>
              {meta.allowAdd && !isAdding && (
                <Button
                  type="button"
                  variant="outline-light"
                  size="sm"
                  onClick={() => setAddingGroup(meta.group)}
                >
                  항목 추가
                </Button>
              )}
            </div>

            {groupItems.length === 0 && !isAdding && (
              <div className="rounded-card border border-dashed border-hairline bg-surface-white px-8 py-10 text-center text-detail text-ink-soft">
                등록된 항목이 없습니다.
                {meta.allowAdd
                  ? ' "항목 추가" 버튼으로 첫 항목을 등록하세요.'
                  : " 마이그레이션 seed 적용 후 인트로 항목이 표시됩니다."}
              </div>
            )}

            <div className="flex flex-col gap-5">
              {groupItems.map((item) => (
                <CultureItemForm
                  key={item.id}
                  mode="update"
                  group={meta.group}
                  item={item}
                />
              ))}

              {isAdding && (
                <CultureItemForm
                  mode="create"
                  group={meta.group}
                  onDone={() => setAddingGroup(null)}
                  onCancel={() => setAddingGroup(null)}
                />
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
