export type Service = {
  slug: string;
  title: string;
  // Home-page link into this service's example build on /services.
  exampleLabel: string;
  summary: string;
  description: string;
  examples: string[];
};

export const services: Service[] = [
  {
    slug: "custom-software",
    exampleLabel: "See the dashboard example",
    title: "Custom Software & Web Apps",
    summary: "The tools your business runs on, built to fit exactly how you work.",
    description:
      "Off-the-shelf software makes you bend to its limits. We build the other way around, shaped to your workflow, whether it's the internal tool your staff live in or the app your customers use every day.",
    examples: [
      "Booking systems",
      "Client portals",
      "Inventory & ordering",
      "Custom dashboards",
    ],
  },
  {
    slug: "ai-automation",
    exampleLabel: "See the chatbot example",
    title: "AI & Automation Integration",
    summary: "AI that clears the busywork: answering, sorting, summarising, around the clock.",
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
    exampleLabel: "See a monthly support report",
    title: "Ongoing Support & Maintenance",
    summary: "We stay on after launch, fixing, improving, and keeping it fast.",
    description:
      "Software needs upkeep. You get a team on call for bug fixes, new features, and keeping everything running as you grow.",
    examples: [
      "Monitoring & uptime",
      "Bug fixes",
      "New features",
      "Performance tuning",
    ],
  },
];
