import { Contact } from "@/data/profile";
import { BrandIcon } from "@/components/icons";

interface PinnedBarProps {
  contacts: Contact[];
  onSelect: (contact: Contact) => void;
}

/** Up to 5 favorite links pinned between the profile and the tabs. */
export default function PinnedBar({ contacts, onSelect }: PinnedBarProps) {
  if (contacts.length === 0) return null;
  return (
    <div className="mt-4 flex flex-wrap justify-center gap-2">
      {contacts.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => onSelect(c)}
          className="flex items-center gap-2 rounded-full border border-line bg-card py-2 pl-2.5 pr-3.5 transition-colors hover:border-lanyard focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lanyard active:bg-lanyard-soft"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-lanyard-soft text-lanyard">
            <BrandIcon id={c.icon ?? c.id} className="h-3.5 w-3.5" />
          </span>
          <span className="font-display text-sm font-semibold">{c.label}</span>
        </button>
      ))}
    </div>
  );
}
