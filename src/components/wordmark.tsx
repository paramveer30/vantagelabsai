import { site } from "@/lib/site";

// The VantageLabsAI wordmark with the "AI" suffix picked out in the brand
// blue, matching the logo lockup. Everything before "AI" keeps the
// caller's colour.
export function Wordmark({ className }: { className?: string }) {
  const base = site.name.replace(/AI$/, "");

  return (
    <span className={className}>
      {base}
      <span className="wordmark-ai">AI</span>
    </span>
  );
}
