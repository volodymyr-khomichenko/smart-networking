// ---------------------------------------------------------------------------
// Smart Networking — profile configuration
//
// This is the only file you need to edit.
// Update the values below whenever your links change.
// ---------------------------------------------------------------------------

export type ContactType = "url" | "email" | "vcard";

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
  /** Which profile modes this card belongs to */
  modes: ModeId[];
  /**
   * For "url":   full link, e.g. https://linkedin.com/in/you
   * For "email": plain address, e.g. you@example.com
   * For "vcard": leave empty — the vCard is generated from the profile below
   */
  value: string;
}

export interface Profile {
  name: string;
  title: string;
  bio: string;
  /** Shown in the avatar circle, e.g. "VK" */
  initials: string;
  /** Editable tab names for the card list */
  tabs: Tab[];
  contacts: Contact[];
}

export const profile: Profile = {
  name: "Volodymyr Khomichenko",
  title: "Tech B2B Marketing Strategist & Author",
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
      modes: ["business"],
      label: "LinkedIn",
      hint: "Let's connect professionally",
      type: "url",
      value: "https://www.linkedin.com/in/volodymyrkh/",
    },
    {
      id: "website",
      modes: ["hobby"],
      label: "Website",
      hint: "My personal hub — book, podcast, articles",
      type: "url",
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
      modes: ["hobby"],
      label: "Substack",
      hint: "My newsletter: Rapid Growth",
      type: "url",
      value: "https://substack.com/@rapidgrowth",
    },
    {
      id: "apple-podcasts",
      modes: ["hobby"],
      label: "Apple Podcasts",
      hint: "My podcast on Apple Podcasts",
      type: "url",
      value:
        "https://podcasts.apple.com/us/podcast/the-marketing-behind-rapid-growth/id6783273819",
    },
    {
      id: "spotify",
      modes: ["hobby"],
      label: "Spotify",
      hint: "My podcast on Spotify",
      type: "url",
      value: "https://open.spotify.com/show/033xOGviIOxl8R0FtlNnen",
    },
    {
      id: "youtube",
      modes: ["hobby"],
      label: "YouTube",
      hint: "Podcast episodes in video",
      type: "url",
      value:
        "https://www.youtube.com/playlist?list=PLE1kZdLcUjyJH8Vt221NXKmYFOB7az_YU",
    },
    {
      id: "x",
      modes: ["business"],
      label: "X / Twitter",
      hint: "Daily takes on B2B marketing",
      type: "url",
      value: "https://x.com/V_Khomichenko",
    },
    {
      id: "medium",
      modes: ["hobby"],
      label: "Medium",
      hint: "My marketing articles",
      type: "url",
      value: "https://medium.com/@Khomichenko",
    },
    {
      id: "hackernoon",
      modes: ["hobby"],
      label: "HackerNoon",
      hint: "My tech & growth stories",
      type: "url",
      value: "https://hackernoon.com/u/khomichenko",
    },
    {
      id: "amazon",
      modes: ["hobby"],
      label: "Amazon",
      hint: "My book on Amazon",
      type: "url",
      value: "https://amazon.com/author/khomichenko",
    },
    {
      id: "goodreads",
      modes: ["hobby"],
      label: "Goodreads",
      hint: "My author page on Goodreads",
      type: "url",
      value: "https://www.goodreads.com/khomichenko",
    },
    {
      id: "producthunt",
      modes: ["hobby"],
      label: "Product Hunt",
      hint: "My launches & product picks",
      type: "url",
      value: "https://www.producthunt.com/@khomichenko",
    },
    {
      id: "github",
      modes: ["hobby"],
      label: "GitHub",
      hint: "My side projects (like this one)",
      type: "url",
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
      value: "https://www.tiktok.com/@behind.rapid.growth",
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
  ],
};

/**
 * Builds a vCard payload from the profile.
 * When encoded into a QR code, most phone cameras offer
 * "Add to contacts" directly after scanning.
 */
export function buildVCard(p: Profile): string {
  const email = p.contacts.find((c) => c.type === "email")?.value ?? "";
  const site = p.contacts.find((c) => c.id === "website")?.value ?? "";
  const linkedin = p.contacts.find((c) => c.id === "linkedin")?.value ?? "";
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${p.name}`,
    `TITLE:${p.title}`,
    email ? `EMAIL;TYPE=INTERNET:${email}` : "",
    site ? `URL:${site}` : "",
    linkedin ? `URL:${linkedin}` : "",
    `NOTE:${p.bio}`,
    "END:VCARD",
  ];
  return lines.filter(Boolean).join("\r\n");
}

/** Resolves the string that goes inside the QR code for a given contact. */
export function qrValueFor(contact: Contact, p: Profile): string {
  switch (contact.type) {
    case "email":
      return `mailto:${contact.value}`;
    case "vcard":
      return buildVCard(p);
    default:
      return contact.value;
  }
}
