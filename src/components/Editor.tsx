"use client";

import { useMemo, useState } from "react";
import {
  Contact,
  ContactType,
  ModeId,
  Profile,
  Tab,
} from "@/data/profile";
import { BRAND_ICON_PATHS, BrandIcon } from "@/components/icons";

interface EditorProps {
  initial: Profile;
  isCustom: boolean;
  onSave: (profile: Profile) => void;
  onReset: () => void;
  onClose: () => void;
}

function clone(p: Profile): Profile {
  return JSON.parse(JSON.stringify(p));
}

/** Tap a filled field — the text gets selected, so typing replaces it. */
const selectOnFocus = (
  e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
) => e.currentTarget.select();

const inputCls =
  "w-full rounded-lg border border-line bg-card px-3 py-2.5 text-sm outline-none transition-colors focus:border-lanyard placeholder:text-ink-soft/60";
const labelCls =
  "mb-1 block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-soft";

const ICON_OPTIONS = Object.keys(BRAND_ICON_PATHS);
const MAX_FAVORITES = 5;

export default function Editor({
  initial,
  isCustom,
  onSave,
  onReset,
  onClose,
}: EditorProps) {
  const [draft, setDraft] = useState<Profile>(() => {
    const base = clone(initial);
    if (!isCustom) {
      // First-time edit of the demo: fields start empty, demo shows as placeholder
      base.name = "";
      base.title = "";
      base.bio = "";
      base.initials = "";
    }
    return base;
  });

  const favoritesCount = useMemo(
    () => draft.contacts.filter((c) => c.favorite).length,
    [draft.contacts]
  );

  const setField = (
    field: "name" | "title" | "bio" | "initials",
    value: string
  ) => setDraft((d) => ({ ...d, [field]: value }));

  const setTabLabel = (id: Tab["id"], label: string) =>
    setDraft((d) => ({
      ...d,
      tabs: d.tabs.map((t) => (t.id === id ? { ...t, label } : t)),
    }));

  const setContact = (idx: number, patch: Partial<Contact>) =>
    setDraft((d) => {
      const contacts = [...d.contacts];
      contacts[idx] = { ...contacts[idx], ...patch };
      return { ...d, contacts };
    });

  const removeContact = (idx: number) =>
    setDraft((d) => ({
      ...d,
      contacts: d.contacts.filter((_, i) => i !== idx),
    }));

  const addContact = () =>
    setDraft((d) => ({
      ...d,
      contacts: [
        ...d.contacts,
        {
          id: `custom-${Date.now()}`,
          label: "",
          hint: "",
          type: "url" as ContactType,
          icon: "link",
          modes: ["business" as ModeId],
          value: "",
        },
      ],
    }));

  const toggleFavorite = (idx: number) =>
    setDraft((d) => {
      const contacts = [...d.contacts];
      const c = contacts[idx];
      if (!c.favorite && favoritesCount >= MAX_FAVORITES) return d;
      contacts[idx] = { ...c, favorite: !c.favorite };
      return { ...d, contacts };
    });

  const handleSave = () => {
    const cleaned: Profile = {
      ...draft,
      name: draft.name.trim() || initial.name,
      title: draft.title.trim(),
      bio: draft.bio.trim(),
      initials: (draft.initials.trim() || initial.initials || "SN")
        .slice(0, 3)
        .toUpperCase(),
      tabs: draft.tabs.map((t) => ({
        ...t,
        label: t.label.trim() || t.id,
      })),
      contacts: draft.contacts
        .filter((c) => c.label.trim() && (c.type === "vcard" || c.value.trim()))
        .map((c) => ({
          ...c,
          label: c.label.trim(),
          hint: c.hint.trim(),
          value: c.value.trim(),
          modes: c.modes.length ? c.modes : ["business" as ModeId],
        })),
    };
    onSave(cleaned);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Edit profile"
      className="fixed inset-0 z-50 overflow-y-auto bg-paper"
    >
      <div className="mx-auto w-full max-w-md px-4 pb-32 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Edit profile</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-line bg-card px-3 py-2 text-xs font-semibold text-ink-soft transition-colors hover:border-ink hover:text-ink"
          >
            Cancel
          </button>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-ink-soft">
          Your changes are saved only in this browser on this device — nothing
          is uploaded anywhere. Grey text is just a hint: start typing your own
          details right over it.
        </p>

        {/* Profile fields */}
        <section className="mt-5 rounded-2xl border border-line bg-card p-4">
          <div className="grid grid-cols-[1fr_5.5rem] gap-3">
            <div>
              <label htmlFor="ed-name" className={labelCls}>
                Name
              </label>
              <input
                id="ed-name"
                className={inputCls}
                value={draft.name}
                onChange={(e) => setField("name", e.target.value)}
                onFocus={selectOnFocus}
                placeholder={initial.name}
              />
            </div>
            <div>
              <label htmlFor="ed-initials" className={labelCls}>
                Initials
              </label>
              <input
                id="ed-initials"
                className={inputCls}
                value={draft.initials}
                maxLength={3}
                onChange={(e) => setField("initials", e.target.value)}
                onFocus={selectOnFocus}
                placeholder={initial.initials}
              />
            </div>
          </div>
          <div className="mt-3">
            <label htmlFor="ed-title" className={labelCls}>
              Title
            </label>
            <input
              id="ed-title"
              className={inputCls}
              value={draft.title}
              onChange={(e) => setField("title", e.target.value)}
              onFocus={selectOnFocus}
              placeholder={initial.title}
            />
          </div>
          <div className="mt-3">
            <label htmlFor="ed-bio" className={labelCls}>
              Bio
            </label>
            <textarea
              id="ed-bio"
              rows={3}
              className={`${inputCls} resize-none`}
              value={draft.bio}
              onChange={(e) => setField("bio", e.target.value)}
              onFocus={selectOnFocus}
              placeholder={initial.bio}
            />
          </div>
        </section>

        {/* Tab names */}
        <h3 className="mt-6 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-soft">
          Tab names
        </h3>
        <section className="mt-2 grid grid-cols-3 gap-2 rounded-2xl border border-line bg-card p-4">
          {draft.tabs.map((t) => (
            <input
              key={t.id}
              aria-label={`Tab name for ${t.id}`}
              className={inputCls}
              value={t.label}
              onChange={(e) => setTabLabel(t.id, e.target.value)}
              onFocus={selectOnFocus}
            />
          ))}
        </section>

        {/* Cards */}
        <div className="mt-6 flex items-center justify-between">
          <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-soft">
            Cards ({draft.contacts.length})
          </h3>
          <span className="text-[0.7rem] text-ink-soft">
            ★ pinned {favoritesCount}/{MAX_FAVORITES}
          </span>
        </div>

        <div className="mt-2 space-y-3">
          {draft.contacts.map((c, idx) => (
            <section
              key={c.id}
              className="rounded-2xl border border-line bg-card p-4"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-paper text-ink">
                  <BrandIcon id={c.icon ?? c.id} className="h-4 w-4" />
                </span>
                <input
                  aria-label="Card name"
                  className={inputCls}
                  value={c.label}
                  onChange={(e) => setContact(idx, { label: e.target.value })}
                  onFocus={selectOnFocus}
                  placeholder="Card name"
                />
                <button
                  type="button"
                  onClick={() => toggleFavorite(idx)}
                  aria-pressed={c.favorite ?? false}
                  aria-label={c.favorite ? "Unpin" : "Pin to top"}
                  className={`shrink-0 rounded-lg p-2 transition-colors ${
                    c.favorite
                      ? "text-lanyard hover:bg-lanyard-soft"
                      : "text-line hover:bg-paper hover:text-ink-soft"
                  }`}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => removeContact(idx)}
                  aria-label={`Remove ${c.label || "card"}`}
                  className="shrink-0 rounded-lg p-2 text-ink-soft transition-colors hover:bg-paper hover:text-red-500"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </button>
              </div>

              {c.type !== "vcard" && (
                <input
                  aria-label="Link or email"
                  className={`${inputCls} mt-2`}
                  value={c.value}
                  onChange={(e) => setContact(idx, { value: e.target.value })}
                  onFocus={selectOnFocus}
                  placeholder={
                    c.type === "email" ? "you@example.com" : "https://…"
                  }
                  inputMode={c.type === "email" ? "email" : "url"}
                />
              )}
              <input
                aria-label="Short description"
                className={`${inputCls} mt-2`}
                value={c.hint}
                onChange={(e) => setContact(idx, { hint: e.target.value })}
                onFocus={selectOnFocus}
                placeholder="Short description (shown under the name)"
              />

              <div className="mt-2 grid grid-cols-2 gap-2">
                <select
                  aria-label="Tab"
                  className={inputCls}
                  value={c.modes[0] ?? "business"}
                  onChange={(e) =>
                    setContact(idx, { modes: [e.target.value as ModeId] })
                  }
                >
                  {draft.tabs.map((t) => (
                    <option key={t.id} value={t.id}>
                      Tab: {t.label}
                    </option>
                  ))}
                </select>
                <select
                  aria-label="Icon"
                  className={inputCls}
                  value={c.icon ?? c.id}
                  onChange={(e) => setContact(idx, { icon: e.target.value })}
                >
                  {ICON_OPTIONS.map((i) => (
                    <option key={i} value={i}>
                      Icon: {i}
                    </option>
                  ))}
                </select>
              </div>
            </section>
          ))}
        </div>

        <button
          type="button"
          onClick={addContact}
          className="mt-3 w-full rounded-xl border border-dashed border-line bg-card px-4 py-3 font-display text-sm font-semibold text-ink-soft transition-colors hover:border-lanyard hover:text-lanyard"
        >
          + Add card
        </button>

        {isCustom && (
          <button
            type="button"
            onClick={onReset}
            className="mt-6 w-full rounded-xl px-4 py-3 text-xs font-semibold text-ink-soft underline decoration-line underline-offset-4 transition-colors hover:text-red-500"
          >
            Reset to the demo profile
          </button>
        )}
      </div>

      {/* Sticky action bar */}
      <div className="fixed inset-x-0 bottom-0 border-t border-line bg-card">
        <div className="mx-auto flex w-full max-w-md gap-3 px-4 py-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-line px-4 py-3 font-display text-sm font-semibold text-ink-soft transition-colors hover:border-ink hover:text-ink"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-[2] rounded-xl bg-lanyard px-4 py-3 font-display text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
