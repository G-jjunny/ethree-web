import { PlaceholderPage } from "@/widgets/placeholder-page";
import { buildMetadata } from "@/shared/lib";

export const metadata = buildMetadata({
  title: "서비스소개",
  description: "이쓰리가 제공하는 서비스를 소개합니다.",
  path: "/business/service",
});

export default function BusinessServicePage() {
  return (
    <PlaceholderPage
      eyebrow="ABOUT BUSINESS"
      title="서비스소개"
      description="이쓰리가 제공하는 서비스를 소개합니다."
    />
  );
}
