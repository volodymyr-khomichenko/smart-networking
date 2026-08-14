"use client";

import { useEffect, useState } from "react";
import { Contact, ContactType, Tab } from "@/data/profile";
import { BRAND_ICON_PATHS, BrandIcon, iconForValue } from "@/components/icons";

interface QuickAddProps {
  open: boolean;
  /** When set, the sheet edits this card instead of creating a new one */
  editContact?: Contact | null;
  tabs: Tab[];
  onSubmit: (contact: Contact) => void;
  onClose: () => void;
}

type QuickType = Extract<ContactType, "url" | "email" | "phone">;

const inputCls =
  "w-full rounded-lg border border-line bg-card px-3 py-2.5 text-base outline-none transition-colors focus:border-lanyard";
const labelCls =
  "mb-1 block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-soft";

const ICON_OPTIONS = Object.keys(BRAND_ICON_PATHS);

const TYPE_META: Record<
  QuickType,
  { label: string; placeholder: string; inputMode: "url" | "email" | "tel"; defaultIcon: string }
> = {
  url: { label: "Link", placeholder: "https://…", inputMode: "url", defaultIcon: "link" },
  email: { label: "Email", placeholder: "you@example.com", inputMode: "email", defaultIcon: "email" },
  phone: { label: "Phone", placeholder: "+1 555 123 4567", inputMode: "tel", defaultIcon: "phone" },
};

/**
 * Quick "Add a card" sheet (the + button in the profile header) and the
 * quick "Edit card" sheet (swipe a card left). Supports links, emails and
 * phone numbers; the icon is auto-detected from the address but can be
 * overridden manually.
 */
export default function QuickAdd({
  open,
  editContact = null,
  tabs,
  onSubmit,
  onClose,
}: QuickAddProps) {
  const [type, setType] = useState<QuickType>("url");
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const [hint, setHint] = useState("");
  const [tabId, setTabId] = useState(tabs[0]?.id ?? "business");
  const [icon, setIcon] = useState<string>("link");
  const [iconTouched, setIconTouched] = useState(false);

  useEffect(() => {
    if (!open) return;
    const initialType: QuickType =
      editContact && editContact.type !== "vcard"
        ? (editContact.type as QuickType)
        : "url";
    setType(initialType);
    setLabel(editContact?.label ?? "");
    setValue(editContact?.value ?? "");
    setHint(editContact?.hint ?? "");
    setTabId(editContact?.modes[0] ?? tabs[0]?.id ?? "business");
    setIcon(
      editContact?.icon ?? editContact?.id ?? TYPE_META[initialType].defaultIcon
    );
    // While editing, respect the card's existing icon until the user changes it
    setIconTouched(editContact !== null);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, editContact, tabs, onClose]);

  if (!open) return null;

  const isEdit = editContact !== null;
  const canSave = label.trim().length > 0 && value.trim().length > 0;

  const autoIcon = (t: QuickType, v: string): string =>
    t === "url" && v.trim() ? iconForValue(v.trim()) : TYPE_META[t].defaultIcon;

  const changeType = (t: QuickType) => {
    setType(t);
    if (!iconTouched) setIcon(autoIcon(t, value));
  };

  const changeValue = (v: string) => {
    setValue(v);
    if (!iconTouched) setIcon(autoIcon(type, v));
  };

  const save = () => {
    if (!canSave) return;
    const raw = value.trim();
    const normalized =
      type === "url" && !raw.startsWith("http") ? `https://${raw}` : raw;
    const defaultHint =
      type === "email"
        ? "Email me"
        : type === "phone"
          ? "Call or text me"
          : normalized.replace(/^https?:\/\//, "");
    onSubmit({
      id: editContact?.id ?? `custom-${Date.now()}`,
      label: label.trim(),
      hint: hint.trim() || defaultHint,
      type,
      icon,
      favorite: editContact?.favorite,
      archived: editContact?.archived,
      modes: [tabId],
      value: normalized,
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isEdit ? "Edit card" : "Add a card"}
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 sm:items-center"
      onClick={onClose}
    >
      <div
        className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-card p-5 sm:rounded-2xl sm:border sm:border-line"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">
            {isEdit ? "Edit card" : "Add a card"}
          </h2>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-lanyard-soft text-lanyard">
            <BrandIcon id={icon} className="h-4 w-4" />
          </span>
        </div>
        <p className="mt-1 text-xs text-ink-soft">
          Saved only in this browser — nothing is uploaded anywhere.
        </p>

        {/* Card type */}
        <div
          role="tablist"
          aria-label="Card type"
          className="mt-4 flex gap-1.5 rounded-xl border border-line bg-card p-1.5"
        >
          {(Object.keys(TYPE_META) as QuickType[]).map((t) => (
            <button
              key={t}
              role="tab"
              type="button"
              aria-selected={type === t}
              onClick={() => changeType(t)}
              className={`flex-1 rounded-lg px-2 py-2 font-display text-sm font-semibold transition-colors ${
                type === t
                  ? "bg-lanyard text-white"
                  : "text-ink-soft hover:bg-lanyard-soft hover:text-ink"
              }`}
            >
              {TYPE_META[t].label}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <label htmlFor="qa-label" className={labelCls}>
              Name
            </label>
            <input
              id="qa-label"
              className={inputCls}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder={
                type === "phone"
                  ? "Mobile"
                  : type === "email"
                    ? "Work email"
                    : "My new project"
              }
              autoFocus={!isEdit}
            />
          </div>
          <div>
            <label htmlFor="qa-value" className={labelCls}>
              {TYPE_META[type].label}
            </label>
            <input
              id="qa-value"
              className={inputCls}
              value={value}
              onChange={(e) => changeValue(e.target.value)}
              placeholder={TYPE_META[type].placeholder}
              inputMode={TYPE_META[type].inputMode}
            />
          </div>
          <div>
            <label htmlFor="qa-hint" className={labelCls}>
              Description (optional)
            </label>
            <input
              id="qa-hint"
              className={inputCls}
              value={hint}
              onChange={(e) => setHint(e.target.value)}
              placeholder="Short line shown under the name"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="qa-tab" className={labelCls}>
                Tab
              </label>
              <select
                id="qa-tab"
                className={inputCls}
                value={tabId}
                onChange={(e) => setTabId(e.target.value as Tab["id"])}
              >
                {tabs.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="qa-icon" className={labelCls}>
                Icon
              </label>
              <select
                id="qa-icon"
                className={inputCls}
                value={icon}
                onChange={(e) => {
                  setIcon(e.target.value);
                  setIconTouched(true);
                }}
              >
                {ICON_OPTIONS.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-line px-4 py-3 font-display text-sm font-semibold text-ink-soft transition-colors hover:border-ink hover:text-ink"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            disabled={!canSave}
            className="flex-[2] rounded-xl bg-lanyard px-4 py-3 font-display text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {isEdit ? "Save" : "Add card"}
          </button>
        </div>
      </div>
    </div>
  );
}
