import { buildMetadata } from "@/shared/lib";
import { ConsoleScaffold } from "../_components/ConsoleScaffold";

export const metadata = buildMetadata({
  title: "인재채용 관리",
  description: "이쓰리 인재채용 콘텐츠 관리",
  path: "/console/careers",
  noIndex: true,
});

export default function ConsoleCareersPage() {
  return (
    <ConsoleScaffold
      title="인재채용 관리"
      description="고객지원(Customer Support) 인재채용 페이지의 채용 절차 안내와 지원 문의 내역을 관리합니다."
    />
  );
}
