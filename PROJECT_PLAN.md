# Smart Networking — Project Plan

A simple mobile web app for fast contact exchange at conferences, meetups and networking events. Open one page, pick a contact, show a QR code — LinkedIn, website, email, GitHub, Calendly, X, Substack, or vCard.

**Core idea:** don't hunt for links across apps — one simple page for instant contact sharing.

## Audience

Marketers, founders, consultants, speakers, sales/BD specialists, frequent conference attendees, personal-brand builders.

## MVP Scope (Commit 1 — done)

- Single mobile-first page, clean design
- Static profile (name, title, bio, initials)
- Contact cards: LinkedIn, website, email, GitHub, Calendly, X/Twitter, Substack, vCard
- Tap a card → large scannable QR code in a modal with a Close button
- All data in one config file: `src/data/profile.ts`
- No login, no backend, no database
- Deployed via GitHub + Vercel auto-deploy

## Out of MVP Scope

Login, registration, user accounts, database, analytics, payments, NFC, in-app profile editing, multi-user support, complex animations, native mobile apps.

## Tech Stack

Next.js · React · TypeScript · Tailwind CSS · qrcode.react · Vercel · GitHub

## Commit Roadmap

| # | Commit message | When | Scope |
|---|---|---|---|
| 1 | Initial MVP for Smart Networking | now | Working single-page app, README, Vercel deploy |
| 2 | Improve mobile UI and QR experience | +1 week | Bigger touch targets, icons, better modal, "Scan to connect" hint |
| 3 | Add dark mode support | +1–2 weeks | System-preference dark theme, QR stays readable |
| 4 | Add vCard contact support | +2–3 weeks | "Save contact" download button, .vcf file |
| 5 | Add PWA support | +3–4 weeks | Manifest, app icon, home-screen install, basic offline |
| 6 | Add multiple networking profiles | +1–1.5 months | Business / Speaker / Personal / Author modes |
| 7 | Add custom profile themes | +1.5–2 months | Minimal, Conference, Founder, Speaker, Dark Pro |
| 8 | Add optional analytics-friendly links | +2 months | UTM / short links, no personal data collection |
| 9 | Document NFC sharing workflow | later | How to point an NFC card/sticker at this page |

## Launch Plan

Soft launch on LinkedIn, X/Twitter, Threads, GitHub profile README, personal site. Product Hunt later, after 3–5 improvements.

**Positioning:** a small AI-assisted side project built by a marketing leader to solve a real networking problem — not "I became a developer."

## MVP Success Criteria

- Opens well on a phone; profile looks neat
- QR codes scan easily from another phone
- No login required
- Live on GitHub + Vercel demo link
- README explains what it is and why
