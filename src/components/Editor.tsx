"use client";

import { useState } from "react";
import { Contact, ModeId, Profile } from "@/data/profile";
import { BRAND_ICON_PATHS, BrandIcon } from "@/components/icons";

interface EditorProps {
  initial: Profile;
  isCustom: boolean;
  onSave: (profile: Profile) => void;
  onReset: () => void;
  onClose: () => void;
}

const inputCls =
  "w-full rounded-lg border border-line bg-card px-3 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 focus:outline-2 focus:outline-lanyard";
const labelCls =
  "mb-1 block text-xs font-semibold uppercase tracking-[0.08em] text-ink-soft";

function clone(p: Profile): Profile {
  return JSON.parse(JSON.stringify(p));
}

/** Tap a filled field — the text gets selected, so typing replaces it. */
const selectOnFocus = (
  e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
) => e.currentTarget.select();

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

  const setField = (field: "name" | "title" | "bio" | "initials", v: string) =>
    setDraft((d) => ({ ...d, [field]: v }));

  const setTabLabel = (id: ModeId, label: string) =>
    setDraft((d) => ({
      ...d,
      tabs: d.tabs.map((t) => (t.id === id ? { ...t, label } : t)),
    }));

  const setContact = (idx: number, patch: Partial<Contact>) =>
    setDraft((d) => ({
      ...d,
      contacts: d.contacts.map((c, i) => (i === idx ? { ...c, ...patch } : c)),
    }));

  const toggleFavorite = (idx: number) =>
    setDraft((d) => {
      const target = d.contacts[idx];
      const pinnedCount = d.contacts.filter((c) => c.favorite).length;
      if (!target.favorite && pinnedCount >= 5) {
        alert("You can pin up to 5 links.");
        return d;
      }
      return {
        ...d,
        contacts: d.contacts.map((c, i) =>
          i === idx ? { ...c, favorite: !c.favorite } : c
        ),
      };
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
          type: "url",
          icon: "link",
          modes: ["business"],
          value: "",
        },
      ],
    }));

  const handleSave = () => {
    const cleaned: Profile = {
      ...draft,
      name: draft.name.trim() || initial.name,
      initials: (draft.initials.trim() || initial.initials || "SN")
        .slice(0, 3)
        .toUpperCase(),
      tabs: draft.tabs.map((t, i) => ({
        ...t,
        label: t.label.trim() || initial.tabs[i]?.label || "Tab",
      })),
      contacts: draft.contacts.filter(
        (c) => c.label.trim() !== "" && c.value.trim() !== ""
      ),
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
      <div className="mx-auto w-full max-w-md px-4 pb-28 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Edit profile</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close editor"
            className="rounded-lg border border-line bg-card px-3 py-2 text-sm font-semibold text-ink-soft hover:border-lanyard"
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
        <section className="mt-6 rounded-2xl border border-line bg-card p-5">
          <div className="grid grid-cols-[1fr_5.5rem] gap-3">
            <div>
              <label className={labelCls} htmlFor="ed-name">
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
              <label className={labelCls} htmlFor="ed-initials">
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
            <label className={labelCls} htmlFor="ed-title">
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
            <label className={labelCls} htmlFor="ed-bio">
              Bio
            </label>
            <textarea
              id="ed-bio"
              className={`${inputCls} min-h-20 resize-y`}
              value={draft.bio}
              onChange={(e) => setField("bio", e.target.value)}
              onFocus={selectOnFocus}
              placeholder={initial.bio}
            />
          </div>
        </section>

        {/* Tabs */}
        <h3 className="mt-8 mb-3 px-1 text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
          Tab names
        </h3>
        <section className="grid grid-cols-3 gap-3 rounded-2xl border border-line bg-card p-4">
          {draft.tabs.map((t) => (
            <input
              key={t.id}
              className={inputCls}
              value={t.label}
              onChange={(e) => setTabLabel(t.id, e.target.value)}
              onFocus={selectOnFocus}
              aria-label={`Tab name`}
            />
          ))}
        </section>

        {/* Cards */}
        <h3 className="mt-8 mb-1 px-1 text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
          Cards ({draft.contacts.length})
        </h3>
        <p className="mb-3 px-1 text-xs text-ink-soft">
          Tap the star to pin a link above the tabs (up to 5).
        </p>
        <div className="flex flex-col gap-3">
          {draft.contacts.map((c, idx) => (
            <div
              key={c.id}
              className="rounded-2xl border border-line bg-card p-4"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-paper text-ink">
                  <BrandIcon id={c.icon ?? c.id} className="h-4 w-4" />
                </span>
                <input
                  className={inputCls}
                  value={c.label}
                  onChange={(e) => setContact(idx, { label: e.target.value })}
                  onFocus={selectOnFocus}
                  placeholder="Card name (e.g. LinkedIn)"
                  aria-label="Card name"
                />
                <button
                  type="button"
                  onClick={() => toggleFavorite(idx)}
                  aria-label={c.favorite ? `Unpin ${c.label || "card"}` : `Pin ${c.label || "card"}`}
                  aria-pressed={c.favorite ?? false}
                  className={`shrink-0 rounded-lg border px-2.5 py-2 text-sm transition-colors ${
                    c.favorite
                      ? "border-lanyard bg-lanyard-soft text-lanyard"
                      : "border-line text-ink-soft hover:border-lanyard hover:text-lanyard"
                  }`}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => removeContact(idx)}
                  aria-label={`Delete ${c.label || "card"}`}
                  className="shrink-0 rounded-lg border border-line px-3 py-2 text-sm font-semibold text-ink-soft hover:border-red-400 hover:text-red-500"
                >
                  ✕
                </button>
              </div>
              <div className="mt-3">
                <input
                  className={inputCls}
                  value={c.value}
                  onChange={(e) => setContact(idx, { value: e.target.value })}
                  onFocus={selectOnFocus}
                  placeholder="https://…"
                  aria-label="Link"
                  inputMode="url"
                />
              </div>
              <div className="mt-3">
                <input
                  className={inputCls}
                  value={c.hint}
                  onChange={(e) => setContact(idx, { hint: e.target.value })}
                  onFocus={selectOnFocus}
                  placeholder="Short subtitle (optional)"
                  aria-label="Subtitle"
                />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Tab</label>
                  <select
                    className={inputCls}
                    value={c.modes[0] ?? "business"}
                    onChange={(e) =>
                      setContact(idx, { modes: [e.target.value as ModeId] })
                    }
                  >
                    {draft.tabs.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Icon</label>
                  <select
                    className={inputCls}
                    value={c.icon ?? c.id}
                    onChange={(e) => setContact(idx, { icon: e.target.value })}
                  >
                    {Object.keys(BRAND_ICON_PATHS).map((id) => (
                      <option key={id} value={id}>
                        {id}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addContact}
          className="mt-4 w-full rounded-xl border-2 border-dashed border-line bg-card px-4 py-3.5 font-display text-sm font-semibold text-ink-soft hover:border-lanyard hover:text-lanyard"
        >
          + Add card
        </button>

        {isCustom && (
          <button
            type="button"
            onClick={onReset}
            className="mt-6 w-full rounded-xl border border-line px-4 py-3 text-sm font-semibold text-ink-soft hover:border-red-400 hover:text-red-500"
          >
            Reset to demo profile
          </button>
        )}
      </div>

      {/* Sticky save bar */}
      <div className="fixed inset-x-0 bottom-0 border-t border-line bg-card/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex w-full max-w-md gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-line px-4 py-3.5 font-display text-base font-semibold text-ink-soft hover:border-lanyard"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-[2] rounded-xl bg-lanyard px-4 py-3.5 font-display text-base font-semibold text-white hover:opacity-90"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
