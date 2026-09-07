// Copy for the /privacy and /terms pages, kept here so the pages stay thin
// and the text is easy to review in one place. Written to match how the
// site actually works today: a static marketing site with a contact form
// (emailed via Resend), Cal.com for booking, hosted on Vercel, with no
// analytics or advertising trackers. Revisit both documents whenever that
// changes — and have a professional review them before relying on them.

import { site } from "@/lib/site";

export type LegalSection = { heading: string; body: string[] };

export type LegalDoc = {
  slug: "privacy" | "terms";
  hero: string;
  title: string;
  description: string;
  intro: string;
  sections: LegalSection[];
};

// YYYY-MM-DD. Bump when either document changes materially.
export const legalEffectiveDate = "2026-09-06";

export const legalDisclaimer =
  "This page explains, in plain terms, how this website works and what happens to the limited information it collects. It is provided for transparency, not as legal advice — have a qualified professional review it before you rely on it for your business.";

export const privacyPolicy: LegalDoc = {
  slug: "privacy",
  hero: "Privacy",
  title: "Privacy Policy",
  description: `How ${site.name} handles the information collected through vantagelabsai.com.`,
  intro: `This policy covers vantagelabsai.com. ${site.name} keeps data collection to the minimum the site needs to work and to let you get in touch.`,
  sections: [
    {
      heading: "Information we collect",
      body: [
        "Information you give us. When you submit the contact form we receive your name, email address, an optional company name, and your message. When you book a call we receive your name, email address, the time you choose, and anything else you add in the booking form.",
        "Information collected automatically. Our host keeps standard server logs — IP address, browser user-agent, timestamps, and the pages requested — for a short period, to keep the site running and to rate-limit abuse of the contact form. The site sets no analytics, advertising, or cross-site tracking cookies.",
      ],
    },
    {
      heading: "Cookies and local storage",
      body: [
        "The site does not use tracking or advertising cookies. The only thing it stores in your browser is a small flag, kept in local storage, that remembers you have dismissed the cookie notice so it does not reappear on every page.",
        "Third parties we rely on (below) may set their own cookies when you interact with their embedded or linked services, such as the Cal.com booking page.",
      ],
    },
    {
      heading: "How we use information",
      body: [
        "To reply to your enquiry and, where relevant, to schedule and prepare for a call.",
        "To operate, secure, and improve the website.",
        "To meet legal obligations and to detect or prevent abuse.",
      ],
    },
    {
      heading: "How information is shared",
      body: [
        `We do not sell or rent your information. We share it only with the service providers that run the site and our communications on our behalf: Vercel (hosting, content delivery, and logs), Resend (sending the contact and confirmation emails), and Cal.com (call scheduling). Each processes data under its own terms and privacy policy.`,
        "We may also disclose information if required to by law, or to protect our rights, safety, or property.",
      ],
    },
    {
      heading: "Data retention",
      body: [
        "Contact and booking emails stay in our inbox for as long as we need them to handle your enquiry and keep reasonable business records, after which they are deleted.",
        "Server logs are retained only briefly by our host before they roll off.",
      ],
    },
    {
      heading: "Your rights",
      body: [
        `You can ask us to access, correct, or delete the information you have sent us, or to stop using it. Email ${site.email} and we will respond within a reasonable time.`,
        "Depending on where you live — for example under UK or EU GDPR, or California's privacy laws — you may have additional rights, including the right to complain to a data protection regulator.",
      ],
    },
    {
      heading: "International processing",
      body: [
        "We and our service providers may store and process your information in countries other than your own, including the United States. Those providers commit to recognised safeguards for such transfers.",
      ],
    },
    {
      heading: "Security",
      body: [
        "The site is served over HTTPS and we use reasonable technical and organisational measures to protect the information we hold. No method of transmission or storage is completely secure, so we cannot guarantee absolute security.",
      ],
    },
    {
      heading: "Children",
      body: [
        "The site is intended for a business audience and is not directed to children. We do not knowingly collect information from children.",
      ],
    },
    {
      heading: "Changes to this policy",
      body: [
        "If we change this policy the “Last updated” date above will change, and material changes will be noted on the site. Continuing to use the site after an update means you accept the revised policy.",
      ],
    },
    {
      heading: "Contact",
      body: [
        `Questions about privacy? Email ${site.email}.`,
      ],
    },
  ],
};

export const termsOfService: LegalDoc = {
  slug: "terms",
  hero: "Terms",
  title: "Terms & Conditions",
  description: `The terms for using the ${site.name} website at vantagelabsai.com.`,
  intro: `These terms govern your use of vantagelabsai.com. By using the site you agree to them; if you do not agree, please do not use the site.`,
  sections: [
    {
      heading: "About this site",
      body: [
        `vantagelabsai.com is an informational site that describes ${site.name}'s services and gives you ways to get in touch. Browsing the site or sending a message does not create a client relationship. Any paid work is governed by a separate written agreement between us.`,
      ],
    },
    {
      heading: "Acceptable use",
      body: [
        "You agree not to: use the site unlawfully; probe, scan, or test the security of the site or defeat its rate limits; scrape or access it through automated means beyond normal browsing; submit other people's personal information without their permission; or upload or transmit anything malicious.",
      ],
    },
    {
      heading: "Messages you send us",
      body: [
        "Please do not send confidential or sensitive information through the contact form. We handle what you send in line with our Privacy Policy. We are not obliged to reply to every message, and we cannot treat unsolicited ideas or proposals as confidential.",
      ],
    },
    {
      heading: "Booking a call",
      body: [
        "Call scheduling is provided through Cal.com and is subject to Cal.com's own terms. Booking a call places no obligation on either of us to enter into an engagement.",
      ],
    },
    {
      heading: "Intellectual property",
      body: [
        `The content, design, and branding on this site are owned by ${site.name} or its licensors. You may view the site to evaluate our services; you may not copy, republish, or make derivative use of it without our written permission.`,
        "The site's source code is published in a public repository under the licence stated there, which governs any use of that code.",
      ],
    },
    {
      heading: "Third-party links",
      body: [
        "The site links to external sites, including client projects, Cal.com, and GitHub. Those sites are not under our control and we are not responsible for their content or practices.",
      ],
    },
    {
      heading: "No warranties",
      body: [
        "The site is provided “as is” and “as available”, without warranties of any kind. We do not warrant that it will be uninterrupted or error-free, or that the information on it is complete or current.",
      ],
    },
    {
      heading: "Limitation of liability",
      body: [
        `To the fullest extent permitted by law, ${site.name} will not be liable for any indirect, incidental, special, or consequential loss arising out of your use of, or inability to use, the site.`,
      ],
    },
    {
      heading: "Changes to these terms",
      body: [
        "We may revise these terms from time to time. The “Last updated” date above will change, and continuing to use the site after a change means you accept the revised terms.",
      ],
    },
    {
      heading: "Governing law",
      body: [
        "These terms are governed by the laws of the Province of Ontario, Canada, without regard to its conflict-of-laws rules, and the courts of Ontario will have jurisdiction over any dispute.",
      ],
    },
    {
      heading: "Contact",
      body: [
        `Questions about these terms? Email ${site.email}.`,
      ],
    },
  ],
};
