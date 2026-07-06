"use server";

import { revalidateTag, revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/shared/api/supabaseServerClient";
import {
  companyInfoFormSchema,
  type CompanyInfoFormValues,
  type UpdateCompanyInfoResult,
} from "../model";
import { COMPANY_INFO_TAG } from "./companyInfoTag";

/**
 * 회사정보 수정 Server Action.
 *
 * 인가: `createServerSupabaseClient()`(쿠키 기반 인증 세션)로 `getUser()` 확인.
 *   미인증이면 거부한다. **service_role 키 사용 금지** — RLS `admin_update` 정책이
 *   authenticated 세션을 검증하므로 사용자 세션 클라이언트로 update해야 인가 경계가 선다.
 *
 * 검증: 클라이언트에서 온 입력은 신뢰할 수 없으므로 zod로 재파싱한다.
 *
 * 매핑: flat/camel 폼 값 → DB flat/snake payload. `id`/`updated_at`은 제외
 *   (id 고정, updated_at은 트리거 자동 갱신).
 *
 * 무효화: 성공 시 `revalidateTag('company-info')`로 getter 캐시를 무효화하고,
 *   footer가 렌더되는 공개 루트도 `revalidatePath('/')`로 갱신한다.
 */
export async function updateCompanyInfo(
  input: CompanyInfoFormValues,
): Promise<UpdateCompanyInfoResult> {
  const parsed = companyInfoFormSchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다.";
    return { ok: false, message: first };
  }

  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { ok: false, message: "인증이 필요합니다. 다시 로그인해 주세요." };
  }

  const v = parsed.data;
  const { error } = await supabase
    .from("company_info")
    .update({
      name: v.name,
      name_en: v.nameEn,
      legal_name: v.legalName,
      ceo: v.ceo,
      url: v.url,
      tagline: v.tagline,
      description: v.description,
      address_line1: v.addressLine1,
      address_line2: v.addressLine2,
      tel: v.tel,
      fax: v.fax,
      email: v.email,
      copyright: v.copyright,
    })
    .eq("id", 1);

  if (error) {
    return { ok: false, message: "저장에 실패했습니다. 잠시 후 다시 시도해 주세요." };
  }

  // Next 16: revalidateTag(tag, profile) — 두 번째 인자(stale 윈도우)는 필수다.
  // "max"는 문서 권장값(가장 긴 stale-while-revalidate 윈도우).
  revalidateTag(COMPANY_INFO_TAG, "max");
  revalidatePath("/");

  return { ok: true };
}
