import { buildMetadata } from "@/shared/lib";
import { ConsoleScaffold } from "../_components/ConsoleScaffold";

export const metadata = buildMetadata({
  title: "오시는 길 관리",
  description: "이쓰리 오시는 길 콘텐츠 관리",
  path: "/console/location",
  noIndex: true,
});

export default function ConsoleLocationPage() {
  return (
    <ConsoleScaffold
      title="오시는 길 관리"
      description="회사 소개(About E3) 오시는 길 페이지의 주소·대중교통·부서 문의 정보를 관리합니다."
    />
  );
}
