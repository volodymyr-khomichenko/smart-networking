"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Contact,
  Mode,
  Profile,
  profile as demoProfile,
} from "@/data/profile";
import {
  clearStoredProfile,
  loadProfileBook,
  parseImportedProfile,
  ProfileBook,
  profileToFile,
  storeProfileBook,
} from "@/lib/storage";
import { saveContactCard } from "@/lib/card";
import ProfileCard from "@/components/ProfileCard";
import PinnedBar from "@/components/PinnedBar";
import ModeSwitcher from "@/components/ModeSwitcher";
import ContactCard from "@/components/ContactCard";
import ArchivedSection from "@/components/ArchivedSection";
import QRModal from "@/components/QRModal";
import Editor from "@/components/Editor";
import InstallHint from "@/components/InstallHint";
import QuickAdd from "@/components/QuickAdd";
import CopySheet from "@/components/CopySheet";

const MAX_FAVORITES = 5;

function demoBook(): ProfileBook {
  return {
    activeId: "default",
    profiles: [
      {
        id: "default",
        label: "Default",
        isDefault: true,
        profile: demoProfile,
      },
    ],
  };
}

export default function Home() {
  const [book, setBook] = useState<ProfileBook>(demoBook);
  const [isCustom, setIsCustom] = useState(false);
  const [mode, setMode] = useState<Mode["id"]>("all");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Contact | null>(null);
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [editingCard, setEditingCard] = useState<Contact | null>(null);
  const [copying, setCopying] = useState(false);
  const [importError, setImportError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [drafting, setDrafting] = useState(false);
  const [draftName, setDraftName] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = loadProfileBook();
    if (stored) {
      setBook(stored);
      setIsCustom(true);
    }
  }, []);

  const current =
    book.profiles.find((slot) => slot.id === book.activeId) ?? book.profiles[0];
  const profile = current.profile;

  const write = (next: ProfileBook) => {
    setBook(next);
    storeProfileBook(next);
    setIsCustom(true);
  };

  const closeLayers = () => {
    setActive(null);
    setEditing(false);
    setAdding(false);
    setEditingCard(null);
    setCopying(false);
    setMode("all");
    setQuery("");
  };

  const tabList: Mode[] = useMemo(
    () => [
      { id: "all", label: "All" },
      ...profile.tabs.map((t) => ({ id: t.id, label: t.label })),
    ],
    [profile.tabs]
  );

  const visibleContacts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (
      mode === "all"
        ? profile.contacts
        : profile.contacts.filter((c) => c.modes.includes(mode))
    )
      .filter((c) => !c.archived)
      .filter(
        (c) => !q || `${c.label} ${c.hint} ${c.value}`.toLowerCase().includes(q)
      );
  }, [profile.contacts, mode, query]);

  const archivedContacts = useMemo(
    () => profile.contacts.filter((c) => c.archived),
    [profile.contacts]
  );

  const pinned = useMemo(
    () =>
      profile.contacts
        .filter((c) => c.favorite && !c.archived)
        .slice(0, MAX_FAVORITES),
    [profile.contacts]
  );

  const persist = (next: Profile) => {
    write({
      ...book,
      profiles: book.profiles.map((slot) =>
        slot.id === current.id ? { ...slot, profile: next } : slot
      ),
    });
  };

  const switchProfile = (id: string) => {
    if (id === current.id) return;
    write({ ...book, activeId: id });
    closeLayers();
  };

  const commitDraft = () => {
    const label = draftName.trim();
    if (!label) return;
    const source =
      book.profiles.find((slot) => slot.isDefault)?.profile ?? profile;
    const id = `p-${Date.now()}`;
    write({
      activeId: id,
      profiles: [
        ...book.profiles,
        {
          id,
          label,
          isDefault: false,
          profile: JSON.parse(JSON.stringify(source)) as Profile,
        },
      ],
    });
    setDraftName("");
    setDrafting(false);
    setMenuOpen(false);
    closeLayers();
  };

  const deleteProfile = (id: string) => {
    const slot = book.profiles.find((item) => item.id === id);
    if (!slot || slot.isDefault) return;
    if (!window.confirm("Delete this profile? The default profile stays.")) return;
    const profiles = book.profiles.filter((item) => item.id !== id);
    write({
      activeId: current.id === id ? "default" : current.id,
      profiles,
    });
    setMenuOpen(false);
    setDrafting(false);
    closeLayers();
  };

  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
        setDrafting(false);
        setDraftName("");
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [menuOpen]);

  const patchContact = (id: string, patch: Partial<Contact>) =>
    persist({
      ...profile,
      contacts: profile.contacts.map((c) =>
        c.id === id ? { ...c, ...patch } : c
      ),
    });

  const handleToggleFavorite = (contact: Contact) => {
    const count = profile.contacts.filter(
      (c) => c.favorite && !c.archived
    ).length;
    if (!contact.favorite && count >= MAX_FAVORITES) return;
    patchContact(contact.id, { favorite: !contact.favorite });
  };

  const handleArchive = (contact: Contact) =>
    patchContact(contact.id, { archived: true });

  const handleRestore = (contact: Contact) =>
    patchContact(contact.id, { archived: false });

  const handleQuickSubmit = (contact: Contact) => {
    if (editingCard) {
      persist({
        ...profile,
        contacts: profile.contacts.map((c) =>
          c.id === contact.id ? contact : c
        ),
      });
      setEditingCard(null);
    } else {
      // New cards go to the top of the list
      persist({ ...profile, contacts: [contact, ...profile.contacts] });
      setMode("all");
    }
  };

  const handleSave = (next: Profile) => {
    persist(next);
    setEditing(false);
  };

  const handleReset = () => {
    const demo = JSON.parse(JSON.stringify(demoProfile)) as Profile;
    const onlyDefault = book.profiles.length === 1 && current.isDefault;
    if (onlyDefault) {
      clearStoredProfile();
      setBook(demoBook());
      setIsCustom(false);
    } else {
      write({
        ...book,
        profiles: book.profiles.map((slot) =>
          slot.id === current.id ? { ...slot, profile: demo } : slot
        ),
      });
    }
    setEditing(false);
    setMode("all");
    setQuery("");
  };

  const handleExport = () => {
    const blob = new Blob([profileToFile(profile)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "smart-networking-card.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (file: File) => {
    const next = parseImportedProfile(await file.text());
    if (!next) {
      setImportError("That file is not a Smart Networking card.");
      return;
    }
    setImportError("");
    persist(next);
  };

  return (
    <main className="mx-auto min-h-dvh w-full max-w-md px-4 pb-24 pt-6">
      <div ref={menuRef} className="relative mb-4">
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={menuOpen}
          aria-label="Profile"
          onClick={() => {
            setMenuOpen((open) => !open);
            setDrafting(false);
            setDraftName("");
          }}
          className="flex w-full items-center justify-between rounded-xl border border-line bg-card px-3 py-2.5 text-left font-display text-sm font-semibold text-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lanyard"
        >
          <span className="min-w-0 truncate">{current.label}</span>
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4 shrink-0 text-ink-soft">
            <path d="M7 10l5 5 5-5H7z" />
          </svg>
        </button>
        {menuOpen && (
          <div
            role="listbox"
            aria-label="Profiles"
            className="absolute z-30 mt-1 w-full overflow-hidden rounded-xl border border-line bg-card shadow-[0_10px_30px_rgba(20,22,26,0.08)]"
          >
            {book.profiles.map((slot) => (
              <div key={slot.id} className="flex items-center border-b border-line last:border-b-0">
                <button
                  type="button"
                  role="option"
                  aria-selected={slot.id === current.id}
                  onClick={() => {
                    switchProfile(slot.id);
                    setMenuOpen(false);
                    setDrafting(false);
                  }}
                  className={`min-w-0 flex-1 px-3 py-2.5 text-left text-sm font-semibold ${
                    slot.id === current.id ? "text-lanyard" : "text-ink"
                  }`}
                >
                  {slot.label}
                </button>
                {!slot.isDefault && (
                  <button
                    type="button"
                    aria-label={`Delete ${slot.label}`}
                    onClick={() => deleteProfile(slot.id)}
                    className="shrink-0 px-3 text-xs font-semibold text-ink-soft underline decoration-line underline-offset-2 hover:text-lanyard"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
            {drafting ? (
              <input
                autoFocus
                aria-label="New profile name"
                value={draftName}
                placeholder="Profile name"
                onChange={(e) => setDraftName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    commitDraft();
                  } else if (e.key === "Escape") {
                    setDrafting(false);
                    setDraftName("");
                  }
                }}
                className="w-full border-t border-line bg-card px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink-soft"
              />
            ) : (
              <button
                type="button"
                onClick={() => {
                  setDrafting(true);
                  setDraftName("");
                }}
                className="w-full border-t border-line px-3 py-2.5 text-left text-sm font-semibold text-lanyard"
              >
                Create new profile
              </button>
            )}
          </div>
        )}
      </div>
      <ProfileCard
        profile={profile}
        onEdit={() => setEditing(true)}
        onAdd={() => setAdding(true)}
        onCopy={() => setCopying(true)}
        onSaveContact={() => setActive(saveContactCard())}
        onPhoto={(photo) => persist({ ...profile, photo })}
      />

      <PinnedBar contacts={pinned} onSelect={setActive} />

      <ModeSwitcher modes={tabList} active={mode} onChange={setMode} />

      <label className="mt-4 flex items-center gap-2 rounded-xl border border-line bg-card px-3 py-2.5">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Find a link"
          aria-label="Find a link"
          className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-soft"
        />
      </label>

      <h2 className="mt-6 mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-soft">
        Tap a card to show its QR code
      </h2>

      <div className="space-y-3">
        {visibleContacts.map((contact) => (
          <ContactCard
            key={contact.id}
            contact={contact}
            onSelect={setActive}
            onToggleFavorite={handleToggleFavorite}
            onArchive={handleArchive}
            onEdit={setEditingCard}
          />
        ))}
        {query.trim() && visibleContacts.length === 0 && (
          <p className="rounded-xl border border-line bg-card px-4 py-6 text-center text-sm text-ink-soft">
            No links match.
          </p>
        )}
      </div>

      <ArchivedSection
        contacts={archivedContacts}
        onRestore={handleRestore}
      />

      <footer className="mt-10 text-center text-xs text-ink-soft">
        Smart Networking — one page, all your links
        <span className="block mt-1">
          © {new Date().getFullYear()} Created by{" "}
          <a
            href="https://khomichenko.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-line underline-offset-2 hover:text-lanyard"
          >
            Volodymyr Khomichenko
          </a>
        </span>
        {isCustom && <span className="block mt-1">Showing your local profile</span>}
      </footer>

      {!editing && !active && !adding && !editingCard && !copying && <InstallHint />}

      <QuickAdd
        open={adding || editingCard !== null}
        editContact={editingCard}
        tabs={profile.tabs}
        onSubmit={handleQuickSubmit}
        onClose={() => {
          setAdding(false);
          setEditingCard(null);
        }}
      />

      {copying && (
        <CopySheet
          profile={profile}
          onClose={() => setCopying(false)}
          onEdit={() => {
            setCopying(false);
            setEditing(true);
          }}
        />
      )}

      {editing && (
        <Editor
          initial={profile}
          isCustom={isCustom}
          onSave={handleSave}
          onReset={handleReset}
          onClose={() => setEditing(false)}
          onExport={handleExport}
          onImport={handleImport}
          importError={importError}
        />
      )}

      {active && (
        <QRModal
          contact={active}
          profile={profile}
          onClose={() => setActive(null)}
        />
      )}
    </main>
  );
}
