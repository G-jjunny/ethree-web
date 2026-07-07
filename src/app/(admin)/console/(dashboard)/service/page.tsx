import { buildMetadata } from "@/shared/lib";
import { ConsoleScaffold } from "../_components/ConsoleScaffold";

export const metadata = buildMetadata({
  title: "서비스소개 관리",
  description: "이쓰리 서비스소개 콘텐츠 관리",
  path: "/console/service",
  noIndex: true,
});

export default function ConsoleServicePage() {
  return (
    <ConsoleScaffold
      title="서비스소개 관리"
      description="사업 소개(About Business) 서비스 목록과 각 서비스의 상세 정보를 관리합니다."
    />
  );
}
