import { PlaceholderHub } from "@/widgets/placeholder-page";
import { NAV_GROUPS } from "@/shared/constants";
import { buildMetadata } from "@/shared/lib";

export const metadata = buildMetadata({
  title: "About Business",
  description: "이쓰리의 사업과 서비스를 소개합니다.",
  path: "/business",
});

export default function BusinessHubPage() {
  const group = NAV_GROUPS.find((navGroup) => navGroup.href === "/business")!;

  return (
    <PlaceholderHub
      eyebrow="ABOUT BUSINESS"
      title="About Business"
      links={group.children}
    />
  );
}
