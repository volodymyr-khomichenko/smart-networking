import { Contact } from "@/data/profile";
import { BrandIcon } from "@/components/icons";

interface ContactCardProps {
  contact: Contact;
  onSelect: (contact: Contact) => void;
  onToggleFavorite: (contact: Contact) => void;
}

export default function ContactCard({
  contact,
  onSelect,
  onToggleFavorite,
}: ContactCardProps) {
  const pinned = contact.favorite ?? false;
  return (
    <div className="group flex items-center rounded-xl bg-card border border-line transition-colors hover:border-lanyard focus-within:border-lanyard">
      <button
        type="button"
        onClick={() => onSelect(contact)}
        className="flex min-w-0 flex-1 items-center gap-4 py-4 pl-4 pr-1 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lanyard active:bg-lanyard-soft rounded-l-xl"
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

      <button
        type="button"
        onClick={() => onToggleFavorite(contact)}
        aria-pressed={pinned}
        aria-label={pinned ? `Unpin ${contact.label}` : `Pin ${contact.label}`}
        title={pinned ? "Unpin" : "Pin to top"}
        className={`mx-1.5 shrink-0 rounded-lg p-2.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lanyard ${
          pinned
            ? "text-lanyard hover:bg-lanyard-soft"
            : "text-line hover:bg-paper hover:text-ink-soft"
        }`}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      </button>
    </div>
  );
}
