import type { MetadataRoute } from "next";
import { absUrl } from "@/lib/seo";

// Same policy as the company's current site: open to search and AI answer engines, closed to AI-training crawlers.
const trainingBots = ["GPTBot", "ClaudeBot", "Google-Extended", "Applebot-Extended", "meta-externalagent", "Amazonbot", "Bytespider", "CCBot"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: trainingBots, disallow: "/" },
    ],
    sitemap: absUrl("/sitemap.xml"),
  };
}
