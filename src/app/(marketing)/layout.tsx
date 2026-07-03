import type { ReactNode } from "react";
import { SiteHeader } from "@/widgets/site-header";
import { SiteFooter } from "@/widgets/site-footer";

interface MarketingLayoutProps {
  children: ReactNode;
}

/**
 * (marketing) 라우트 그룹 공용 레이아웃.
 * SiteHeader는 뷰포트 고정 오버레이라 페이지 콘텐츠 외부 최상단에서 렌더한다.
 */
export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
