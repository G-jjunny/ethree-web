import { SupportCultureView } from "@/views/support-culture";
import { buildMetadata } from "@/shared/lib";

export const metadata = buildMetadata({
  title: "기업문화",
  description: "이쓰리의 기업문화를 소개합니다.",
  path: "/support/culture",
});

export default function CulturePage() {
  return <SupportCultureView />;
}
