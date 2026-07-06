/**
 * 회사 메타정보 반환 타입 (nested camelCase shape).
 * schema.md의 "FE 반환 shape 매핑 계약"과 동일 — `SITE` 상수와 같은 구조로 두어
 * 소비부(footer/header) diff를 최소화한다.
 */
export interface CompanyInfoAddress {
  line1: string;
  line2: string;
}

export interface CompanyInfoContact {
  tel: string;
  fax: string;
  email: string;
}

export interface CompanyInfo {
  name: string;
  nameEn: string;
  legalName: string;
  ceo: string;
  url: string;
  tagline: string;
  description: string;
  address: CompanyInfoAddress;
  contact: CompanyInfoContact;
  copyright: string;
}

/**
 * Server Action(updateCompanyInfo) 반환 shape.
 * 성공/에러를 호출부(useMutation)가 판별할 수 있도록 discriminated union으로 둔다.
 */
export type UpdateCompanyInfoResult =
  | { ok: true }
  | { ok: false; message: string };

/**
 * `company_info` 단건 조회 결과(DB flat/snake_case).
 * gen types 도입 전 수동 정의 — schema.md의 select 컬럼 계약과 일치한다.
 * 모든 컬럼은 DB에서 `not null default ''`이므로 문자열로 받는다.
 */
export interface CompanyInfoRow {
  name: string;
  name_en: string;
  legal_name: string;
  ceo: string;
  url: string;
  tagline: string;
  description: string;
  address_line1: string;
  address_line2: string;
  tel: string;
  fax: string;
  email: string;
  copyright: string;
}
