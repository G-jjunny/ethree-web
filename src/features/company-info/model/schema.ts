import { z } from "zod";
import type { CompanyInfo } from "./types";

/**
 * 회사정보 편집 폼 검증 스키마 (flat camelCase).
 * - 화면 필수값(name/nameEn/legalName/ceo)은 필수.
 * - url/email은 형식 검증하되 빈 문자열 허용(선택 입력).
 * - 나머지는 선택(빈 문자열 허용).
 * 이 스키마는 클라이언트 폼과 Server Action이 공유한다(입력 계약 단일화).
 */
export const companyInfoFormSchema = z.object({
  name: z.string().trim().min(1, "회사명을 입력하세요"),
  nameEn: z.string().trim().min(1, "브랜드명(영문)을 입력하세요"),
  legalName: z.string().trim().min(1, "법인명을 입력하세요"),
  ceo: z.string().trim().min(1, "대표자를 입력하세요"),
  url: z.union([z.literal(""), z.string().url("올바른 URL 형식이 아닙니다")]),
  tagline: z.string(),
  description: z.string(),
  addressLine1: z.string(),
  addressLine2: z.string(),
  tel: z.string(),
  fax: z.string(),
  email: z.union([z.literal(""), z.string().email("올바른 이메일 형식이 아닙니다")]),
  copyright: z.string(),
});

export type CompanyInfoFormValues = z.infer<typeof companyInfoFormSchema>;

/**
 * nested `CompanyInfo`(getter 반환) → flat 폼 값으로 평탄화한다.
 * 폼 프리필(initialValues)과 Server Action 입력 형태를 일치시키는 순수 함수.
 */
export function companyInfoToFormValues(
  info: CompanyInfo,
): CompanyInfoFormValues {
  return {
    name: info.name,
    nameEn: info.nameEn,
    legalName: info.legalName,
    ceo: info.ceo,
    url: info.url,
    tagline: info.tagline,
    description: info.description,
    addressLine1: info.address.line1,
    addressLine2: info.address.line2,
    tel: info.contact.tel,
    fax: info.contact.fax,
    email: info.contact.email,
    copyright: info.copyright,
  };
}
