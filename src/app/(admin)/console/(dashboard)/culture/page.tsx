import { buildMetadata } from "@/shared/lib";
import { ConsoleScaffold } from "../_components/ConsoleScaffold";

export const metadata = buildMetadata({
  title: "기업문화 관리",
  description: "이쓰리 기업문화 콘텐츠 관리",
  path: "/console/culture",
  noIndex: true,
});

export default function ConsoleCulturePage() {
  return (
    <ConsoleScaffold
      title="기업문화 관리"
      description="고객지원(Customer Support) 기업문화 페이지의 인재상·핵심가치·복지 문구를 관리합니다."
    />
  );
}
