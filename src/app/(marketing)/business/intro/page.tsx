import { BusinessIntroView } from "@/views/business-intro";
import { buildMetadata } from "@/shared/lib";

export const metadata = buildMetadata({
  title: "사업소개",
  description: "이쓰리의 사업 영역을 소개합니다.",
  path: "/business/intro",
});

export default function BusinessIntroPage() {
  return <BusinessIntroView />;
}
