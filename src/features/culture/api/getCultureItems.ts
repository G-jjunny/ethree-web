import { createServerClient } from "@supabase/ssr";
import { unstable_cache } from "next/cache";
// fallback 원본: 정적 콘텐츠 SSOT(슬라이스 내부 상수). 마이그레이션 미적용/미연결/에러 시
// 이 상수로 동일 shape 를 구성해 공개 페이지가 항상 정상 렌더되게 한다.
// (FSD 정방향: 자기 슬라이스 model 에서 import. 구 views 의존 제거.)
import { TALENT_TRAITS, CULTURE_VALUES, WELFARE } from "../model/fallback";
import type { CultureContent, CultureItem, CultureItemRow } from "../model";
import { CULTURE_TAG } from "./cultureTag";

/**
 * 공개 기업문화 콘텐츠 서버 getter.
 *
 * 캐싱: news getter와 동일 전략 — `unstable_cache` + 태그 `culture`.
 * Server Action의 `revalidateTag(CULTURE_TAG)`로 무효화된다.
 *
 * 세션 없는 anon 서버 클라이언트로 읽는다(no-op 쿠키 → next/headers 미접촉 → 캐시 스코프 안전).
 * RLS `public_read`가 전량 공개(초안 개념 없음)하므로 published 필터 없이 전량 select 후
 * group 별로 묶어 CultureContent 로 매핑한다.
 *
 * fallback: 테이블 미존재/키 미연결/쿼리 에러/빈 결과 시 예외를 던지지 않고
 *   정적 상수(model/fallback.ts)로 동일 shape 를 반환 — 마이그레이션 미적용
 *   상황에서도 공개 페이지가 항상 정상.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

const SELECT_ALL =
  "id, group, sort_order, title, description, label, image_url";

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

function mapRow(row: CultureItemRow): CultureItem {
  return {
    id: row.id,
    group: row.group,
    sortOrder: row.sort_order,
    title: row.title,
    description: row.description,
    label: row.label,
    imageUrl: row.image_url,
  };
}

/** DB 결과(전량)를 group 별로 묶어 공개 소비 shape 로 집계한다. */
function toContent(rows: CultureItemRow[]): CultureContent {
  const items = rows.map(mapRow);
  const byGroup = (g: CultureItem["group"]) =>
    items
      .filter((it) => it.group === g)
      .sort((a, b) => a.sortOrder - b.sortOrder);

  return {
    talent: byGroup("talent"),
    values: byGroup("value"),
    welfare: byGroup("welfare"),
    welfareIntro: byGroup("welfare_intro")[0] ?? null,
  };
}

/** 정적 상수 → CultureContent (미연결/에러 fallback). */
function fallbackContent(): CultureContent {
  return {
    talent: TALENT_TRAITS.map((t, i) => ({
      id: `fallback-talent-${i + 1}`,
      group: "talent",
      sortOrder: i + 1,
      title: t.title,
      description: t.description,
      label: t.no,
      imageUrl: null,
    })),
    values: CULTURE_VALUES.map((v, i) => ({
      id: `fallback-value-${i + 1}`,
      group: "value",
      sortOrder: i + 1,
      title: v.title,
      description: v.description,
      label: v.label,
      imageUrl: null,
    })),
    welfare: WELFARE.benefits.map((b, i) => ({
      id: `fallback-welfare-${i + 1}`,
      group: "welfare",
      sortOrder: i + 1,
      title: b.title,
      description: b.description,
      label: null,
      imageUrl: null,
    })),
    welfareIntro: {
      id: "fallback-welfare-intro-1",
      group: "welfare_intro",
      sortOrder: 1,
      title: WELFARE.title,
      description: WELFARE.description,
      label: null,
      imageUrl: null,
    },
  };
}

const cachedCultureContent = unstable_cache(
  async (): Promise<CultureContent> => {
    try {
      const supabase = createAnonReadClient();
      const { data, error } = await supabase
        .from("culture_items")
        .select(SELECT_ALL)
        .order("group", { ascending: true })
        .order("sort_order", { ascending: true })
        .returns<CultureItemRow[]>();

      if (error || !data || data.length === 0) return fallbackContent();

      return toContent(data);
    } catch {
      return fallbackContent();
    }
  },
  ["culture-content"],
  { tags: [CULTURE_TAG] },
);

export async function getCultureItems(): Promise<CultureContent> {
  return cachedCultureContent();
}
