import { PlaceholderPage } from "@/widgets/placeholder-page";
import { buildMetadata } from "@/shared/lib";
import { NAV_GROUPS } from "@/shared/constants";

export const metadata = buildMetadata({
  title: "인재채용",
  description: "이쓰리와 함께할 인재를 찾습니다.",
  path: "/support/careers",
});

const group = NAV_GROUPS.find((g) => g.href === "/support")!;

export default function CareersPage() {
  return (
    <PlaceholderPage
      eyebrow="CUSTOMER SUPPORT"
      title="인재채용"
      description="이쓰리와 함께할 인재를 찾습니다."
      siblings={group.children}
      activeHref="/support/careers"
    />
  );
}
