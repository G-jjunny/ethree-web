import { createServerClient } from "@supabase/ssr";
import { unstable_cache } from "next/cache";
import type { NewsItem, NewsListRow } from "../model";
import { NEWS_TAG } from "./newsTag";

/**
 * 공개 News 목록 서버 getter.
 *
 * 캐싱: company-info getter와 동일 전략 — `unstable_cache` + 태그 `news`.
 * Server Action의 `revalidateTag(NEWS_TAG)`로 무효화된다.
 *
 * 세션 없는 anon 클라이언트로 읽는다(no-op 쿠키 → next/headers 미접촉 → 캐시 스코프 안전).
 * RLS `public_read`가 published=true만 반환하지만 방어적으로 `.eq('published', true)`도 건다.
 * body는 select하지 않아 목록 페이로드를 절감한다.
 *
 * fallback: 테이블 미존재/키 미연결/쿼리 에러 시 예외를 던지지 않고 **빈 배열** 반환 —
 * 마이그레이션 미적용 상황에서도 빌드/렌더가 정상.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

const SELECT_LIST =
  "id, slug, title, excerpt, cover_image_url, published_at, created_at";

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

/** published_at ?? created_at → YYYY-MM-DD 파생. */
function deriveDate(publishedAt: string | null, createdAt: string): string {
  return (publishedAt ?? createdAt).slice(0, 10);
}

function mapListRow(row: NewsListRow): NewsItem {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    date: deriveDate(row.published_at, row.created_at),
    excerpt: row.excerpt,
    coverImageUrl: row.cover_image_url,
  };
}

const cachedNewsList = unstable_cache(
  async (): Promise<NewsItem[]> => {
    try {
      const supabase = createAnonReadClient();
      const { data, error } = await supabase
        .from("news")
        .select(SELECT_LIST)
        .eq("published", true)
        .order("published_at", { ascending: false, nullsFirst: false })
        .returns<NewsListRow[]>();

      if (error || !data) return [];

      return data.map(mapListRow);
    } catch {
      return [];
    }
  },
  ["news-list"],
  { tags: [NEWS_TAG] },
);

export async function getNewsList(): Promise<NewsItem[]> {
  return cachedNewsList();
}
