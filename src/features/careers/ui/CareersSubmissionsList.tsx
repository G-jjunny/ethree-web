import { SectionLabel } from "@/shared/ui";
import type { CareersSubmission } from "../model";

export interface CareersSubmissionsListProps {
  /** 서버(getAdminSubmissions)에서 주입받은 제출 내역(최신순). */
  submissions: CareersSubmission[];
}

/** ISO 문자열을 한국어 날짜/시간으로 표기. 서버 렌더 기준(고정 로케일). */
function formatCreatedAt(iso: string): string {
  if (!iso) return "-";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/**
 * 관리자 제출 내역 목록(프레젠테이션 서버 컴포넌트).
 * 서버 컴포넌트(page)에서 데이터를 받아 카드 리스트로 렌더한다.
 * name·email·message·created_at·email_sent(발송 여부)를 노출한다.
 */
export function CareersSubmissionsList({
  submissions,
}: CareersSubmissionsListProps) {
  if (submissions.length === 0) {
    return (
      <div className="rounded-card border border-hairline bg-surface-white p-8">
        <p className="text-body-sm text-ink-soft">아직 제출된 내역이 없습니다.</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {submissions.map((submission) => (
        <li
          key={submission.id}
          className="flex flex-col gap-3 rounded-card border border-hairline bg-surface-white p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-body-sm font-semibold text-ink">
                {submission.name}
              </span>
              <span className="text-detail text-ink-soft">
                {submission.email}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <SectionLabel
                color={submission.emailSent ? "olive" : "olive-muted"}
                size="sm"
              >
                {submission.emailSent ? "발송됨" : "미발송"}
              </SectionLabel>
              <span className="text-detail text-muted">
                {formatCreatedAt(submission.createdAt)}
              </span>
            </div>
          </div>
          <p className="whitespace-pre-wrap text-body-sm text-ink-soft">
            {submission.message}
          </p>
        </li>
      ))}
    </ul>
  );
}
