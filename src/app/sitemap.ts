import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Content changes rarely and by hand. Bump this when a page's copy changes
// materially, rather than reporting every deploy as a fresh modification.
const lastModified = "2026-08-31";

const routes = [
  { path: "", priority: 1 },
  { path: "/services", priority: 0.8 },
  { path: "/industries", priority: 0.8 },
  { path: "/work", priority: 0.7 },
  { path: "/process", priority: 0.7 },
  { path: "/contact", priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ path, priority }) => ({
    url: `${site.url}${path}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority,
  }));
}
