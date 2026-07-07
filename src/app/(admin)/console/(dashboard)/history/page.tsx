import { buildMetadata } from "@/shared/lib";
import { ConsoleScaffold } from "../_components/ConsoleScaffold";

export const metadata = buildMetadata({
  title: "연혁 및 비전 관리",
  description: "이쓰리 연혁 및 비전 콘텐츠 관리",
  path: "/console/history",
  noIndex: true,
});

export default function ConsoleHistoryPage() {
  return (
    <ConsoleScaffold
      title="연혁 및 비전 관리"
      description="회사 소개(About E3) 연혁 타임라인과 비전·파트너사 정보를 관리합니다."
    />
  );
}
