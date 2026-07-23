"use client";

import { useRef, useState } from "react";
import { Contact } from "@/data/profile";
import { BrandIcon } from "@/components/icons";

interface ContactCardProps {
  contact: Contact;
  onSelect: (contact: Contact) => void;
  onToggleFavorite: (contact: Contact) => void;
  onArchive: (contact: Contact) => void;
  onEdit: (contact: Contact) => void;
}

const REVEAL = 92; // px the row slides to reveal an action
const THRESHOLD = 48; // px of drag needed to snap open

/**
 * A link card with swipe gestures:
 *   swipe right → reveals "Archive", swipe left → reveals "Edit".
 * Deleting is deliberately kept in the full editor only,
 * so a needed card can't be lost with one careless swipe.
 */
export default function ContactCard({
  contact,
  onSelect,
  onToggleFavorite,
  onArchive,
  onEdit,
}: ContactCardProps) {
  const pinned = contact.favorite ?? false;
  const [dx, setDx] = useState(0);
  const drag = useRef<{ startX: number; startDx: number; active: boolean }>({
    startX: 0,
    startDx: 0,
    active: false,
  });
  const moved = useRef(false);

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { startX: e.clientX, startDx: dx, active: true };
    moved.current = false;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    const delta = e.clientX - drag.current.startX;
    if (Math.abs(delta) > 6) {
      moved.current = true;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }
    const next = Math.max(-REVEAL, Math.min(REVEAL, drag.current.startDx + delta));
    setDx(next);
  };

  const onPointerUp = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    if (dx > THRESHOLD) setDx(REVEAL);
    else if (dx < -THRESHOLD) setDx(-REVEAL);
    else setDx(0);
  };

  const handleCardClick = () => {
    if (moved.current) return; // it was a drag, not a tap
    if (dx !== 0) {
      setDx(0); // close the revealed action first
      return;
    }
    onSelect(contact);
  };

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Action layers behind the row */}
      <div className="absolute inset-0 flex items-stretch justify-between">
        <button
          type="button"
          tabIndex={dx === REVEAL ? 0 : -1}
          onClick={() => {
            setDx(0);
            onArchive(contact);
          }}
          aria-label={`Archive ${contact.label}`}
          className="flex w-[92px] flex-col items-center justify-center gap-1 rounded-l-xl bg-ink-soft text-white"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
            <path d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5zM5.12 5l.81-1h12l.94 1H5.12z" />
          </svg>
          <span className="text-[0.65rem] font-semibold">Archive</span>
        </button>
        <button
          type="button"
          tabIndex={dx === -REVEAL ? 0 : -1}
          onClick={() => {
            setDx(0);
            onEdit(contact);
          }}
          aria-label={`Edit ${contact.label}`}
          className="flex w-[92px] flex-col items-center justify-center gap-1 rounded-r-xl bg-lanyard text-white"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
          </svg>
          <span className="text-[0.65rem] font-semibold">Edit</span>
        </button>
      </div>

      {/* Foreground row */}
      <div
        className="group relative flex touch-pan-y select-none items-center rounded-xl bg-card border border-line transition-colors hover:border-lanyard focus-within:border-lanyard"
        style={{
          transform: `translateX(${dx}px)`,
          transition: drag.current.active ? "none" : "transform 0.18s ease",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <button
          type="button"
          onClick={handleCardClick}
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
          onClick={() => {
            if (dx !== 0) {
              setDx(0);
              return;
            }
            onToggleFavorite(contact);
          }}
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
    </div>
  );
}
