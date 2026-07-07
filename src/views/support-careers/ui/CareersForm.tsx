"use client";

import type { FormEvent } from "react";
import { Button } from "@/shared/ui";

/**
 * 인재채용 지원/문의 폼(클라이언트 최소 경계).
 * 현재는 UI만 제공하며 실제 전송 로직은 없다.
 * Phase 4에서 onSubmit을 /api/careers Route Handler(useMutation) 연결로 대체한다.
 * 지금은 preventDefault로 제출을 막아 정적 상태로 둔다.
 */
const FIELD_CLASS =
  "w-full rounded-card border border-hairline bg-surface-white px-4 py-3 text-body-sm text-ink placeholder:text-muted transition-colors duration-fast ease-out focus:border-olive-label focus:outline-none";

export function CareersForm() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    // Phase 4: /api/careers 연동(useMutation) 전까지 제출을 비활성화한다.
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="careers-name"
            className="text-detail font-medium text-ink"
          >
            이름
          </label>
          <input
            id="careers-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="이름을 입력해 주세요"
            className={FIELD_CLASS}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="careers-email"
            className="text-detail font-medium text-ink"
          >
            이메일
          </label>
          <input
            id="careers-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="회신받을 이메일을 입력해 주세요"
            className={FIELD_CLASS}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="careers-message"
          className="text-detail font-medium text-ink"
        >
          내용
        </label>
        <textarea
          id="careers-message"
          name="message"
          rows={6}
          placeholder="지원 직무나 문의 내용을 자유롭게 작성해 주세요"
          className={`${FIELD_CLASS} resize-y`}
        />
      </div>

      <div>
        {/* Phase 4에서 전송 로직 연결 전까지 제출 비활성 */}
        <Button type="submit" variant="primary" size="md" disabled>
          지원 · 문의 보내기
        </Button>
      </div>
    </form>
  );
}
