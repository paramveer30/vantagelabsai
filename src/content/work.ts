export type CaseStudy = {
  slug: string;
  client: string;
  industry: string;
  summary: string;
  status: "published" | "coming-soon";
};

// Two real projects are lined up for write-ups; the page renders whatever
// is listed here, so publishing one is a content change, not a rebuild.
export const caseStudies: CaseStudy[] = [
  {
    slug: "local-services-platform",
    client: "Confidential",
    industry: "Home & field services",
    summary:
      "Scheduling, dispatch, and customer messaging for a multi-crew services business.",
    status: "coming-soon",
  },
  {
    slug: "ai-intake-assistant",
    client: "Confidential",
    industry: "Professional services",
    summary:
      "An AI assistant that handles first-contact intake and routes qualified leads to the team.",
    status: "coming-soon",
  },
];
