import { PlaceholderPage } from "@/widgets/placeholder-page";
import { buildMetadata } from "@/shared/lib";
import { NAV_GROUPS } from "@/shared/constants";

export const metadata = buildMetadata({
  title: "기업문화",
  description: "이쓰리의 기업문화를 소개합니다.",
  path: "/support/culture",
});

const group = NAV_GROUPS.find((g) => g.href === "/support")!;

export default function CulturePage() {
  return (
    <PlaceholderPage
      eyebrow="CUSTOMER SUPPORT"
      title="기업문화"
      description="이쓰리의 기업문화를 소개합니다."
      siblings={group.children}
      activeHref="/support/culture"
    />
  );
}
