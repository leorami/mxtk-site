import type { MetadataRoute } from "next";

const routes = [
  "/", "/owners", "/institutions", "/transparency", "/whitepaper",
  "/mxtk-cares", "/careers", "/roadmap", "/media", "/ecosystem",
  "/faq", "/resources", "/contact", "/team", "/ai/facts"
];

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://mineral-token.com";
  return routes.map((p) => ({
    url: `${origin}${p}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: p === "/" ? 1 : 0.7
  }));
}
