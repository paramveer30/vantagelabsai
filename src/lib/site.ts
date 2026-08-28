export const site = {
  name: "VantageLabsAI",
  tagline: "Custom software for any business that needs it",
  description:
    "VantageLabsAI builds custom software, AI integrations, and ongoing support for businesses of any size — from local shops to technical founders.",
  url: "https://vantagelabsai.com",
  email: "hello@vantagelabsai.com",
  // Set once the Calendly account exists; until then the contact page
  // shows the message form only.
  calendlyUrl: "",
} as const;

export const nav = [
  { label: "Services", href: "/services" },
  { label: "Industries", href: "/industries" },
  { label: "Process", href: "/process" },
  { label: "Work", href: "/work" },
  { label: "Contact", href: "/contact" },
] as const;
