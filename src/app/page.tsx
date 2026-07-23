"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Contact,
  Mode,
  Profile,
  profile as demoProfile,
} from "@/data/profile";
import {
  clearStoredProfile,
  loadStoredProfile,
  storeProfile,
} from "@/lib/storage";
import ProfileCard from "@/components/ProfileCard";
import PinnedBar from "@/components/PinnedBar";
import ModeSwitcher from "@/components/ModeSwitcher";
import ContactCard from "@/components/ContactCard";
import ArchivedSection from "@/components/ArchivedSection";
import QRModal from "@/components/QRModal";
import Editor from "@/components/Editor";
import InstallHint from "@/components/InstallHint";
import QuickAdd from "@/components/QuickAdd";

const MAX_FAVORITES = 5;

export default function Home() {
  const [profile, setProfile] = useState<Profile>(demoProfile);
  const [isCustom, setIsCustom] = useState(false);
  const [mode, setMode] = useState<Mode["id"]>("all");
  const [active, setActive] = useState<Contact | null>(null);
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [editingCard, setEditingCard] = useState<Contact | null>(null);

  // Load a locally saved profile (if the visitor made the card theirs)
  useEffect(() => {
    const stored = loadStoredProfile();
    if (stored) {
      setProfile(stored);
      setIsCustom(true);
    }
  }, []);

  const tabList: Mode[] = useMemo(
    () => [
      { id: "all", label: "All" },
      ...profile.tabs.map((t) => ({ id: t.id, label: t.label })),
    ],
    [profile.tabs]
  );

  const visibleContacts = useMemo(
    () =>
      (mode === "all"
        ? profile.contacts
        : profile.contacts.filter((c) => c.modes.includes(mode))
      ).filter((c) => !c.archived),
    [profile.contacts, mode]
  );

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
    setProfile(next);
    storeProfile(next);
    setIsCustom(true);
  };

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
      persist({ ...profile, contacts: [...profile.contacts, contact] });
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
  };

  return (
    <main className="mx-auto min-h-dvh w-full max-w-md px-4 pb-24 pt-6">
      <ProfileCard
        profile={profile}
        onEdit={() => setEditing(true)}
        onAdd={() => setAdding(true)}
      />

      <PinnedBar contacts={pinned} onSelect={setActive} />

      <ModeSwitcher modes={tabList} active={mode} onChange={setMode} />

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

      {!editing && !active && !adding && !editingCard && <InstallHint />}

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

      {editing && (
        <Editor
          initial={profile}
          isCustom={isCustom}
          onSave={handleSave}
          onReset={handleReset}
          onClose={() => setEditing(false)}
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
