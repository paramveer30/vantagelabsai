import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center py-28 text-center">
      <p className="eyebrow">404</p>
      <h1 className="display text-gradient mt-5 text-5xl font-semibold md:text-6xl">
        Page not found
      </h1>
      <p className="mt-5 max-w-md text-lg text-muted">
        The page you are after has moved or never existed. Check the address, or
        head back to the homepage.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-brand px-6 py-3 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand-hover"
      >
        Back to home
      </Link>
    </Container>
  );
}
