// ---------------------------------------------------------------------------
// Smart Networking — profile configuration
//
// This is the only file you need to edit.
// Update the values below whenever your links change.
// ---------------------------------------------------------------------------

export type ContactType = "url" | "email" | "phone" | "vcard";

export type ModeId = "business" | "personal" | "hobby";

export interface Mode {
  id: ModeId | "all";
  label: string;
}

export interface Tab {
  id: ModeId;
  label: string;
}

/** Default tab names; each profile stores its own editable copy. */
export const DEFAULT_TABS: Tab[] = [
  { id: "business", label: "Business" },
  { id: "personal", label: "Personal" },
  { id: "hobby", label: "Hobby" },
];

export interface Contact {
  id: string;
  label: string;
  /** Short line shown under the label on the card */
  hint: string;
  type: ContactType;
  /** Icon id from src/components/icons.tsx; defaults to the contact id */
  icon?: string;
  /** Pinned above the tabs (up to 5 cards) */
  favorite?: boolean;
  /** Archived cards are hidden from the main list (see "Archived cards" at the bottom) */
  archived?: boolean;
  /** Which profile modes this card belongs to */
  modes: ModeId[];
  /**
   * For "url":   full link, e.g. https://linkedin.com/in/you
   * For "email": plain address, e.g. you@example.com
   * For "phone": phone number, e.g. +380 12 345 6789
   * For "vcard": leave empty — the vCard is generated from the profile below
   */
  value: string;
}

export interface Profile {
  name: string;
  /** Given name — copied on its own into a conference form. */
  firstName: string;
  /** Family name — copied on its own. */
  lastName: string;
  /** Organization, copied on its own into a conference form. */
  company: string;
  title: string;
  bio: string;
  /** Shown in the avatar circle when no photo is set, e.g. "VK" */
  initials: string;
  /** Portrait uploaded on this device. A data URL, kept only in the local card. */
  photo?: string;
  /** Editable tab names for the card list */
  tabs: Tab[];
  contacts: Contact[];
}

