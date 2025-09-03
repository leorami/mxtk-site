import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const origin = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://mineral-token.com";
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", allow: "/ai/knowledge" },
    ],
    sitemap: [`${origin}/sitemap.xml`]
  };
}
