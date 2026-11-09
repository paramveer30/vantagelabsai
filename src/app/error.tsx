"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="page-hero" data-inten="1" data-cap="0.9">
      <div className="wrap inner min-h-[70vh] content-center">
        <span className="kicker">Error</span>
        <h1 className="display h1">
          Something <span className="serif accent-word">broke</span>
        </h1>
        <p className="lede">
          An unexpected error stopped this page from loading. Try loading it
          again, or go back to the homepage.
        </p>
        <div className="actions">
          <button type="button" onClick={retry} className="btn btn-primary">
            <span>Load the page again</span>
          </button>
          <Link href="/" className="btn btn-ghost">
            <span>Back to the homepage</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
