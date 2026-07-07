import { buildMetadata } from "@/shared/lib";
import { ConsoleScaffold } from "../_components/ConsoleScaffold";

export const metadata = buildMetadata({
  title: "NEWS 관리",
  description: "이쓰리 NEWS 콘텐츠 관리",
  path: "/console/news",
  noIndex: true,
});

export default function ConsoleNewsPage() {
  return (
    <ConsoleScaffold
      title="NEWS 관리"
      description="고객지원(Customer Support) NEWS의 소식 게시글을 등록·수정·삭제합니다."
    />
  );
}
