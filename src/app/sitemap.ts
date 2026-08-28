import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

const paths = [
  "",
  "/services",
  "/industries",
  "/process",
  "/work",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return paths.map((path) => ({
    url: `${site.url}${path}`,
    lastModified,
  }));
}
