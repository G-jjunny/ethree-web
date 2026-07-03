import type { MetadataRoute } from "next";
import { SITE } from "@/shared/constants";
import { getNewsList } from "@/shared/lib";

const STATIC_ROUTES: readonly { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/about", priority: 0.8 },
  { path: "/about/greeting", priority: 0.6 },
  { path: "/about/history", priority: 0.6 },
  { path: "/about/location", priority: 0.6 },
  { path: "/business", priority: 0.8 },
  { path: "/business/service", priority: 0.6 },
  { path: "/support", priority: 0.8 },
  { path: "/support/news", priority: 0.6 },
  { path: "/support/culture", priority: 0.6 },
  { path: "/support/careers", priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(
    ({ path, priority }) => ({
      url: new URL(path, SITE.url).toString(),
      lastModified: now,
      changeFrequency: "monthly",
      priority,
    }),
  );

  const newsEntries: MetadataRoute.Sitemap = getNewsList().map((item) => ({
    url: new URL(`/support/news/${item.slug}`, SITE.url).toString(),
    lastModified: new Date(item.date),
    changeFrequency: "yearly",
    priority: 0.4,
  }));

  return [...staticEntries, ...newsEntries];
}
