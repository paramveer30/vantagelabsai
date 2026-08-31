export type ProcessStep = {
  step: number;
  title: string;
  description: string;
  // Short tag under the rail node.
  label: string;
  // The one thing you walk away from this step with.
  deliverable: string;
  // Two or three concrete things this step produces.
  outputs: string[];
};

export const processSteps: ProcessStep[] = [
  {
    step: 1,
    title: "Discovery Call",
    description:
      "A free call to understand your business and what's actually slowing you down. No jargon, no obligation.",
    label: "Discovery",
    deliverable: "A shared understanding of the problem",
    outputs: [
      "Goals and constraints",
      "What's slowing you down",
      "Rough budget range",
    ],
  },
  {
    step: 2,
    title: "Plan & Design",
    description:
      "We scope exactly what we're building, how long it'll take, and what it costs — before any code is written.",
    label: "Design",
    deliverable: "A written plan and a fixed quote",
    outputs: ["Scope and timeline", "Screens and flows", "A fixed price"],
  },
  {
    step: 3,
    title: "Build & Iterate",
    description:
      "We build in stages and check in regularly, so you're never waiting months to see progress.",
    label: "Build",
    deliverable: "Working software, a stage at a time",
    outputs: ["Fortnightly check-ins", "A staging link", "Changes as we learn"],
  },
  {
    step: 4,
    title: "Launch & Support",
    description:
      "We ship it, make sure it works for your team, and stay on for ongoing support after launch.",
    label: "Launch",
    deliverable: "A live product and someone on call",
    outputs: ["Go-live and handover", "Team training", "Ongoing support"],
  },
];
