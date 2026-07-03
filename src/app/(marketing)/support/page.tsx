import { PlaceholderHub } from "@/widgets/placeholder-page";
import { NAV_GROUPS } from "@/shared/constants";
import { buildMetadata } from "@/shared/lib";

export const metadata = buildMetadata({
  title: "Customer Support",
  description: "이쓰리 고객지원 안내입니다.",
  path: "/support",
});

export default function SupportHubPage() {
  const group = NAV_GROUPS.find((navGroup) => navGroup.href === "/support")!;

  return (
    <PlaceholderHub
      eyebrow="CUSTOMER SUPPORT"
      title="Customer Support"
      links={group.children}
    />
  );
}
