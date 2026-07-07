import { createServerClient } from "@supabase/ssr";
import { unstable_cache } from "next/cache";
import type { NewsItem, NewsDetailRow } from "../model";
import { NEWS_TAG } from "./newsTag";

/**
 * 공개 News 단건 서버 getter(slug 기준). body 포함.
 *
 * getNewsList와 동일한 anon/캐시/방어적 published 필터 전략. slug는 함수 인자로
 * unstable_cache 키에 자동 포함된다(태그 `news`로 일괄 무효화).
 *
 * fallback: 미존재/에러/미연결 시 **null 반환** — 호출부(page)가 notFound() 처리.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

const SELECT_DETAIL =
  "id, slug, title, excerpt, cover_image_url, published_at, created_at, body";

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

function deriveDate(publishedAt: string | null, createdAt: string): string {
  return (publishedAt ?? createdAt).slice(0, 10);
}

function mapDetailRow(row: NewsDetailRow): NewsItem {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    date: deriveDate(row.published_at, row.created_at),
    excerpt: row.excerpt,
    coverImageUrl: row.cover_image_url,
    body: row.body,
  };
}

const cachedNewsBySlug = unstable_cache(
  async (slug: string): Promise<NewsItem | null> => {
    try {
      const supabase = createAnonReadClient();
      const { data, error } = await supabase
        .from("news")
        .select(SELECT_DETAIL)
        .eq("slug", slug)
        .eq("published", true)
        .single<NewsDetailRow>();

      if (error || !data) return null;

      return mapDetailRow(data);
    } catch {
      return null;
    }
  },
  ["news-detail"],
  { tags: [NEWS_TAG] },
);

export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  return cachedNewsBySlug(slug);
}
