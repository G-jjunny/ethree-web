import { createServerClient } from "@supabase/ssr";
import { unstable_cache } from "next/cache";
import { SITE } from "@/shared/constants";
import type { CompanyInfo, CompanyInfoRow } from "../model";
import { COMPANY_INFO_TAG } from "./companyInfoTag";

/**
 * 공개 사이트(footer/header)가 소비하는 회사정보 서버 getter.
 *
 * 캐싱 전략: 이 프로젝트는 `cacheComponents` 플래그(next.config)를 켜지 않았다.
 * `'use cache'` 디렉티브는 cacheComponents 전용이며(node_modules next 16 docs 확인),
 * 스코프 안에서 `cookies()` 같은 런타임 API도 쓸 수 없다. 따라서 Next 16이 문서화한
 * 비-cacheComponents 등가물 `unstable_cache`로 태그 기반 캐시를 구성한다 —
 * 태그 `company-info`는 Server Action의 `revalidateTag`로 무효화된다.
 *
 * 회사정보는 모든 방문자에게 동일한 공개 데이터이므로, 세션(쿠키) 없는 anon
 * 클라이언트로 읽는다. cookies()를 호출하지 않아 캐시 스코프에 안전하고,
 * anon read는 RLS `public_read` 정책으로 허용된다.
 *
 * fallback: 테이블 미존재(마이그레이션 미실행)/키 미연결/쿼리 에러/행 없음 시
 * 예외를 던지지 않고 `SITE` 상수로 매핑해 반환한다 — 빌드/렌더가 항상 정상.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

const SELECT_COLUMNS =
  "name, name_en, legal_name, ceo, url, tagline, description, address_line1, address_line2, tel, fax, email, copyright";

/** SITE 상수 기반 fallback (email은 SITE에 없으므로 ""). */
function siteFallback(): CompanyInfo {
  return {
    name: SITE.name,
    nameEn: SITE.nameEn,
    legalName: SITE.legalName,
    ceo: SITE.ceo,
    url: SITE.url,
    tagline: SITE.tagline,
    description: SITE.description,
    address: {
      line1: SITE.address.line1,
      line2: SITE.address.line2,
    },
    contact: {
      tel: SITE.contact.tel,
      fax: SITE.contact.fax,
      email: "",
    },
    copyright: SITE.copyright,
  };
}

/** DB flat(snake) → nested camel shape 매핑 (schema.md 계약). */
function mapRowToCompanyInfo(row: CompanyInfoRow): CompanyInfo {
  return {
    name: row.name,
    nameEn: row.name_en,
    legalName: row.legal_name,
    ceo: row.ceo,
    url: row.url,
    tagline: row.tagline,
    description: row.description,
    address: {
      line1: row.address_line1,
      line2: row.address_line2,
    },
    contact: {
      tel: row.tel,
      fax: row.fax,
      email: row.email ?? "",
    },
    copyright: row.copyright,
  };
}

/**
 * 세션 없는 anon 클라이언트. no-op 쿠키 핸들러로 `next/headers`를 건드리지 않아
 * unstable_cache 스코프에서 안전하다.
 */
function createAnonReadClient() {
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return [];
      },
      setAll() {
        /* 읽기 전용 anon 클라이언트 — 쿠키 설정 불필요 */
      },
    },
  });
}

const cachedCompanyInfo = unstable_cache(
  async (): Promise<CompanyInfo> => {
    try {
      const supabase = createAnonReadClient();
      const { data, error } = await supabase
        .from("company_info")
        .select(SELECT_COLUMNS)
        .eq("id", 1)
        .single<CompanyInfoRow>();

      if (error || !data) return siteFallback();

      return mapRowToCompanyInfo(data);
    } catch {
      // 테이블 미존재/키 미연결 등 어떤 예외도 삼키고 안전하게 fallback.
      return siteFallback();
    }
  },
  ["company-info"],
  { tags: [COMPANY_INFO_TAG] },
);

export async function getCompanyInfo(): Promise<CompanyInfo> {
  return cachedCompanyInfo();
}
