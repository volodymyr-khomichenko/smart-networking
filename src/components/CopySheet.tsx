"use client";

import { useEffect, useState } from "react";
import { FormField, formFields, Profile } from "@/data/profile";

interface CopySheetProps {
  profile: Profile;
  onClose: () => void;
  onEdit: () => void;
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
    } catch {
      /* ignore */
    }
    document.body.removeChild(ta);
  }
}

export default function CopySheet({ profile, onClose, onEdit }: CopySheetProps) {
  const fields = formFields(profile);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const copyField = async (field: FormField) => {
    if (!field.value) return;
    await copyText(field.value);
    setCopiedId(field.id);
    window.setTimeout(() => setCopiedId((id) => (id === field.id ? null : id)), 1600);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Copy for forms"
      className="fixed inset-0 z-50 overflow-y-auto bg-paper"
    >
      <div className="mx-auto w-full max-w-md px-4 pb-12 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Copy for forms</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-line bg-card px-3 py-2 text-xs font-semibold text-ink-soft transition-colors hover:border-ink hover:text-ink"
          >
            Close
          </button>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Tap a line to copy just that value, then paste it into the registration form.
        </p>

        <div className="mt-5 space-y-2">
          {fields.map((field) => {
            const copied = copiedId === field.id;
            const empty = field.value.length === 0;
            return (
              <div
                key={field.id}
                className="flex items-center gap-3 rounded-xl border border-line bg-card px-4 py-3"
              >
                <button
                  type="button"
                  onClick={() => copyField(field)}
                  disabled={empty}
                  className="min-w-0 flex-1 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lanyard disabled:cursor-default"
                >
                  <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-soft">
                    {field.label}
                  </span>
                  <span
                    className={`mt-0.5 block text-base leading-snug ${
                      empty ? "text-ink-soft" : "text-ink"
                    }`}
                  >
                    {empty ? "Not set yet" : field.value}
                  </span>
                </button>
                {empty ? (
                  <button
                    type="button"
                    onClick={onEdit}
                    className="shrink-0 rounded-lg border border-line px-2.5 py-1.5 text-xs font-semibold text-ink-soft transition-colors hover:border-lanyard hover:text-lanyard"
                  >
                    Add
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => copyField(field)}
                    aria-label={copied ? `${field.label} copied` : `Copy ${field.label}`}
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lanyard ${
                      copied
                        ? "bg-lanyard-soft text-lanyard"
                        : "text-ink-soft hover:bg-lanyard-soft hover:text-lanyard"
                    }`}
                  >
                    {copied ? (
                      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
                        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                      </svg>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
