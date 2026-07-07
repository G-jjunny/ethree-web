import { SectionLabel } from "@/shared/ui";
import { buildMetadata } from "@/shared/lib";
import {
  getCareersSettings,
  getAdminSubmissions,
  CareersSettingsForm,
  CareersSubmissionsList,
} from "@/features/careers";

export const metadata = buildMetadata({
  title: "인재채용 관리",
  description: "이쓰리 인재채용 지원/문의 내역 및 수신 이메일 관리",
  path: "/console/careers",
  noIndex: true,
});

/**
 * 인재채용 관리 페이지(서버 컴포넌트).
 * getCareersSettings/getAdminSubmissions 로 데이터를 로드해
 * 수신 이메일 설정 폼과 제출 내역 목록에 전달한다.
 * 대시보드 크롬 route group((dashboard)) 안에 위치한다.
 */
export default async function ConsoleCareersPage() {
  const [settings, submissions] = await Promise.all([
    getCareersSettings(),
    getAdminSubmissions(),
  ]);

  return (
    <section className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <SectionLabel color="olive">Console</SectionLabel>
        <h1 className="font-display text-h2 font-extrabold text-ink">
          인재채용 관리
        </h1>
        <p className="text-body-sm text-ink-soft">
          인재채용 지원/문의 수신 이메일을 설정하고, 접수된 제출 내역을
          확인합니다.
        </p>
      </div>

      <div className="rounded-card border border-hairline bg-surface-white p-8">
        <CareersSettingsForm initialValues={settings} />
      </div>

      <div className="flex flex-col gap-5">
        <SectionLabel color="olive" size="sm">
          제출 내역
        </SectionLabel>
        <CareersSubmissionsList submissions={submissions} />
      </div>
    </section>
  );
}
