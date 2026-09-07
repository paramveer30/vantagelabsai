import { LegalDocument } from "@/components/legal-document";
import { privacyPolicy } from "@/content/legal";
import { pageMetadata } from "@/lib/seo";

// Utility page — keep it out of search results but let links be followed.
export const metadata = pageMetadata({
  title: privacyPolicy.title,
  description: privacyPolicy.description,
  path: "/privacy",
  noindex: true,
});

export default function PrivacyPage() {
  return <LegalDocument doc={privacyPolicy} />;
}
