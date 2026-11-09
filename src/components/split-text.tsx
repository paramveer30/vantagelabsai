import type { ReactNode } from "react";

type Tag = "h1" | "h2" | "h3";

// Server-rendered headline whose words are each wrapped in a clipping span,
// so CSS can lift them in one after another. `reveal="load"` plays on page
// load (the hero); `reveal="scroll"` waits for ScrollEffects to add `.in`
// when the heading scrolls into view. The words stay plain text in the
// DOM, and nothing is hidden unless JS has set `html.anim` first.
export function SplitText({
  as: Component = "h2",
  text,
  accent,
  after,
  reveal = "scroll",
  className = "",
  id,
}: {
  as?: Tag;
  text: string;
  /** Last word(s) set in the orange italic serif. */
  accent?: string;
  /** Extra node rendered inside the heading after the words (e.g. a rotating word). */
  after?: ReactNode;
  reveal?: "load" | "scroll";
  className?: string;
  id?: string;
}) {
  const words = text.split(/\s+/).filter(Boolean);
  let i = 0;

  return (
    <Component
      id={id}
      className={`${className} ${reveal === "load" ? "hero-title" : "split"}`}
    >
      {words.map((word, idx) => (
        <Word key={`${word}-${idx}`} index={i++}>
          {word}
        </Word>
      ))}
      {accent ? (
        <Word index={i++}>
          <span className="serif accent-word">{accent}</span>
        </Word>
      ) : null}
      {after}
    </Component>
  );
}

export function Word({
  index,
  children,
}: {
  index: number;
  children: ReactNode;
}) {
  return (
    <>
      <span className="w">
        <span style={{ "--i": index } as React.CSSProperties}>{children}</span>
      </span>{" "}
    </>
  );
}
