import { HistoryView } from "@/views/about-history";
import { buildMetadata } from "@/shared/lib";

export const metadata = buildMetadata({
  title: "연혁 및 비전",
  description: "이쓰리가 걸어온 길과 앞으로 나아갈 방향을 소개합니다.",
  path: "/about/history",
});

export default function HistoryPage() {
  return <HistoryView />;
}
