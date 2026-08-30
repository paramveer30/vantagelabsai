import type { ServiceVariant } from "@/content/services";

// Flat line schematic for each service. This is what shows when the
// particle canvas is skipped — reduced motion, small screens, and as the
// placeholder while the WebGL chunk loads — so it has to read on its own.
// Stroked in currentColor; the caller sets the colour (text-accent).
export function ServiceGlyph({
  variant,
  className = "",
}: {
  variant: ServiceVariant;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={`h-full w-full text-accent ${className}`}
    >
      {variant === "software" && <SoftwareGlyph />}
      {variant === "ai" && <AiGlyph />}
      {variant === "support" && <SupportGlyph />}
    </svg>
  );
}

// A browser-ish window: title bar, three dots, a few content lines.
function SoftwareGlyph() {
  return (
    <>
      <rect x={18} y={24} width={84} height={72} rx={6} />
      <line x1={18} y1={42} x2={102} y2={42} />
      <circle cx={27} cy={33} r={2} fill="currentColor" stroke="none" />
      <circle cx={35} cy={33} r={2} fill="currentColor" stroke="none" />
      <circle cx={43} cy={33} r={2} fill="currentColor" stroke="none" />
      <line x1={28} y1={56} x2={78} y2={56} />
      <line x1={28} y1={68} x2={92} y2={68} />
      <line x1={28} y1={80} x2={64} y2={80} />
    </>
  );
}

// A small node graph with a central hub.
function AiGlyph() {
  const hub = { x: 60, y: 60 };
  const nodes = [
    { x: 28, y: 34 },
    { x: 94, y: 30 },
    { x: 98, y: 82 },
    { x: 60, y: 98 },
    { x: 22, y: 78 },
  ];
  return (
    <>
      {nodes.map((n, i) => (
        <line key={i} x1={hub.x} y1={hub.y} x2={n.x} y2={n.y} />
      ))}
      <line x1={nodes[0].x} y1={nodes[0].y} x2={nodes[1].x} y2={nodes[1].y} />
      <line x1={nodes[2].x} y1={nodes[2].y} x2={nodes[3].x} y2={nodes[3].y} />
      {nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={4.5} fill="var(--background)" />
      ))}
      <circle cx={hub.x} cy={hub.y} r={7} fill="currentColor" stroke="none" />
    </>
  );
}

// A core with one satellite on a tilted orbit.
function SupportGlyph() {
  return (
    <>
      <ellipse cx={60} cy={60} rx={42} ry={20} />
      <circle cx={60} cy={60} r={10} fill="currentColor" stroke="none" />
      <circle cx={99} cy={53} r={4.5} fill="var(--background)" />
    </>
  );
}
