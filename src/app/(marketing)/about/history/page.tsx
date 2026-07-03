import { PlaceholderPage } from "@/widgets/placeholder-page";
import { buildMetadata } from "@/shared/lib";
import { NAV_GROUPS } from "@/shared/constants";

export const metadata = buildMetadata({
  title: "연혁 및 비전",
  description: "이쓰리가 걸어온 길과 앞으로 나아갈 방향을 소개합니다.",
  path: "/about/history",
});

const group = NAV_GROUPS.find((g) => g.href === "/about")!;

export default function HistoryPage() {
  return (
    <PlaceholderPage
      eyebrow="ABOUT E3"
      title="연혁 및 비전"
      description="이쓰리가 걸어온 길과 앞으로 나아갈 방향을 소개합니다."
      siblings={group.children}
      activeHref="/about/history"
    />
  );
}
