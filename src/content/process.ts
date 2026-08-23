export type ProcessStep = {
  step: number;
  title: string;
  description: string;
};

export const process: ProcessStep[] = [
  {
    step: 1,
    title: "Discovery Call",
    description:
      "A free call to understand your business and what's actually slowing you down. No jargon, no obligation.",
  },
  {
    step: 2,
    title: "Plan & Design",
    description:
      "We scope exactly what we're building, how long it'll take, and what it costs — before any code is written.",
  },
  {
    step: 3,
    title: "Build & Iterate",
    description:
      "We build in stages and check in regularly, so you're never waiting months to see progress.",
  },
  {
    step: 4,
    title: "Launch & Support",
    description:
      "We ship it, make sure it works for your team, and stay on for ongoing support after launch.",
  },
];
