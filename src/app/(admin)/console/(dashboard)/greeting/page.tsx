import { buildMetadata } from "@/shared/lib";
import { ConsoleScaffold } from "../_components/ConsoleScaffold";

export const metadata = buildMetadata({
  title: "인사말 관리",
  description: "이쓰리 인사말 콘텐츠 관리",
  path: "/console/greeting",
  noIndex: true,
});

export default function ConsoleGreetingPage() {
  return (
    <ConsoleScaffold
      title="인사말 관리"
      description="회사 소개(About E3) 인사말 페이지의 대표 인사말·핵심가치 문구를 관리합니다."
    />
  );
}
