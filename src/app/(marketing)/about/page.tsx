import { PlaceholderHub } from "@/widgets/placeholder-page";
import { NAV_GROUPS } from "@/shared/constants";
import { buildMetadata } from "@/shared/lib";

export const metadata = buildMetadata({
  title: "About E3",
  description: "이쓰리를 소개합니다.",
  path: "/about",
});

export default function AboutHubPage() {
  const group = NAV_GROUPS.find((navGroup) => navGroup.href === "/about")!;

  return (
    <PlaceholderHub
      eyebrow="ABOUT E3"
      title="About E3"
      links={group.children}
    />
  );
}