export const profile: Profile = {
  name: "Volodymyr Khomichenko",
  firstName: "Volodymyr",
  lastName: "Khomichenko",
  company: "Zoolatech",
  title: "Senior Marketing Director",
  bio: "12+ years in marketing, 8+ in B2B tech. Author of The Marketing Behind Rapid Growth book, podcast and newsletter.",
  initials: "VK",
  tabs: [
    { id: "business", label: "Business" },
    { id: "personal", label: "Personal" },
    { id: "hobby", label: "Hobby" },
  ],
  contacts: [
    {
      id: "linkedin",
      favorite: true,
      label: "LinkedIn",
      hint: "Let's connect professionally",
      type: "url",
      modes: ["business"],
      value: "https://www.linkedin.com/in/volodymyrkh/",
    },
    {
      id: "website",
      favorite: true,
      label: "Website",
      hint: "My personal hub — book, podcast, articles",
      type: "url",
      modes: ["hobby"],
      value: "https://khomichenko.com/",
    },
    {
      id: "calendly",
      label: "Calendly",
      hint: "Book a meeting with me",
      type: "url",
      modes: ["business"],
      value: "https://calendly.com/khomichenko/booking",
    },
    {
      id: "substack",
      label: "Substack",
      hint: "My newsletter: Rapid Growth",
      type: "url",
      modes: ["hobby"],
      value: "https://substack.com/@rapidgrowth",
    },
    {
      id: "apple-podcasts",
      label: "Apple Podcasts",
      hint: "My podcast on Apple Podcasts",
      type: "url",
      modes: ["hobby"],
      value:
        "https://podcasts.apple.com/us/podcast/the-marketing-behind-rapid-growth/id6783273819",
    },
    {
      id: "spotify",
      label: "Spotify",
      hint: "My podcast on Spotify",
      type: "url",
      modes: ["hobby"],
      value: "https://open.spotify.com/show/033xOGviIOxl8R0FtlNnen",
    },
    {
      id: "youtube",
      label: "YouTube",
      hint: "Podcast episodes in video",
      type: "url",
      modes: ["hobby"],
      value:
        "https://www.youtube.com/playlist?list=PLE1kZdLcUjyJH8Vt221NXKmYFOB7az_YU",
    },
    {
      id: "x",
      label: "X / Twitter",
      hint: "Daily takes on B2B marketing",
      type: "url",
      modes: ["business"],
      value: "https://x.com/V_Khomichenko",
    },
    {
      id: "medium",
      label: "Medium",
      hint: "My marketing articles",
      type: "url",
      modes: ["hobby"],
      value: "https://medium.com/@Khomichenko",
    },
    {
      id: "hackernoon",
      label: "HackerNoon",
      hint: "My tech & growth stories",
      type: "url",
      modes: ["hobby"],
      value: "https://hackernoon.com/u/khomichenko",
    },
    {
      id: "amazon",
      favorite: true,
      label: "Amazon",
      hint: "My book on Amazon",
      type: "url",
      modes: ["hobby"],
      value: "https://amazon.com/author/khomichenko",
    },
    {
      id: "goodreads",
      label: "Goodreads",
      hint: "My author page on Goodreads",
      type: "url",
      modes: ["hobby"],
      value: "https://www.goodreads.com/khomichenko",
    },
    {
      id: "producthunt",
      label: "Product Hunt",
      hint: "My launches & product picks",
      type: "url",
      modes: ["hobby"],
      value: "https://www.producthunt.com/@khomichenko",
    },
    {
      id: "github",
      label: "GitHub",
      hint: "My side projects (like this one)",
      type: "url",
      modes: ["hobby"],
      value: "https://github.com/volodymyr-khomichenko",
    },
    {
      id: "instagram",
      label: "Instagram",
      hint: "Photos & behind the scenes",
      type: "url",
      modes: ["personal"],
      value: "https://www.instagram.com/khomichenko/",
    },
    {
      id: "threads",
      label: "Threads",
      hint: "Daily thoughts on Threads",
      type: "url",
      modes: ["personal"],
      value: "https://www.threads.com/@khomichenko",
    },
    {
      id: "tiktok",
      label: "TikTok",
      hint: "Behind Rapid Growth in short video",
      type: "url",
      modes: ["hobby"],
      value: "https://www.tiktok.com/@volodymyr.khomichenko",
    },
    {
      id: "facebook",
      label: "Facebook",
      hint: "Let's connect on Facebook",
      type: "url",
      modes: ["personal"],
      value: "https://www.facebook.com/vladimir.khomichenko",
    },
    {
      id: "bluesky",
      label: "Bluesky",
      hint: "Find me on Bluesky",
      type: "url",
      modes: ["business"],
      value: "https://bsky.app/profile/khomichenko.com",
    },
    {
      id: "mastodon",
      label: "Mastodon",
      hint: "Find me on Mastodon",
      type: "url",
      modes: ["business"],
      value: "https://mastodon.social/@Khomichenko",
    },
    {
      id: "pinterest",
      label: "Pinterest",
      hint: "My boards & visual ideas",
      type: "url",
      modes: ["business"],
      value: "https://www.pinterest.com/khomichenko/",
    },
    {
      id: "smart-networking",
      label: "Smart Networking",
      hint: "This very app — my AI-built side project",
      type: "url",
      icon: "app",
      modes: ["hobby"],
      value: "https://smart-networking.khomichenko.com",
    },
    {
      id: "speaker-copilot",
      label: "Speaker Copilot",
      hint: "My AI-built side project",
      type: "url",
      icon: "app",
      modes: ["hobby"],
      value: "https://speaker-copilot.khomichenko.com/",
    },
    {
      id: "fast-comment",
      label: "Fast Comment",
      hint: "My AI-built side project",
      type: "url",
      icon: "chat",
      modes: ["hobby"],
      value: "https://fast-comment.khomichenko.com/",
    },
  ],
};

