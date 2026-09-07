import type { Metadata } from "next";
import { site } from "@/lib/site";

type PagePath = "" | `/${string}`;

// Per-page metadata. Next merges `openGraph` and `robots` shallowly — a page
// that sets them replaces the root's outright — so this rebuilds the shared
// Open Graph fields alongside the page's own canonical URL and title. Without
// it every route inherits the homepage's canonical and og:url.
export function pageMetadata({
  title,
  description,
  path,
  noindex = false,
}: {
  title: string;
  description: string;
  path: PagePath;
  noindex?: boolean;
}): Metadata {
  const url = `${site.url}${path || "/"}`;
  const ogTitle = `${title} | ${site.name}`;

  return {
    title,
    description,
    alternates: { canonical: path || "/" },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: ogTitle,
      description,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
