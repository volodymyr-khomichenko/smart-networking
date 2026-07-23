# Design System — Khomichenko Products

Shared visual language for my personal products (first implemented in Smart Networking).
Give this file to an AI assistant at the start of a new project, or keep it in the repo
root as `DESIGN-SYSTEM.md`, so new apps look like part of the same family.

---

## 1. Design concept

**Metaphor:** a conference badge. Physical, tactile, honest. Not a SaaS dashboard.

**Principles:**
- Mobile-first, single column, max width 28rem (`max-w-md`), centered.
- One accent color used with discipline — never rainbow gradients.
- Generous white cards on a soft gray "venue hall" background.
- Physical hints over decoration: badge hole punch, viewfinder corners, lanyard blue.
- Plain-spoken microcopy. No "unlock", "supercharge", "revolutionize".
- Nothing is animated unless it clarifies. Respect `prefers-reduced-motion`.

---

## 2. Color tokens

```css
@theme {
  --color-paper: #eceef1;        /* page background — "venue hall gray" */
  --color-card: #ffffff;         /* card surfaces */
  --color-ink: #14161a;          /* primary text, dark buttons */
  --color-ink-soft: #5b6069;     /* secondary text, hints */
  --color-lanyard: #2f52e0;      /* THE accent — lanyard blue */
  --color-lanyard-soft: #e6ebfc; /* accent background, hover, active */
  --color-line: #dcdfe4;         /* borders, dividers, inactive icons */
}
```

**Usage rules:**
- `lanyard` = interactive intent: active tabs, focus rings, primary buttons, brand icon on hover, pinned/starred state.
- `ink` = strong neutral actions (Close, Save on dark), never as a second accent color.
- `line` = the "off" state of anything toggleable (e.g. an unstarred star).
- Semantic exceptions: red (`#ef4444`) only for destructive hover, green (`#22b46e`) only for status dots.
- QR codes are ALWAYS `#14161a` on `#ffffff`, regardless of theme — scannability wins.

---

## 3. Typography

```css
--font-display: "Space Grotesk Variable", system-ui, sans-serif; /* headings, labels, buttons */
--font-body: "Inter Variable", system-ui, sans-serif;            /* body, hints, inputs */
```

- Load via `@fontsource-variable/*` npm packages, NOT Google Fonts CDN (offline support, no external requests).
- Display font: 600 weight, tight tracking (`-0.01em`) on large headings.
- Section labels: 0.72rem, 600, uppercase, letter-spacing `0.14em`, color `ink-soft`.
- Body: 0.875rem, line-height 1.6. Hints: 0.75rem, `ink-soft`.

---

## 4. Shape & depth

- Cards / modals: `border-radius: 1rem` (16px). Rows / inputs: `0.75rem`. Small controls: `0.5rem`. Pills & avatars: `999px`.
- Every surface has `1px solid var(--color-line)` — borders define structure, not shadows.
- Only the hero card gets a shadow: `0 10px 30px rgba(20,22,26,0.08)`. Floating bars: `0 8px 24px rgba(20,22,26,0.12)`.
- Spacing rhythm: 0.75rem between list items, 1.5–2rem between sections, 1rem–1.5rem card padding.

---

## 5. Component patterns (reuse these)

**Hero/profile card** — white card, top-center "badge hole punch" (`h-2 w-12` rounded pill in paper color with border), avatar circle in lanyard blue with white initials, name in display font, role in lanyard, description in ink-soft. Optional ghost "Edit" button pinned top-right.

**List row** — white card, 44px circular icon holder in paper gray (turns `lanyard-soft`/`lanyard` on hover), title + truncated hint stacked, action affordance on the right. Whole row is one button; secondary actions (star, delete) are separate buttons inside the same bordered container.

**Segmented tabs** — bordered white container, `p-1.5`, equal-width buttons; active = lanyard fill + white text; inactive = ink-soft text with `lanyard-soft` hover.

**Pills row** — compact rounded-full buttons with a small icon chip, used for pinned/shortcut items above the main list.

**Full-screen modal** — solid `card` background (not a dim overlay), centered column, `max-w-sm`, title + subtitle, content, then a full-width dark (`ink`) primary button at the bottom. Closes on Escape, on backdrop click, and locks body scroll while open.

**Viewfinder frame** — four L-shaped corners (`h-7 w-7`, `border-4`, lanyard, rounded outer corner) around any scannable/focal content. Signature element — reuse it.

**Editor screen** — full-screen `paper` background, sections as white cards, sticky bottom bar with Cancel (ghost) + Save (lanyard, flex-2). Demo/example values become greyed placeholders on first edit; `select()` on focus so typing replaces existing values.

**Floating hint bar** — fixed bottom, white card with icon chip + one-line copy + action + dismiss ✕. Dismissal is remembered. Never covers open modals.

---

## 6. Iconography

- Brand icons: 24×24 SVG paths from `simple-icons`, extracted into a local `icons.tsx` map (no runtime dependency). Some brands (LinkedIn, Amazon) are missing from the set — hand-draw or substitute a semantic glyph.
- Generic glyphs for user content: `link`, `email`, `website` (globe), `app`, `play`, `doc`, `chat`, `star` — Material-style paths.
- Icons inherit `currentColor`, sized `h-5 w-5` in rows, `h-4 w-4` in compact controls.
- App icon: lanyard-blue rounded square (22% radius), white pictogram, plus a full-bleed maskable variant (graphic scaled to ~78% safe zone) and a full-bleed apple-touch-icon.

---

## 7. Technical baseline

- Next.js App Router + React + TypeScript + Tailwind CSS v4 (`@theme` tokens in `globals.css`).
- Static, no backend, no database, no auth. User data (if any) → `localStorage`, with a versioned key like `product-name-key-v1`, wrapped in try/catch, and a migration path for older shapes.
- PWA by default: `manifest.webmanifest` (standalone, paper theme color), cache-first service worker with a bumped cache name per release, `RegisterSW` client component (production only).
- `<html suppressHydrationWarning>` — browser extensions inject attributes otherwise.
- Deploy: GitHub → Vercel, custom subdomain of khomichenko.com.
- Accessibility: visible focus rings (`focus-visible:outline-2 outline-lanyard`), `aria-label` on icon-only buttons, `aria-pressed` on toggles, real `role="dialog"` + Escape on modals, 44px minimum touch targets.
- Footer: `© {year} Volodymyr Khomichenko` linking to khomichenko.com. MIT license with the copyright notice.

---

## 8. Voice & copy rules

- Second person, present tense, concrete verbs: "Tap a card to show its QR code".
- Explain the honest trade-off rather than hiding it: "Saved only in this browser on this device — nothing is uploaded anywhere."
- No feature promises, no roadmap in product UI.
- Section labels are instructions, not nouns ("Tap a card to show its QR code", not "Contacts").
- Positioning line for any product in this family: a personal side project by a marketing leader, built with AI assistance, free and open source.
