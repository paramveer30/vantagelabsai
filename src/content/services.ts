// Picks which animated product vignette the services page renders beside
// each entry.
export type ServiceVariant = "software" | "ai" | "support";

export type Service = {
  slug: string;
  variant: ServiceVariant;
  title: string;
  summary: string;
  description: string;
  examples: string[];
};

export const services: Service[] = [
  {
    slug: "custom-software",
    variant: "software",
    title: "Custom Software & Web Apps",
    summary: "The tools your business runs on, built to fit exactly how you work.",
    description:
      "Off-the-shelf software makes you bend to its limits. We build the other way around — shaped to your workflow, whether it's the internal tool your staff live in or the app your customers use every day.",
    examples: [
      "Booking systems",
      "Client portals",
      "Inventory & ordering",
      "Custom dashboards",
    ],
  },
  {
    slug: "ai-automation",
    variant: "ai",
    title: "AI & Automation Integration",
    summary: "AI that clears the busywork — answering, sorting, summarising, around the clock.",
    description:
      "We add AI only where it saves real hours: replying to common questions, pulling data out of paperwork, routing leads to the right place. If it won't save you time, we won't build it.",
    examples: [
      "Support chatbots",
      "Document extraction",
      "Lead routing",
      "Report drafting",
    ],
  },
  {
    slug: "ongoing-support",
    variant: "support",
    title: "Ongoing Support & Maintenance",
    summary: "We stay on after launch — fixing, improving, and keeping it fast.",
    description:
      "Software needs upkeep. You get a team on call for bug fixes, new features, and keeping everything running as you grow — not a contractor who disappears at handoff.",
    examples: [
      "Monitoring & uptime",
      "Bug fixes",
      "New features",
      "Performance tuning",
    ],
  },
];
