export const site = {
  name: "VantageLabsAI",
  tagline: "Custom software for any business that needs it",
  description:
    "VantageLabsAI builds custom software, AI integrations, and ongoing support for businesses of any size, from local shops to technical founders.",
  url: "https://vantagelabsai.com",
  email: "vantage.labs@outlook.ca",
  // Paste a Cal.com (cal.com/your-handle/intro) or Calendly
  // (calendly.com/your-handle/30min) link here. Empty → the contact page
  // shows a mailto fallback card; the embed adds dark-theme params.
  bookingUrl: "https://cal.com/vantagelabs/30min",
} as const;

// Options for the optional budget field on the contact form. The API only
// accepts these exact values.
// TODO(budget): replace the three size labels with real ranges, for
// example "Under $X", "$X to $Y", "Over $Y". Keep "Not sure yet" first.
export const budgetOptions = [
  "Not sure yet",
  "Small project",
  "Medium project",
  "Large project",
] as const;

export const nav = [
  { label: "Services", href: "/services" },
  { label: "Industries", href: "/industries" },
  { label: "Process", href: "/process" },
  { label: "Work", href: "/work" },
  { label: "Contact", href: "/contact" },
] as const;
