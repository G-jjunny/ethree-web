import { createServerClient } from "@supabase/ssr";
import { unstable_cache } from "next/cache";
import type { SolutionListRow, SolutionSlide } from "../model/types";
import { SOLUTION_TAG } from "./solutionTag";

/**
 * 공개 Solution 슬라이드 목록 서버 getter.
 *
 * 캐싱: news getter와 동일 전략 — `unstable_cache` + 태그 `solution-slides`.
 * Server Action의 `revalidateTag(SOLUTION_TAG)`로 무효화된다.
 *
 * 세션 없는 anon 클라이언트로 읽는다(no-op 쿠키 → next/headers 미접촉 → 캐시 스코프 안전).
 * RLS `public_read`가 is_active=true만 반환하지만 방어적으로 `.eq('is_active', true)`도 건다.
 *
 * fallback: 테이블 미존재/키 미연결/쿼리 에러 시 빈 배열 반환 —
 * 호출부(BusinessSection)가 로컬 상수로 폴백한다.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

const SELECT_LIST = "id, title, title_accent, description, image_url";

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

function mapRow(row: SolutionListRow): SolutionSlide {
  return {
    id: row.id,
    title: row.title,
    titleAccent: row.title_accent,
    description: row.description,
    imageUrl: row.image_url,
  };
}

const cachedSolutionSlides = unstable_cache(
  async (): Promise<SolutionSlide[]> => {
    try {
      const supabase = createAnonReadClient();
      const { data, error } = await supabase
        .from("solution_slides")
        .select(SELECT_LIST)
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .returns<SolutionListRow[]>();

      if (error || !data) return [];

      return data.map(mapRow);
    } catch {
      return [];
    }
  },
  ["solution-slides-list"],
  { tags: [SOLUTION_TAG] },
);

export async function getSolutionSlides(): Promise<SolutionSlide[]> {
  return cachedSolutionSlides();
}
