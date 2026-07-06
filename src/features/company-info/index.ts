/**
 * features/company-info Public API.
 *
 * ⚠️ 배럴 서버/클라 유출 경계 (useLoginMutation.ts 주석과 동일 원리)
 * 이 배럴은 서버 전용 getter(getCompanyInfo — unstable_cache + anon 서버 클라이언트)와
 * Server Action(updateCompanyInfo), 그리고 클라이언트 컴포넌트(CompanyInfoForm)를 함께
 * 노출한다. 배럴에서 무엇이든 import하면 번들러가 배럴 모듈 그래프 전체(=서버 전용 코드)를
 * 끌어오므로, **이 배럴은 서버 컴포넌트에서만 소비한다**:
 *   - SiteFooter(서버), (marketing) layout(서버), console/company/page(서버)
 *
 * 유일한 클라이언트 컴포넌트인 CompanyInfoForm은 이 배럴을 import하지 않고
 * 필요한 것(model, updateCompanyInfo Server Action)을 하위 파일에서 직접 import한다.
 * 따라서 클라 번들에 getCompanyInfo(서버 전용)가 유입되지 않는다.
 *
 * 원칙(슬라이스는 index.ts로 노출)과 서버유출 방지 사이의 균형:
 * 외부 소비부는 이 index.ts를 경유하되, 슬라이스 내부의 클라 컴포넌트만
 * 예외적으로 하위 직접 import를 허용한다(서버코드 클라 유입 차단이 목적).
 */

// 서버 전용 (next/headers · unstable_cache 경유) — 서버 컴포넌트에서만 소비
export { getCompanyInfo } from "./api/getCompanyInfo";
export { updateCompanyInfo } from "./api/updateCompanyInfo";

// 클라이언트 컴포넌트 — 서버 컴포넌트(page)에서 렌더 지점에 배치
export { CompanyInfoForm } from "./ui/CompanyInfoForm";
export type { CompanyInfoFormProps } from "./ui/CompanyInfoForm";

// model 타입/스키마 (순수 · 클라/서버 안전)
export type {
  CompanyInfo,
  CompanyInfoAddress,
  CompanyInfoContact,
  CompanyInfoFormValues,
  UpdateCompanyInfoResult,
} from "./model";
export { companyInfoFormSchema, companyInfoToFormValues } from "./model";
