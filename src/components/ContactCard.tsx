import { Contact } from "@/data/profile";

interface ContactCardProps {
  contact: Contact;
  onSelect: (contact: Contact) => void;
}

export default function ContactCard({ contact, onSelect }: ContactCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(contact)}
      className="group flex w-full items-center justify-between gap-3 rounded-xl bg-card border border-line px-5 py-4 text-left transition-colors hover:border-lanyard focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lanyard active:bg-lanyard-soft"
    >
      <span className="min-w-0">
        <span className="block font-display text-base font-semibold leading-snug">
          {contact.label}
        </span>
        <span className="block truncate text-xs text-ink-soft">
          {contact.hint}
        </span>
      </span>

      {/* Mini QR glyph: says "tap for QR" without words */}
      <span
        aria-hidden="true"
        className="grid shrink-0 grid-cols-2 gap-[3px] rounded-md border border-line p-[6px] transition-colors group-hover:border-lanyard"
      >
        <span className="h-2 w-2 rounded-[2px] bg-ink" />
        <span className="h-2 w-2 rounded-[2px] bg-lanyard" />
        <span className="h-2 w-2 rounded-[2px] bg-lanyard" />
        <span className="h-2 w-2 rounded-[2px] bg-ink" />
      </span>
    </button>
  );
}
