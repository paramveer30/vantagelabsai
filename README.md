# VantageLabsAI

Marketing site for VantageLabsAI, a custom software consultancy. Static
Next.js pages for the public content, two API routes for lead capture (a
contact form and a Cal.com booking webhook), and a few lazy-loaded React
Three Fiber scenes for the interactive parts.

The repo doubles as a portfolio piece, so it is kept small and the git
history is meant to be read.

## Stack

- Next.js 16 (App Router), React 19, TypeScript in strict mode
- Tailwind CSS v4
- React Three Fiber + three.js for the 3D scenes
- Resend for transactional email
- Vitest for unit tests
- Hosted on Vercel

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

The site runs with no environment variables set. The contact form and the
booking webhook still accept submissions and log them server-side; nothing
is emailed until Resend is configured.

## Scripts

| Command | Does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm test` | Run the Vitest suite once |

## Environment

Copy `.env.example` to `.env.local` and fill in what you need. In production
the email variables are required and the app fails fast without them; in
development they are optional.

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Resend API key. Without it, submissions are logged instead of emailed (development only). |
| `CONTACT_TO_EMAIL` | Inbox that receives contact and booking notifications. |
| `CONTACT_FROM_EMAIL` | From address for those emails. Its domain must be verified in Resend. |
| `CAL_WEBHOOK_SECRET` | Shared secret for verifying the `x-cal-signature-256` header on the Cal.com webhook. Required in production. |

The booking link shown across the site is set in `src/lib/site.ts` as
`bookingUrl`.

## Layout

```
src/
  app/          Routes, one folder per page, plus api/contact and api/cal/webhook
  components/    UI; three/ holds the R3F scene primitives
  content/       Page copy as typed data (services, industries, process, work)
  lib/           Email builders, site config, small helpers
```

## Deploying

Connect the repo to Vercel and set the environment variables above in the
Vercel project. Point the Cal.com webhook (Settings -> Developer ->
Webhooks) at `/api/cal/webhook` and give it the same `CAL_WEBHOOK_SECRET`.
