import Link from "next/link";
import { SplitText } from "@/components/split-text";
import { site } from "@/lib/site";

// The closing band on every page: full-strength texture, one action.
export function FinalCta({
  title = "Tell us what's slowing your business",
  accent = "down",
  body = "A free 30-minute call. You'll leave with a clear read on scope and next steps, even if we're not the right fit.",
}: {
  title?: string;
  accent?: string;
  body?: string;
}) {
  return (
    <section
      className="final-cta"
      data-inten="1"
      data-cap="1"
      aria-labelledby="final-cta-title"
    >
      <div className="wrap">
        <div className="inner">
          <span className="kicker">Start here</span>
          <SplitText
            id="final-cta-title"
            className="display h2"
            text={title}
            accent={accent}
          />
          <p className="copy">{body}</p>
          <div className="actions">
            <Link href="/contact" className="btn btn-primary">
              <span>Book a 30-minute call</span>
              <span className="arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
          <p className="m-0 text-sm text-text-2">
            Or email{" "}
            <a href={`mailto:${site.email}`} className="text-text">
              {site.email}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
