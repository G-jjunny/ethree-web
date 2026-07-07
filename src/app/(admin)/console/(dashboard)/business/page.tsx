import { buildMetadata } from "@/shared/lib";
import { ConsoleScaffold } from "../_components/ConsoleScaffold";

export const metadata = buildMetadata({
  title: "사업소개 관리",
  description: "이쓰리 사업소개 콘텐츠 관리",
  path: "/console/business",
  noIndex: true,
});

export default function ConsoleBusinessPage() {
  return (
    <ConsoleScaffold
      title="사업소개 관리"
      description="사업 소개(About Business) 사업영역과 대표 프로젝트 정보를 관리합니다."
    />
  );
}
