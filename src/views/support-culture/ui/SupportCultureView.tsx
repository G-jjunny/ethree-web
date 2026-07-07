import {
  PlaceholderHeader,
  PlaceholderSubNav,
} from "@/widgets/placeholder-page";
import { NAV_GROUPS } from "@/shared/constants";
import { getCultureItems } from "@/features/culture";
import { CultureTalentSection } from "./CultureTalentSection";
import { CultureValuesSection } from "./CultureValuesSection";
import { CultureWelfareSection } from "./CultureWelfareSection";

const group = NAV_GROUPS.find((g) => g.href === "/support")!;

/**
 * 기업문화 페이지 조합. business-service와 동일한 공용 헤더 밴드 패턴
 * (bg-surface pt-25 pb-16 lg:pt-30 + content-container) 위에 하위 페이지 SubNav를 둔다.
 * 이후 인재상 → 핵심가치 → 복지·근무환경 밴드를 리듬 있게 이어 붙인다.
 * 콘텐츠는 getCultureItems()(DB, 미연결/에러 시 정적 fallback)에서 로드해 각 섹션에
 * props로 전달한다. SiteHeader/SiteFooter는 (marketing) 그룹 layout이 렌더한다. 서버 컴포넌트.
 */
export async function SupportCultureView() {
  const content = await getCultureItems();

  return (
    <>
      <section className="bg-surface pt-25 pb-16 lg:pt-30">
        <div className="content-container">
          <PlaceholderHeader eyebrow="CUSTOMER SUPPORT" title="기업문화" />
          <PlaceholderSubNav
            siblings={group.children}
            activeHref="/support/culture"
          />
        </div>
      </section>

      <CultureTalentSection items={content.talent} />
      <CultureValuesSection items={content.values} />
      <CultureWelfareSection
        intro={content.welfareIntro}
        benefits={content.welfare}
      />
    </>
  );
}
