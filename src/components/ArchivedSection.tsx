"use client";

import { useState } from "react";
import { Contact } from "@/data/profile";
import { BrandIcon } from "@/components/icons";

interface ArchivedSectionProps {
  contacts: Contact[];
  onRestore: (contact: Contact) => void;
}

/**
 * A quiet grey strip at the bottom of the list.
 * Tap to expand archived cards; each can be restored.
 * (Deleting a card permanently is only possible in the full editor.)
 */
export default function ArchivedSection({
  contacts,
  onRestore,
}: ArchivedSectionProps) {
  const [open, setOpen] = useState(false);
  if (contacts.length === 0) return null;

  return (
    <section className="mt-8">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between rounded-lg bg-line/50 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft transition-colors hover:bg-line"
      >
        <span>Archived cards ({contacts.length})</span>
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
        </svg>
      </button>

      {open && (
        <div className="mt-3 space-y-2">
          {contacts.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-3 rounded-xl border border-line bg-paper px-4 py-3 opacity-80"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-card text-ink-soft">
                <BrandIcon id={c.icon ?? c.id} className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-sm font-semibold text-ink-soft">
                  {c.label}
                </span>
              </span>
              <button
                type="button"
                onClick={() => onRestore(c)}
                className="shrink-0 rounded-lg border border-line bg-card px-2.5 py-1.5 text-xs font-semibold text-ink-soft transition-colors hover:border-lanyard hover:text-lanyard"
              >
                Restore
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
