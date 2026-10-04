import { Contact, Profile } from "@/data/profile";

export function saveContactCard(): Contact {
  return {
    id: "save-contact",
    label: "Save contact",
    hint: "Scan to add me to your phone",
    type: "vcard",
    modes: ["business", "personal", "hobby"],
    value: "",
  };
}

function esc(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

/** Short vCard so the QR stays scannable with a center mark. Phone cameras offer Add to contacts. */
export function buildVCard(p: Profile): string {
  const email = p.contacts.find((c) => c.type === "email" && !c.archived)?.value ?? "";
  const phone = p.contacts.find((c) => c.type === "phone" && !c.archived)?.value ?? "";
  const site =
    p.contacts.find((c) => c.id === "website" && !c.archived)?.value ?? "";
  const note = p.bio.trim().slice(0, 100);
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${esc(p.lastName)};${esc(p.firstName)};;;`,
    `FN:${esc(p.name)}`,
    p.company ? `ORG:${esc(p.company)}` : "",
    p.title ? `TITLE:${esc(p.title)}` : "",
    email ? `EMAIL;TYPE=INTERNET:${email.trim()}` : "",
    phone ? `TEL;TYPE=CELL:${phone.replace(/[^\d+]/g, "")}` : "",
    site ? `URL:${site.trim()}` : "",
    note ? `NOTE:${esc(note)}` : "",
    "END:VCARD",
  ];
  return lines.filter(Boolean).join("\r\n");
}
