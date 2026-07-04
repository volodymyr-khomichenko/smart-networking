# Smart Networking

A simple mobile-first digital networking card for conferences, events, and personal branding.



**Live demo:** *https://smart-networking-eight.vercel.app/*



## Problem

Exchanging contacts at events is still too slow and fragmented. People need to open LinkedIn, find their profile, copy links, or dictate email addresses.

## 

## Solution

Smart Networking gives you one simple page with QR codes for your key professional links. Open the page, tap a card, show the QR code — done.

## 

## MVP Features

* Mobile-first profile page styled like a conference badge
* QR codes for LinkedIn, website, email, GitHub, Calendly, X/Twitter, Substack
* vCard QR code — scanning it lets people save your contact directly to their phone
* Everything configured in a single file: `src/data/profile.ts`
* No login, no backend, no database

## 

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000 on your phone or in a mobile viewport.

## 

## Make It Yours

Edit `src/data/profile.ts`:

1. Replace the name, title, bio and initials.
2. Replace each contact `value` with your real link or email.
3. Remove any contact you don't need — just delete its object from the array.

That's the only file you need to touch.

## 

## Deploy

1. Push this repository to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new).
3. Vercel detects Next.js automatically — no configuration needed.
4. Every `git push` redeploys the site.

## 

## Tech Stack

* Next.js (App Router)
* React + TypeScript
* Tailwind CSS v4
* qrcode.react
* Vercel

## 

## Roadmap

* Improved mobile UI and icons
* Dark mode
* vCard file download button
* PWA installation (home screen + offline)
* Multiple profiles (Business / Speaker / Personal)
* Custom themes
* Analytics-friendly links (UTM / short links)
* NFC sharing workflow documentation

## 

## Positioning

A small AI-assisted side project built by a marketing leader to solve a real networking problem.

