import type { ReactNode } from "react";
import { SiteHeader } from "@/widgets/site-header";
import { SiteFooter } from "@/widgets/site-footer";
import { getCompanyInfo } from "@/features/company-info";

interface MarketingLayoutProps {
  children: ReactNode;
}

/**
 * (marketing) 라우트 그룹 공용 레이아웃(서버 컴포넌트).
 * SiteHeader는 뷰포트 고정 오버레이라 페이지 콘텐츠 외부 최상단에서 렌더한다.
 * SiteHeader가 "use client"라 서버 getter를 직접 호출할 수 없으므로,
 * 여기서 getCompanyInfo()를 호출해 회사정보를 prop으로 주입한다
 * (SiteFooter는 서버 컴포넌트라 자체적으로 조회). getter는 캐시(unstable_cache)되어
 * 두 소비부가 호출해도 동일 요청 내 중복 DB 조회가 발생하지 않는다.
 */
export default async function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  const company = await getCompanyInfo();

  return (
    <>
      <SiteHeader company={company} />
      {children}
      <SiteFooter />
    </>
  );
}
