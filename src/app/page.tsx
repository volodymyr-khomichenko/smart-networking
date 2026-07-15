"use client";

import { useEffect, useMemo, useState } from "react";
import ProfileCard from "@/components/ProfileCard";
import ContactCard from "@/components/ContactCard";
import ModeSwitcher from "@/components/ModeSwitcher";
import PinnedBar from "@/components/PinnedBar";
import QRModal from "@/components/QRModal";
import Editor from "@/components/Editor";
import InstallHint from "@/components/InstallHint";
import { Contact, Mode, Profile, profile as demoProfile } from "@/data/profile";
import { clearStoredProfile, loadStoredProfile, storeProfile } from "@/lib/storage";

export default function Home() {
  const [profile, setProfile] = useState<Profile>(demoProfile);
  const [isCustom, setIsCustom] = useState(false);
  const [editing, setEditing] = useState(false);
  const [active, setActive] = useState<Contact | null>(null);
  const [mode, setMode] = useState<Mode["id"]>("all");

  // Load the visitor's own profile from this browser, if they saved one
  useEffect(() => {
    const saved = loadStoredProfile();
    if (saved) {
      setProfile(saved);
      setIsCustom(true);
    }
  }, []);

  const pinned = useMemo(
    () => profile.contacts.filter((c) => c.favorite).slice(0, 5),
    [profile]
  );

  const tabList = useMemo<Mode[]>(
    () => [{ id: "all", label: "All" }, ...profile.tabs],
    [profile]
  );

  const visibleContacts = useMemo(
    () =>
      mode === "all"
        ? profile.contacts
        : profile.contacts.filter((c) => c.modes.includes(mode as never)),
    [mode, profile]
  );

  const handleToggleFavorite = (contact: Contact) => {
    const pinnedCount = profile.contacts.filter((c) => c.favorite).length;
    if (!contact.favorite && pinnedCount >= 5) {
      alert("You can pin up to 5 links.");
      return;
    }
    const next: Profile = {
      ...profile,
      contacts: profile.contacts.map((c) =>
        c.id === contact.id ? { ...c, favorite: !c.favorite } : c
      ),
    };
    setProfile(next);
    setIsCustom(true);
    storeProfile(next);
  };

  const handleSave = (p: Profile) => {
    storeProfile(p);
    setProfile(p);
    setIsCustom(true);
    setEditing(false);
  };

  const handleReset = () => {
    clearStoredProfile();
    setProfile(demoProfile);
    setIsCustom(false);
    setEditing(false);
  };

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 pb-10 pt-6">
      <ProfileCard profile={profile} onEdit={() => setEditing(true)} />

      <PinnedBar contacts={pinned} onSelect={setActive} />

      <ModeSwitcher modes={tabList} active={mode} onChange={setMode} />

      <h2 className="mt-6 mb-3 px-1 text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
        Tap a card to show its QR code
      </h2>

      <div className="flex flex-col gap-3">
        {visibleContacts.map((contact) => (
          <ContactCard
            key={contact.id}
            contact={contact}
            onSelect={setActive}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
        {visibleContacts.length === 0 && (
          <p className="rounded-xl border border-dashed border-line bg-card px-4 py-6 text-center text-sm text-ink-soft">
            No cards in this tab yet. Tap Edit to add some.
          </p>
        )}
      </div>

      <footer className="mt-10 text-center text-xs text-ink-soft">
        Smart Networking — one page, all your links
        <span className="block mt-1">
          © {new Date().getFullYear()}{" "}
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

      {active && (
        <QRModal
          contact={active}
          profile={profile}
          onClose={() => setActive(null)}
        />
      )}

      {!editing && !active && <InstallHint />}

      {editing && (
        <Editor
          initial={profile}
          isCustom={isCustom}
          onSave={handleSave}
          onReset={handleReset}
          onClose={() => setEditing(false)}
        />
      )}
    </main>
  );
}
