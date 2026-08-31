export type Project = {
  slug: string;
  name: string;
  url: string;
  category: string;
  year: string;
  // Screenshot of the live site, served from /public/work.
  image: string;
  imageAlt: string;
  // One strong line, shown in the foreground colour.
  summary: string;
  // Two or three sentences of detail, shown muted.
  description: string;
  // Rendered as accent pills, same as service.examples.
  stack: string[];
};

// Live projects, newest first. The work page renders whatever is listed
// here, so adding one is a content change, not a rebuild.
export const projects: Project[] = [
  {
    slug: "letmeknock",
    name: "LetMeKnock",
    url: "https://letmeknock.vercel.app/",
    category: "Student housing marketplace",
    year: "2025",
    image: "/work/letmeknock.jpg",
    imageAlt: "LetMeKnock homepage — student housing search",
    summary:
      "A verified-listings marketplace that takes the stress out of finding student housing near campus.",
    description:
      "Students filter by location, price, bedrooms, and property type, view places on a map, message owners directly, and save favourites behind a secure booking flow. Built on Next.js and Supabase with server-rendered listing pages for fast search and clean SEO.",
    stack: ["Next.js", "React", "TypeScript", "Supabase", "Node.js"],
  },
  {
    slug: "medicine4youth",
    name: "Medicine4Youth",
    url: "https://www.medicine4youth.ca/",
    category: "Non-profit brand & platform",
    year: "2025",
    image: "/work/medicine4youth.jpg",
    imageAlt: "Medicine4Youth homepage hero",
    summary:
      "The national home for a student-led medical-education non-profit and its ten specialty branches.",
    description:
      "One site to hold a Summer Research Program, university chapters, flagship events, and a family of sub-brands. We built a scalable design system, light and dark theming, and content-driven sections for branches, programs, and partners so the team keeps it current without a developer.",
    stack: ["JavaScript", "React", "Framer Motion", "GSAP", "Leaflet"],
  },
  {
    slug: "avneet-nijjer-portfolio",
    name: "Avneet Nijjer — Portfolio",
    url: "https://www.avneetnijjer.ca/",
    category: "Portfolio + AI twin",
    year: "2025",
    image: "/work/avneet-nijjer.jpg",
    imageAlt: "Avneet Nijjer portfolio homepage hero",
    summary:
      'An engineer’s portfolio with a conversational "AI twin" that answers questions about his work in his voice.',
    description:
      "Alongside the usual project and experience sections, the site ships an AI chat grounded in Avneet's background — OpenAI for generation, a Sanity-backed content layer so updates are a CMS edit rather than a deploy, and Clerk for admin auth.",
    stack: ["Next.js", "React", "TypeScript", "OpenAI API", "Sanity", "Clerk"],
  },
];
