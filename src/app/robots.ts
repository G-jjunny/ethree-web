import type { MetadataRoute } from "next";
import { SITE, ADMIN_BASE_PATH } from "@/shared/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [`${ADMIN_BASE_PATH}/`, "/api/"],
    },
    sitemap: new URL("/sitemap.xml", SITE.url).toString(),
  };
}
