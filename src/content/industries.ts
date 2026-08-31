// Picks which animated scene the industries page renders beside each
// entry (see industry-scene.tsx).
export type IndustryVariant =
  | "restaurants"
  | "retail"
  | "healthcare"
  | "veterinary"
  | "professional"
  | "trades"
  | "fitness"
  | "nonprofits"
  | "startups";

export type Industry = {
  slug: string;
  variant: IndustryVariant;
  name: string;
  summary: string;
  description: string;
  builds: string[];
};

export const industries: Industry[] = [
  {
    slug: "restaurants-cafes",
    variant: "restaurants",
    name: "Restaurants & Cafés",
    summary:
      "Take orders, fill tables, and keep the kitchen moving without the paper pile.",
    description:
      "Online ordering that lands straight on a kitchen screen, reservations that don't double-book, and a view of the night's covers as they come in. The regulars get remembered; the staff get their evening back.",
    builds: [
      "Online ordering",
      "Kitchen display",
      "Table reservations",
      "Loyalty & regulars",
    ],
  },
  {
    slug: "retail-local-shops",
    variant: "retail",
    name: "Retail & Local Shops",
    summary:
      "Know what's on the shelf, what's selling, and what to reorder before it runs out.",
    description:
      "Stock counts that stay right across the till and the stockroom, low-stock alerts before a gap appears, and sales you can actually read. It ties into the POS you already use instead of replacing it.",
    builds: [
      "Inventory tracking",
      "POS integration",
      "Low-stock alerts",
      "Sales reporting",
    ],
  },
  {
    slug: "healthcare-clinics",
    variant: "healthcare",
    name: "Healthcare & Clinics",
    summary:
      "Fill the schedule, collect intake up front, and cut the front-desk phone tag.",
    description:
      "Patients book and reschedule themselves, fill in intake forms before they arrive, and get reminders that lower no-shows. Staff open one calendar instead of chasing three.",
    builds: [
      "Patient scheduling",
      "Digital intake",
      "Automated reminders",
      "Records tooling",
    ],
  },
  {
    slug: "veterinary-practices",
    variant: "veterinary",
    name: "Veterinary Practices",
    summary:
      "Every pet's history in one place, and owners who actually show up for the recheck.",
    description:
      "Appointment booking, vaccination and recheck reminders by text, and a patient record the whole practice can see. Less time on hold, more time with the animals.",
    builds: [
      "Appointment booking",
      "SMS reminders",
      "Patient records",
      "Owner portal",
    ],
  },
  {
    slug: "professional-services",
    variant: "professional",
    name: "Professional Services",
    summary:
      "Move a client from enquiry to invoice without work slipping between inboxes.",
    description:
      "A portal where clients share documents and check progress, matters and projects tracked in one place, and invoices that go out and get chased on their own. For firms in law, accounting, consulting, and design.",
    builds: [
      "Client portals",
      "Matter tracking",
      "Automated billing",
      "Document intake",
    ],
  },
  {
    slug: "trades-field-services",
    variant: "trades",
    name: "Trades & Field Services",
    summary:
      "Dispatch the right crew, keep the customer posted, and quote from the van.",
    description:
      "Jobs scheduled and routed to whoever's closest, live status the customer can follow, and quotes and invoices sent from the site. For plumbers, electricians, HVAC, landscaping, and cleaning.",
    builds: [
      "Job dispatch",
      "Route scheduling",
      "Live ETAs",
      "Quotes & invoicing",
    ],
  },
  {
    slug: "fitness-wellness",
    variant: "fitness",
    name: "Fitness & Wellness",
    summary:
      "Fill classes, handle memberships, and let the front desk coach instead of admin.",
    description:
      "Class booking with waitlists that fill cancellations, memberships and billing that run themselves, and check-in that takes a second. For gyms, studios, spas, and clinics.",
    builds: [
      "Class booking",
      "Membership billing",
      "Waitlists",
      "Fast check-in",
    ],
  },
  {
    slug: "nonprofits-community",
    variant: "nonprofits",
    name: "Nonprofits & Community",
    summary:
      "Raise more with less overhead — donations, donors, and reporting in one system.",
    description:
      "Donation pages that convert, donor records that stay current, and the reports your board and funders ask for without a week of spreadsheet work. Built for small teams doing a lot.",
    builds: [
      "Donation pages",
      "Donor CRM",
      "Grant reporting",
      "Volunteer scheduling",
    ],
  },
  {
    slug: "startups-tech-teams",
    variant: "startups",
    name: "Startups & Tech Teams",
    summary:
      "Ship the MVP, wire up the internal tools, and add the AI features on your roadmap.",
    description:
      "An extra engineering team that moves at your pace — building the first version, the admin panel you keep putting off, or the AI feature you need in the product this quarter.",
    builds: ["MVP builds", "Internal tools", "AI features", "API integrations"],
  },
];
