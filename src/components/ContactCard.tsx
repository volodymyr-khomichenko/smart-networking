import { Contact } from "@/data/profile";
import { BrandIcon } from "@/components/icons";

interface ContactCardProps {
  contact: Contact;
  onSelect: (contact: Contact) => void;
}

export default function ContactCard({ contact, onSelect }: ContactCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(contact)}
      className="group flex w-full items-center gap-4 rounded-xl bg-card border border-line px-4 py-4 text-left transition-colors hover:border-lanyard focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lanyard active:bg-lanyard-soft"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-paper text-ink transition-colors group-hover:bg-lanyard-soft group-hover:text-lanyard">
        <BrandIcon id={contact.icon ?? contact.id} className="h-5 w-5" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block font-display text-base font-semibold leading-snug">
          {contact.label}
        </span>
        <span className="block truncate text-xs text-ink-soft">
          {contact.hint}
        </span>
      </span>

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
