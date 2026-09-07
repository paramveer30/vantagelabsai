import { LegalDocument } from "@/components/legal-document";
import { termsOfService } from "@/content/legal";
import { pageMetadata } from "@/lib/seo";

// Utility page — keep it out of search results but let links be followed.
export const metadata = pageMetadata({
  title: termsOfService.title,
  description: termsOfService.description,
  path: "/terms",
  noindex: true,
});

export default function TermsPage() {
  return <LegalDocument doc={termsOfService} />;
}