/** First token is the given name; the rest is the family name. */
export function splitName(name: string): { firstName: string; lastName: string } {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

export interface FormField {
  id: string;
  label: string;
  value: string;
}

/**
 * One row per thing a conference form usually asks for.
 * Tap a row to copy just that value. Every filled email, phone, and
 * messenger already on the card is listed — nothing is invented here.
 */
const MESSENGERS: { name: string; test: RegExp }[] = [
  { name: "Telegram", test: /telegram|t\.me\/|telegram\.me/ },
  { name: "Viber", test: /viber/ },
  { name: "WhatsApp", test: /whatsapp|wa\.me/ },
  { name: "Signal", test: /\bsignal\b|signal\.me/ },
  { name: "Skype", test: /skype/ },
  { name: "Discord", test: /discord/ },
  { name: "Messenger", test: /\bmessenger\b|m\.me\// },
  { name: "WeChat", test: /wechat|weixin/ },
  { name: "LINE", test: /\bline\b|line\.me/ },
];

function contactBlob(c: Contact): string {
  return `${c.id} ${c.icon ?? ""} ${c.label} ${c.value}`.toLowerCase();
}

function messengerName(c: Contact): string | null {
  const blob = contactBlob(c);
  return MESSENGERS.find((m) => m.test.test(blob))?.name ?? null;
}

function isFilled(c: Contact): boolean {
  return !c.archived && c.type !== "vcard" && c.value.trim().length > 0;
}

/** "Email — Work" when the card name adds something; otherwise just "Email". */
function fieldLabel(kind: string, cardLabel: string): string {
  const card = cardLabel.trim();
  if (!card || card.toLowerCase() === kind.toLowerCase()) return kind;
  if (card.toLowerCase().includes(kind.toLowerCase())) return card;
  return `${kind} — ${card}`;
}

function numberDuplicates(rows: FormField[]): FormField[] {
  const totals = new Map<string, number>();
  for (const row of rows) totals.set(row.label, (totals.get(row.label) ?? 0) + 1);
  const seen = new Map<string, number>();
  return rows.map((row) => {
    const total = totals.get(row.label) ?? 1;
    if (total < 2) return row;
    const n = (seen.get(row.label) ?? 0) + 1;
    seen.set(row.label, n);
    return { ...row, label: `${row.label} ${n}` };
  });
}

export function formFields(p: Profile): FormField[] {
  const rows: FormField[] = [
    { id: "first", label: "First name", value: p.firstName.trim() },
    { id: "last", label: "Last name", value: p.lastName.trim() },
    { id: "full", label: "Full name", value: p.name.trim() },
    { id: "title", label: "Title", value: p.title.trim() },
    { id: "company", label: "Company", value: p.company.trim() },
    { id: "bio", label: "Short description", value: p.bio.trim() },
  ];

  const filled = p.contacts.filter(isFilled);
  const emails = filled.filter((c) => c.type === "email");
  const messengers = filled.filter((c) => c.type !== "email" && messengerName(c));
  const messengerIds = new Set(messengers.map((c) => c.id));
  const phones = filled.filter((c) => c.type === "phone" && !messengerIds.has(c.id));

  const contactRows: FormField[] = [
    ...emails.map((c) => ({
      id: c.id,
      label: fieldLabel("Email", c.label),
      value: c.value.trim(),
    })),
    ...phones.map((c) => ({
      id: c.id,
      label: fieldLabel("Phone", c.label),
      value: c.value.trim(),
    })),
    ...messengers.map((c) => ({
      id: c.id,
      label: fieldLabel(messengerName(c) ?? "Messenger", c.label),
      value: c.value.trim(),
    })),
  ];
  rows.push(...numberDuplicates(contactRows));

  const site = p.contacts.find((c) => c.id === "website" && isFilled(c));
  const linkedin = p.contacts.find((c) => c.id === "linkedin" && isFilled(c));
  if (site) rows.push({ id: "website", label: "Website", value: site.value.trim() });
  if (linkedin) rows.push({ id: "linkedin", label: "LinkedIn", value: linkedin.value.trim() });
  return rows;
}

function esc(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

/**
 * Builds a short vCard 3.0 on the device.
 * Phone cameras offer "Add to contacts" after scanning, with no network.
 * Email and phone are included only when those cards already exist and are not archived.
 */
export function buildVCard(p: Profile): string {
  const email = p.contacts.find((c) => c.type === "email" && !c.archived)?.value ?? "";
  const phone = p.contacts.find((c) => c.type === "phone" && !c.archived)?.value ?? "";
  const site = p.contacts.find((c) => c.id === "website" && !c.archived)?.value ?? "";
  const note = p.bio.trim().slice(0, 100);
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${esc(p.lastName)};${esc(p.firstName)};;;`,
    `FN:${esc(p.name)}`,
    p.company.trim() ? `ORG:${esc(p.company.trim())}` : "",
    p.title.trim() ? `TITLE:${esc(p.title.trim())}` : "",
    email.trim() ? `EMAIL;TYPE=INTERNET:${email.trim()}` : "",
    phone.trim() ? `TEL;TYPE=CELL:${phone.replace(/[^\d+]/g, "")}` : "",
    site.trim() ? `URL:${site.trim()}` : "",
    note ? `NOTE:${esc(note)}` : "",
    "END:VCARD",
  ];
  return lines.filter(Boolean).join("\r\n");
}

/** Resolves the string that goes inside the QR code for a given contact. */
export function qrValueFor(contact: Contact, p: Profile): string {
  switch (contact.type) {
    case "email":
      return `mailto:${contact.value}`;
    case "phone":
      // tel: URIs are safest without spaces or dashes
      return `tel:${contact.value.replace(/[\s\-()]/g, "")}`;
    case "vcard":
      return buildVCard(p);
    default:
      return contact.value;
  }
}
