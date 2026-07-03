import { PlaceholderPage } from "@/widgets/placeholder-page";
import { buildMetadata } from "@/shared/lib";
import { NAV_GROUPS } from "@/shared/constants";

export const metadata = buildMetadata({
  title: "오시는길",
  description: "이쓰리 사무실 위치를 안내합니다.",
  path: "/about/location",
});

const group = NAV_GROUPS.find((g) => g.href === "/about")!;

export default function LocationPage() {
  return (
    <PlaceholderPage
      eyebrow="ABOUT E3"
      title="오시는길"
      description="이쓰리 사무실 위치를 안내합니다."
      siblings={group.children}
      activeHref="/about/location"
    />
  );
}
