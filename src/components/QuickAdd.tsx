"use client";

import { useEffect, useState } from "react";
import { Contact, Tab } from "@/data/profile";
import { BrandIcon, iconForValue } from "@/components/icons";

interface QuickAddProps {
  open: boolean;
  /** When set, the sheet edits this card instead of creating a new one */
  editContact?: Contact | null;
  tabs: Tab[];
  onSubmit: (contact: Contact) => void;
  onClose: () => void;
}

const inputCls =
  "w-full rounded-lg border border-line bg-card px-3 py-2.5 text-sm outline-none transition-colors focus:border-lanyard";

/**
 * Quick "Add a link" sheet, opened from the + button in the profile header —
 * and also the quick "Edit link" sheet, opened by swiping a card left.
 * The card icon is auto-detected from the pasted URL (LinkedIn, GitHub, ...).
 */
export default function QuickAdd({
  open,
  editContact = null,
  tabs,
  onSubmit,
  onClose,
}: QuickAddProps) {
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const [tabId, setTabId] = useState(tabs[0]?.id ?? "business");

  useEffect(() => {
    if (!open) return;
    setLabel(editContact?.label ?? "");
    setValue(editContact?.value ?? "");
    setTabId(editContact?.modes[0] ?? tabs[0]?.id ?? "business");
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
  const detectedIcon = value.trim() ? iconForValue(value.trim()) : "link";
  // While editing, keep the card's existing icon unless the address changed
  const displayIcon =
    isEdit && value.trim() === editContact.value
      ? editContact.icon ?? editContact.id
      : detectedIcon;
  const canSave = label.trim().length > 0 && value.trim().length > 0;

  const save = () => {
    if (!canSave) return;
    const raw = value.trim();
    const isEmail = raw.includes("@") && !raw.startsWith("http");
    const normalized =
      isEmail || raw.startsWith("http") ? raw : `https://${raw}`;
    const valueChanged = !isEdit || raw !== editContact.value;
    onSubmit({
      id: editContact?.id ?? `custom-${Date.now()}`,
      label: label.trim(),
      hint: isEdit
        ? editContact.hint
        : isEmail
          ? "Email me"
          : normalized.replace(/^https?:\/\//, ""),
      type: isEmail ? "email" : "url",
      icon: valueChanged ? detectedIcon : editContact?.icon,
      favorite: editContact?.favorite,
      archived: editContact?.archived,
      modes: [tabId],
      value: isEmail ? raw : normalized,
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isEdit ? "Edit link" : "Add a link"}
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-2xl bg-card p-5 sm:rounded-2xl sm:border sm:border-line"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">
            {isEdit ? "Edit link" : "Add a link"}
          </h2>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-lanyard-soft text-lanyard">
            <BrandIcon id={displayIcon} className="h-4 w-4" />
          </span>
        </div>
        <p className="mt-1 text-xs text-ink-soft">
          {isEdit
            ? "Changes are saved only in this browser."
            : "The icon is picked automatically from the address. Saved only in this browser."}
        </p>

        <div className="mt-4 space-y-3">
          <div>
            <label
              htmlFor="qa-label"
              className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-soft"
            >
              Name
            </label>
            <input
              id="qa-label"
              className={inputCls}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="My new project"
              autoFocus={!isEdit}
            />
          </div>
          <div>
            <label
              htmlFor="qa-value"
              className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-soft"
            >
              Link or email
            </label>
            <input
              id="qa-value"
              className={inputCls}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="https://…"
              inputMode="url"
            />
          </div>
          <div>
            <label
              htmlFor="qa-tab"
              className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-soft"
            >
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
            {isEdit ? "Save" : "Add link"}
          </button>
        </div>
      </div>
    </div>
  );
}
