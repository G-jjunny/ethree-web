import { PlaceholderPage } from "@/widgets/placeholder-page";
import { buildMetadata } from "@/shared/lib";

export const metadata = buildMetadata({
  title: "인재채용",
  description: "이쓰리와 함께할 인재를 찾습니다.",
  path: "/support/careers",
});

export default function CareersPage() {
  return (
    <PlaceholderPage
      eyebrow="CUSTOMER SUPPORT"
      title="인재채용"
      description="이쓰리와 함께할 인재를 찾습니다."
    />
  );
}
