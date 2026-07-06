import { LocationView } from "@/views/about-location";
import { buildMetadata } from "@/shared/lib";

export const metadata = buildMetadata({
  title: "오시는길",
  description: "이쓰리 사무실 위치와 대중교통 이용 안내입니다.",
  path: "/about/location",
});

export default function LocationPage() {
  return <LocationView />;
}
