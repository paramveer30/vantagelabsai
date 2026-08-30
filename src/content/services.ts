// Picks which particle scene the services page renders beside each entry.
export type ServiceVariant = "software" | "ai" | "support";

export type Service = {
  slug: string;
  variant: ServiceVariant;
  title: string;
  summary: string;
  description: string;
  highlights: string[];
};

export const services: Service[] = [
  {
    slug: "custom-software",
    variant: "software",
    title: "Custom Software & Web Apps",
    summary: "Software built around how your business actually works.",
    description:
      "Off-the-shelf tools make you adapt your business to their limits. We build the opposite: software shaped around your workflow, whether that's an internal tool for staff scheduling or a customer-facing app your clients use every day.",
    highlights: [
      "Internal tools (scheduling, inventory, ordering)",
      "Customer-facing web and mobile apps",
      "Integrations with the tools you already use",
    ],
  },
  {
    slug: "ai-automation",
    variant: "ai",
    title: "AI & Automation Integration",
    summary: "Practical AI that removes busywork, not a science project.",
    description:
      "We add AI where it actually saves time — answering common customer questions, summarizing paperwork, sorting through leads — instead of bolting on AI for the sake of it. If it doesn't save you hours, we won't build it.",
    highlights: [
      "Customer-facing chat and support automation",
      "Document and data processing",
      "Workflow automation between your existing tools",
    ],
  },
  {
    slug: "ongoing-support",
    variant: "support",
    title: "Ongoing Support & Maintenance",
    summary: "We don't disappear after launch.",
    description:
      "Software needs upkeep — bug fixes, small feature requests, keeping things running as your business grows. We offer ongoing support so you have a team to call, not a one-time contractor who vanishes.",
    highlights: [
      "Bug fixes and updates",
      "New features as your needs grow",
      "A direct line to the people who built it",
    ],
  },
];
