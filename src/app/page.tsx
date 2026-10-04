"use client";

import { useEffect, useMemo, useState } from "react";
import { Contact, Mode, Profile, profile as demoProfile } from "@/data/profile";
import { saveContactCard } from "@/lib/card";
import { clearStoredProfile, loadStoredProfile, parseImportedProfile, profileToFile, storeProfile } from "@/lib/storage";
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

export default function Home() {
  const [profile, setProfile] = useState<Profile>(demoProfile);
  const [isCustom, setIsCustom] = useState(false);
  const [mode, setMode] = useState<Mode["id"]>("all");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Contact | null>(null);
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [editingCard, setEditingCard] = useState<Contact | null>(null);
  const [copying, setCopying] = useState(false);
  const [importError, setImportError] = useState("");

  useEffect(() => {
    const stored = loadStoredProfile();
    if (stored) {
      setProfile(stored);
      setIsCustom(true);
    }
  }, []);

  const tabList: Mode[] = useMemo(
    () => [{ id: "all", label: "All" }, ...profile.tabs.map((t) => ({ id: t.id, label: t.label }))],
    [profile.tabs]
  );

  const visibleContacts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (mode === "all" ? profile.contacts : profile.contacts.filter((c) => c.modes.includes(mode)))
      .filter((c) => !c.archived)
      .filter((c) => !q || `${c.label} ${c.hint} ${c.value}`.toLowerCase().includes(q));
  }, [profile.contacts, mode, query]);

  const archivedContacts = useMemo(() => profile.contacts.filter((c) => c.archived), [profile.contacts]);
  const pinned = useMemo(() => profile.contacts.filter((c) => c.favorite && !c.archived).slice(0, MAX_FAVORITES), [profile.contacts]);

  const persist = (next: Profile) => {
    setProfile(next);
    storeProfile(next);
    setIsCustom(true);
  };

  const patchContact = (id: string, patch: Partial<Contact>) =>
    persist({ ...profile, contacts: profile.contacts.map((c) => (c.id === id ? { ...c, ...patch } : c)) });

  const handleToggleFavorite = (contact: Contact) => {
    const count = profile.contacts.filter((c) => c.favorite && !c.archived).length;
    if (!contact.favorite && count >= MAX_FAVORITES) return;
    patchContact(contact.id, { favorite: !contact.favorite });
  };

  const handleArchive = (contact: Contact) => patchContact(contact.id, { archived: true });
  const handleRestore = (contact: Contact) => patchContact(contact.id, { archived: false });

  const handleQuickSubmit = (contact: Contact) => {
    if (editingCard) {
      persist({ ...profile, contacts: profile.contacts.map((c) => (c.id === contact.id ? contact : c)) });
      setEditingCard(null);
    } else {
      persist({ ...profile, contacts: [contact, ...profile.contacts] });
      setMode("all");
    }
  };

  const handleSave = (next: Profile) => {
    persist(next);
    setEditing(false);
  };

  const handleReset = () => {
    clearStoredProfile();
    setProfile(demoProfile);
    setIsCustom(false);
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
      <ProfileCard profile={profile} onEdit={() => setEditing(true)} onAdd={() => setAdding(true)} onCopy={() => setCopying(true)} onSaveContact={() => setActive(saveContactCard())} onExport={handleExport} onImport={handleImport} importError={importError} />
      <PinnedBar contacts={pinned} onSelect={setActive} />
      <ModeSwitcher modes={tabList} active={mode} onChange={setMode} />
      <label className="mt-4 flex items-center gap-2 rounded-xl border border-line bg-card px-3 py-2.5">
        <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Find a link" aria-label="Find a link" className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-soft" />
      </label>
      <h2 className="mt-6 mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-soft">{query.trim() ? `${visibleContacts.length} matching` : "Tap a card to show its QR code"}</h2>
      <div className="space-y-3">
        {visibleContacts.map((contact) => (
          <ContactCard key={contact.id} contact={contact} onSelect={setActive} onToggleFavorite={handleToggleFavorite} onArchive={handleArchive} onEdit={setEditingCard} />
        ))}
        {query.trim() && visibleContacts.length === 0 && (
          <p className="rounded-xl border border-line bg-card px-4 py-6 text-center text-sm text-ink-soft">No links match “{query.trim()}”.</p>
        )}
      </div>
      <ArchivedSection contacts={archivedContacts} onRestore={handleRestore} />
      <footer className="mt-10 text-center text-xs text-ink-soft">
        Smart Networking — one page, all your links
        <span className="block mt-1">© {new Date().getFullYear()} Created by <a href="https://khomichenko.com/" target="_blank" rel="noopener noreferrer" className="underline decoration-line underline-offset-2 hover:text-lanyard">Volodymyr Khomichenko</a></span>
        {isCustom && <span className="block mt-1">Showing your local profile</span>}
      </footer>
      {!editing && !active && !adding && !editingCard && !copying && <InstallHint />}
      <QuickAdd open={adding || editingCard !== null} editContact={editingCard} tabs={profile.tabs} onSubmit={handleQuickSubmit} onClose={() => { setAdding(false); setEditingCard(null); }} />
      {copying && <CopySheet profile={profile} onClose={() => setCopying(false)} onEdit={() => { setCopying(false); setEditing(true); }} />}
      {editing && <Editor initial={profile} isCustom={isCustom} onSave={handleSave} onReset={handleReset} onClose={() => setEditing(false)} />}
      {active && <QRModal contact={active} profile={profile} onClose={() => setActive(null)} />}
    </main>
  );
}
