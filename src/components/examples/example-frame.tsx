import type { ReactNode } from "react";

export type ExampleVariant = "full" | "compact";

// Wraps every product mock with the same caption (what the product is,
// plus an optional action such as "Replay conversation"). The mock itself
// rises into place on scroll (data-lift).
//
// `compact` is the home-page version beside each service: the caption is
// one quiet line (the service title is the heading there), and the mock
// is a trimmed-down cut of the full build.
export function ExampleFrame({
  title,
  action,
  grow = false,
  variant = "full",
  className = "",
  children,
}: {
  title: string;
  action?: ReactNode;
  /** Mark the mock so its bars animate in when revealed. */
  grow?: boolean;
  variant?: ExampleVariant;
  className?: string;
  children: ReactNode;
}) {
  return (
    <figure className="example">
      <figcaption className="example-cap">
        {variant === "compact" ? (
          <span className="flex-1 text-sm text-text-2">{title}</span>
        ) : (
          <h3 className="h3">{title}</h3>
        )}
        {action}
      </figcaption>
      <div className={`mock${grow ? " grow" : ""} ${className}`} data-lift>
        {children}
      </div>
    </figure>
  );
}
