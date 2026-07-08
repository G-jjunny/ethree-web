import Link from "next/link";
import { SectionLabel } from "@/shared/ui";
import { buildMetadata } from "@/shared/lib";
import { ADMIN_BASE_PATH } from "@/shared/constants";

export const metadata = buildMetadata({
  title: "랜딩페이지 관리",
  description: "이쓰리 랜딩페이지 콘텐츠 관리",
  path: "/console/landing",
  noIndex: true,
});

const LANDING_BLOCKS = [
  {
    title: "솔루션 캐러셀",
    description:
      "About Business 섹션의 솔루션 슬라이드(제목·설명·이미지·순서)를 관리합니다.",
    href: `${ADMIN_BASE_PATH}/landing/solutions`,
  },
] as const;

/**
 * "랜딩페이지 관리" 허브(서버 컴포넌트).
 * 랜딩 페이지의 관리 가능한 콘텐츠 블록을 카드로 노출한다. 현재는 솔루션 캐러셀만
 * 연결되어 있고, 향후 다른 블록이 추가되면 LANDING_BLOCKS에 항목만 늘리면 된다.
 */
export default function ConsoleLandingPage() {
  return (
    <section className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <SectionLabel color="olive">Console</SectionLabel>
        <h1 className="font-display text-h2 font-extrabold text-ink">
          랜딩페이지 관리
        </h1>
        <p className="text-body-sm text-ink-soft">
          공개 랜딩 페이지에 노출되는 콘텐츠 블록을 관리합니다.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {LANDING_BLOCKS.map((block) => (
          <Link
            key={block.href}
            href={block.href}
            className="flex flex-col gap-2 rounded-card border border-hairline bg-surface-white p-6 transition-colors duration-fast ease-out hover:border-brand"
          >
            <h2 className="font-display text-lg font-bold text-ink">
              {block.title}
            </h2>
            <p className="text-body-sm text-ink-soft">{block.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
