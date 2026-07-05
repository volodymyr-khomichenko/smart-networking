# Smart Networking

A mobile-first digital networking card for conferences, events, and personal branding — with a QR code for every link and a built-in editor so anyone can make it their own.

**Live demo:** https://smart-networking.khomichenko.com

![Smart Networking](public/og.png)

## Problem

Exchanging contacts at events is still too slow and fragmented. People open LinkedIn, search for their profile, copy links, or dictate email addresses — all while standing in a noisy hallway.

## Solution

Smart Networking gives you one simple page with QR codes for all your professional links. Open the page, tap a card, show the QR code — done. The other person just points their camera.

## Features

- **QR code for every link** — LinkedIn, website, podcasts, socials, anything. Tap a card, show a large scannable code.
- **Profile tabs** — group cards into tabs (Business / Personal / Hobby by default) and rename them however you like.
- **Built-in editor** — tap Edit and make the card yours: name, bio, tabs, and links. Changes are saved only in your browser; nothing is uploaded anywhere.
- **28 icons** — brand icons for popular platforms plus generic glyphs (link, app, video, doc, chat, star) for custom links.
- **Installable app (PWA)** — add it to your phone's home screen and it behaves like a native app.
- **Works offline** — once opened online, the card keeps working with no connection. QR codes are generated on-device, so everything scans even on dead conference Wi-Fi.
- **No login, no backend, no database** — a static page, deployed for free.

## Try It

1. Open the demo on your phone.
2. Tap any card and scan the QR code with another phone.
3. Tap **Edit** to replace the demo profile with your own — it stays on your device.
4. Add the page to your home screen for the full app experience.

## Run Your Own

```bash
git clone https://github.com/volodymyr-khomichenko/smart-networking
cd smart-networking
npm install
npm run dev
```

To make a permanent card with your own data, edit `src/data/profile.ts` (name, title, bio, tabs, and links), then deploy:

1. Push the repository to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new) — Next.js is detected automatically.
3. Every `git push` redeploys the site.

## Tech Stack

Next.js (App Router) · React · TypeScript · Tailwind CSS v4 · qrcode.react · Vercel

## Roadmap

- Dark mode
- vCard download ("Save contact")
- Native share sheet integration
- Analytics-friendly links (UTM / short links)
- NFC sharing workflow documentation

## About

A small AI-assisted side project built by a marketing leader to solve a real networking problem.

Made by [Volodymyr Khomichenko](https://khomichenko.com/) — Tech B2B Marketing Strategist & Author.
