"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/container";

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
    <Container className="flex min-h-[70vh] flex-col items-center justify-center py-28 text-center">
      <p className="eyebrow">Error</p>
      <h1 className="display text-gradient mt-5 text-5xl font-semibold md:text-6xl">
        Something broke
      </h1>
      <p className="mt-5 max-w-md text-lg text-muted">
        An unexpected error stopped this page from loading. Try again, or head
        back to the homepage.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={retry}
          className="rounded-full bg-brand px-6 py-3 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand-hover"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-full border border-border-strong px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-accent"
        >
          Back to home
        </Link>
      </div>
    </Container>
  );
}
