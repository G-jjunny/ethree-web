import { PlaceholderPage } from "@/widgets/placeholder-page";
import { buildMetadata } from "@/shared/lib";
import { NAV_GROUPS } from "@/shared/constants";

export const metadata = buildMetadata({
  title: "인사말",
  description: "이쓰리를 찾아주셔서 감사합니다.",
  path: "/about/greeting",
});

const group = NAV_GROUPS.find((g) => g.href === "/about")!;

export default function GreetingPage() {
  return (
    <PlaceholderPage
      eyebrow="ABOUT E3"
      title="인사말"
      description="이쓰리를 찾아주셔서 감사합니다."
      siblings={group.children}
      activeHref="/about/greeting"
    />
  );
}
