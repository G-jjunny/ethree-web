import { PlaceholderPage } from "@/widgets/placeholder-page";
import { buildMetadata } from "@/shared/lib";
import { NAV_GROUPS } from "@/shared/constants";

export const metadata = buildMetadata({
  title: "사업소개",
  description: "이쓰리의 사업 영역을 소개합니다.",
  path: "/business/intro",
});

const group = NAV_GROUPS.find((g) => g.href === "/business")!;

export default function BusinessIntroPage() {
  return (
    <PlaceholderPage
      eyebrow="ABOUT BUSINESS"
      title="사업소개"
      description="이쓰리의 사업 영역을 소개합니다."
      siblings={group.children}
      activeHref="/business/intro"
    />
  );
}
