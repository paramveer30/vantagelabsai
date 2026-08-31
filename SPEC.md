# VantageLabsAI — Website Spec

## 1. Overview

**Company**: VantageLabsAI — a custom software consultancy founded by Param
and cofounders.

**Positioning**: "We build custom software for any business that needs
it" — from local businesses (bakeries, restaurants, vets, clinics) to
technical founders and startups. The audience is deliberately open-ended,
not a narrow vertical or persona.

**Site goals** (dual, both real):
1. Generate qualified leads via clear service messaging and a low-friction
   path to booking a call.
2. Serve as a public engineering portfolio piece — the repo will be linked
   from Param's resume/GitHub for professional engineers to review. Code
   quality, architecture, testing, and git history matter as much as the
   shipped product.

The centerpiece technical feature is a **custom-built AI chatbot** — no
off-the-shelf widget (Intercom, Chatbase, etc.). It answers visitor
questions about VantageLabsAI and steers them toward booking a call. Being
built from scratch (custom UI, streaming, RAG, backend) is itself the
strongest portfolio signal on the site.

> **Status (initial launch):** the marketing site, the contact form, and
> the Cal.com booking webhook are built and shipping. The custom chatbot
> described in sections 1 and 4 is specified but not yet implemented. It is
> the next milestone, not part of v1.

---

## 2. Tech Stack & Architecture

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js (App Router), TypeScript strict mode | Static marketing pages + API route for the chatbot in one project; good SEO via SSG/SSR |
| Styling | Tailwind CSS | Fast to build a consistent, polished UI |
| 3D / interactive | React Three Fiber | React-idiomatic Three.js; isolated in a few lazy-loaded components so it never blocks core page load or SEO |
| Chatbot backend | Next.js API route (`/api/chat`), streaming (SSE) | Custom-built, not a third-party widget |
| RAG | Site content chunked + embedded at build time; lightweight vector similarity search (in-memory/JSON store) | No heavyweight infra needed at this content scale |
| LLM | Claude API (Anthropic SDK), small/cheap model by default (Haiku-tier), model name in one config constant | Keeps cost near-zero; trivial to upgrade later |
| Booking | Cal.com (free tier), embedded | Free, professional, open-source scheduling with a webhook for booking alerts |
| Hosting | Vercel (free tier) | Pairs naturally with Next.js |
| Email notifications | Transactional email provider free tier (e.g. Resend) | Notifies founders on bookings / chatbot-captured leads |
| CMS | None — content lives in code (TS/Markdown content files) | Pages are static; founders are comfortable editing via git |

---

## 3. Site Structure / Pages

- **Home** — hero with a 3D/interactive element, value prop, service
  summary, industries teaser, primary CTAs ("Book a call" / "Chat with us").
- **Services** — three offerings explained in plain, benefits-first
  language:
  - Custom web/software applications
  - AI/automation integration
  - Ongoing support/maintenance
- **Industries / Who We Help** — grid of example verticals (restaurants,
  vets, hospitals, bakeries, startups, etc.) so any visitor sees themselves
  reflected, given the open-ended target audience.
- **Process / How We Work** — discovery → build → delivery. Does double
  duty as a trust-builder in place of a deep case-study library at launch.
- **Case Studies / Portfolio** — scaffolded now with 1-2 placeholder slots
  ("Coming soon"). Two real examples exist but are deferred; the page is
  structurally ready to receive them later without a rebuild.
- **Contact** — Cal.com embed + fallback simple form; both routes notify
  founders by email.
- No dedicated Team/About-the-founders page (explicitly excluded from v1).
- The chatbot is a persistent site-wide widget, not a separate page.

---

## 4. AI Chatbot — Detail

**UI**: Custom-built component (not a third-party widget) — message list,
streaming text, typing indicator, suggested-question chips (e.g. "What do
you build?", "How much does a project cost?", "Book a call").

**Purpose**: Answer questions about VantageLabsAI using RAG over real site
content (services, process, industries, company info), and proactively
surface the booking CTA / contact info when a conversation shows buying
intent.

**Guardrails** (necessary for any public-facing, free-tier-budget chatbot):
- Rate limiting per IP/session to bound Claude API cost.
- System prompt scoped to company topics, with a graceful redirect for
  off-topic requests.
- Max conversation length / token budget per session.

This architecture — real RAG, streaming, custom backend and UI — is the
strongest "I can build real AI systems" signal on the site. It's worth a
short write-up in the README's architecture section.

---

## 5. Design & Branding

- Logo already exists and will be supplied/integrated (not designed from
  scratch here).
- Visual direction: clean, modern base elevated with tasteful 3D and
  interactive touches (interactive hero, subtle scroll-triggered
  animation) — professional first, "techy" second. Avoid dark, aggressive,
  or gimmicky treatments that could read as intimidating to a
  non-technical small-business visitor.
- Respect `prefers-reduced-motion` for all 3D/animated elements
  (accessibility, and graceful degradation on low-power devices).
- Mobile: 3D/interactive elements need a lightweight fallback (static
  image or simplified animation) for performance on mobile/low-end
  devices.

---

## 6. Content & Copy

Full draft copy (not placeholder "TBD" text) will be written for
headlines, service descriptions, the process explanation, the industries
list, and the chatbot's system-prompt content — for Param and cofounders
to review/edit before launch. The case studies section ships with
placeholder/"coming soon" content only.

---

## 7. Engineering Practices (portfolio requirement)

Because this repo is a resume artifact as much as a deployed site:

- **TypeScript strict mode** across frontend and chatbot backend.
- **Automated tests**: unit tests for chatbot logic (retrieval, prompt
  construction, rate limiting) and key components; integration tests for
  the `/api/chat` route.
- **CI (GitHub Actions)**: install → typecheck → lint → test → build on
  every push/PR.
- **README**: architecture overview (especially the chatbot/RAG design),
  local setup instructions, and a short "why these choices" decisions
  section — written so a professional engineer can understand the system
  in a couple minutes of skimming.
- **Git workflow**: small, logically-scoped commits with clear
  conventional messages (`feat:`, `fix:`, `chore:`, etc.), built up
  incrementally — scaffold → pages → chatbot backend → chatbot UI →
  3D/interactive polish → tests/CI → README — rather than one giant
  commit.
- **Repo**: public. Cofounders may also contribute commits, so the history
  should read as a real small team project.

---

## 8. Budget / Costs

Target near-zero recurring cost:
- Vercel free tier
- Calendly free tier
- Resend (or similar) free tier for email
- Cheap Claude model + rate limiting to bound chatbot spend

Only near-term real cost: **domain registration** (not yet purchased).

---

## 9. Open Items / Deferred (explicitly out of scope for v1)

- Case study content (2 real examples exist but are deferred to a later
  update).
- Team/founders page (explicitly excluded — may revisit later).
- CMS (not needed at current content velocity; revisit if founders want to
  publish often without touching code).
- Blog/insights (not requested for v1; possible future SEO play).

---

## 10. Launch Plan

Priority is speed: a lean v1 — core pages, a working chatbot with
guardrails, booking CTA, and basic SEO (meta tags, sitemap, OG tags) —
then iterate post-launch (deeper 3D polish, real case studies, possible
blog).

**Pre-launch checklist**:
- [ ] Buy domain
- [ ] Connect domain to Vercel
- [ ] Set up Calendly account and embed link
- [ ] Set up email-notification provider (e.g. Resend) and destination
      address
- [ ] Add Claude API key (as a Vercel environment variable, never
      committed)
- [ ] Add logo assets
- [ ] Final copy review by Param and cofounders
