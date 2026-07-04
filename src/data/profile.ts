// ---------------------------------------------------------------------------
// Smart Networking — profile configuration
//
// This is the only file you need to edit.
// Update the values below whenever your links change.
// ---------------------------------------------------------------------------

export type ContactType = "url" | "email" | "vcard";

export interface Contact {
  id: string;
  label: string;
  /** Short line shown under the label on the card */
  hint: string;
  type: ContactType;
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
  contacts: Contact[];
}

export const profile: Profile = {
  name: "Volodymyr Khomichenko",
  title: "Tech B2B Marketing Strategist & Author",
  bio: "12+ years in marketing, 8+ in B2B tech. Author of The Marketing Behind Rapid Growth book, podcast and newsletter.",
  initials: "VK",
  contacts: [
    {
      id: "linkedin",
      label: "LinkedIn",
      hint: "Let's connect professionally",
      type: "url",
      value: "https://www.linkedin.com/in/volodymyrkh/",
    },
    {
      id: "website",
      label: "Website",
      hint: "My personal hub — book, podcast, articles",
      type: "url",
      value: "https://khomichenko.com/",
    },
    {
      id: "substack",
      label: "Substack",
      hint: "My newsletter: Rapid Growth",
      type: "url",
      value: "https://substack.com/@rapidgrowth",
    },
    {
      id: "apple-podcasts",
      label: "Apple Podcasts",
      hint: "My podcast on Apple Podcasts",
      type: "url",
      value:
        "https://podcasts.apple.com/us/podcast/the-marketing-behind-rapid-growth/id6783273819",
    },
    {
      id: "spotify",
      label: "Spotify",
      hint: "My podcast on Spotify",
      type: "url",
      value: "https://open.spotify.com/show/033xOGviIOxl8R0FtlNnen",
    },
    {
      id: "youtube",
      label: "YouTube",
      hint: "Podcast episodes in video",
      type: "url",
      value:
        "https://www.youtube.com/playlist?list=PLE1kZdLcUjyJH8Vt221NXKmYFOB7az_YU",
    },
    {
      id: "x",
      label: "X / Twitter",
      hint: "Daily takes on B2B marketing",
      type: "url",
      value: "https://x.com/V_Khomichenko",
    },
    {
      id: "medium",
      label: "Medium",
      hint: "My marketing articles",
      type: "url",
      value: "https://medium.com/@Khomichenko",
    },
    {
      id: "hackernoon",
      label: "HackerNoon",
      hint: "My tech & growth stories",
      type: "url",
      value: "https://hackernoon.com/u/khomichenko",
    },
    {
      id: "amazon",
      label: "Amazon",
      hint: "My book on Amazon",
      type: "url",
      value: "https://amazon.com/author/khomichenko",
    },
    {
      id: "goodreads",
      label: "Goodreads",
      hint: "My author page on Goodreads",
      type: "url",
      value: "https://www.goodreads.com/khomichenko",
    },
    {
      id: "producthunt",
      label: "Product Hunt",
      hint: "My launches & product picks",
      type: "url",
      value: "https://www.producthunt.com/@khomichenko",
    },
    {
      id: "github",
      label: "GitHub",
      hint: "My side projects (like this one)",
      type: "url",
      value: "https://github.com/volodymyr-khomichenko",
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
