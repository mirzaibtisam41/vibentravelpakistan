import type { MetadataRoute } from "next";
import { packages } from "@/data/site";
import { absUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "/", priority: 1 },
    { path: "/tour-packages", priority: 0.9 },
    { path: "/destinations", priority: 0.7 },
    { path: "/about-us", priority: 0.5 },
    { path: "/contact-us", priority: 0.6 },
  ];
  return [
    ...pages.map((p) => ({ url: absUrl(p.path), changeFrequency: "weekly" as const, priority: p.priority })),
    // Package pages list their photo so it can show in image search.
    ...packages.map((p) => ({
      url: absUrl(`/tour-packages/${p.slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.8,
      images: [absUrl(p.image)],
    })),
  ];
}
