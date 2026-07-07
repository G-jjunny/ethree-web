import Link from "next/link";
import { SectionLabel } from "@/shared/ui";
import { buildMetadata } from "@/shared/lib";
import { ADMIN_BASE_PATH } from "@/shared/constants";

export const metadata = buildMetadata({
  title: "관리자 대시보드",
  description: "이쓰리 관리자 대시보드",
  path: "/console",
  noIndex: true,
});

/**
 * 대시보드 홈 — 관리 항목 진입 카드 그리드.
 * 공개 사이트 정보구조(About E3 / About Business / Customer Support)에 맞춰
 * 그룹 배열로 구획한다. 각 그룹은 헤딩 + 카드 그리드로 렌더한다.
 * 카드 마크업 톤은 기존과 동일하게 유지한다(세부 스타일은 이후 polish).
 */
interface ManageItem {
  title: string;
  description: string;
  href: string;
}

interface ManageGroup {
  heading: string;
  items: readonly ManageItem[];
}

const MANAGE_GROUPS: readonly ManageGroup[] = [
  {
    heading: "About E3",
    items: [
      {
        title: "인사말 관리",
        description: "대표 인사말과 핵심가치 문구를 관리합니다.",
        href: `${ADMIN_BASE_PATH}/greeting`,
      },
      {
        title: "연혁 및 비전 관리",
        description: "연혁 타임라인과 비전·파트너사 정보를 관리합니다.",
        href: `${ADMIN_BASE_PATH}/history`,
      },
      {
        title: "오시는 길 관리",
        description: "주소·대중교통·부서 문의 정보를 관리합니다.",
        href: `${ADMIN_BASE_PATH}/location`,
      },
    ],
  },
  {
    heading: "About Business",
    items: [
      {
        title: "사업소개 관리",
        description: "사업영역과 대표 프로젝트 정보를 관리합니다.",
        href: `${ADMIN_BASE_PATH}/business`,
      },
      {
        title: "서비스소개 관리",
        description: "서비스 목록과 상세 정보를 관리합니다.",
        href: `${ADMIN_BASE_PATH}/service`,
      },
    ],
  },
  {
    heading: "Customer Support",
    items: [
      {
        title: "NEWS 관리",
        description: "소식 게시글을 등록·수정·삭제합니다.",
        href: `${ADMIN_BASE_PATH}/news`,
      },
      {
        title: "기업문화 관리",
        description: "인재상·핵심가치·복지 문구를 관리합니다.",
        href: `${ADMIN_BASE_PATH}/culture`,
      },
      {
        title: "인재채용 관리",
        description: "채용 절차 안내와 지원 문의 내역을 관리합니다.",
        href: `${ADMIN_BASE_PATH}/careers`,
      },
    ],
  },
  {
    heading: "기타",
    items: [
      {
        title: "회사 정보 관리",
        description: "회사 메타정보(주소·연락처·소개)를 수정합니다.",
        href: `${ADMIN_BASE_PATH}/company`,
      },
    ],
  },
] as const;

export default function AdminDashboardPage() {
  return (
    <section className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <SectionLabel color="olive">Console</SectionLabel>
        <h1 className="font-display text-h2 font-extrabold text-ink">
          대시보드
        </h1>
        <p className="text-body-sm text-ink-soft">
          관리할 항목을 선택하세요.
        </p>
      </div>

      {MANAGE_GROUPS.map((group) => (
        <div
          key={group.heading}
          className="flex flex-col gap-6 border-t border-hairline pt-10"
        >
          <SectionLabel color="olive" size="sm">
            {group.heading}
          </SectionLabel>

          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex flex-col gap-3 rounded-card border border-hairline bg-surface-white p-6 transition-colors duration-fast ease-out hover:border-ink"
              >
                <h2 className="text-xl font-bold text-ink transition-colors duration-fast ease-out group-hover:text-olive-label">
                  {item.title}
                </h2>
                <p className="text-detail text-ink-soft">{item.description}</p>
                <span
                  aria-hidden
                  className="mt-1 text-xl text-olive-muted transition-all duration-fast ease-out group-hover:translate-x-1 group-hover:text-ink"
                >
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
