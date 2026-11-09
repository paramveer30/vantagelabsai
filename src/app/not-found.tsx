import type { Metadata } from "next";
import Link from "next/link";
import { SplitText } from "@/components/split-text";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <section className="page-hero" data-inten="1" data-cap="0.9">
      <div className="wrap inner min-h-[70vh] content-center">
        <span className="kicker">404</span>
        <SplitText as="h1" className="display h1" text="This page doesn't" accent="exist" />
        <p className="lede">
          It may have moved, or the address has a typo. Check it, or go back to
          the homepage.
        </p>
        <div className="actions">
          <Link href="/" className="btn btn-primary">
            <span>Back to the homepage</span>
          </Link>
          <Link href="/contact" className="btn btn-ghost">
            <span>Contact us</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
