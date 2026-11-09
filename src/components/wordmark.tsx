import { site } from "@/lib/site";

// The VantageLabsAI wordmark with the "AI" suffix in the brand blue, the
// way the logo lockup reads.
export function Wordmark({ className }: { className?: string }) {
  const base = site.name.replace(/AI$/, "");

  return (
    <span className={className}>
      {base}
      <span className="brand-ai">AI</span>
    </span>
  );
}
