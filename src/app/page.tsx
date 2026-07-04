"use client";

import { useState } from "react";
import ProfileCard from "@/components/ProfileCard";
import ContactCard from "@/components/ContactCard";
import QRModal from "@/components/QRModal";
import { Contact, profile } from "@/data/profile";

export default function Home() {
  const [active, setActive] = useState<Contact | null>(null);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 pb-10 pt-6">
      <ProfileCard profile={profile} />

      <h2 className="mt-8 mb-3 px-1 text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
        Tap a card to show its QR code
      </h2>

      <div className="flex flex-col gap-3">
        {profile.contacts.map((contact) => (
          <ContactCard key={contact.id} contact={contact} onSelect={setActive} />
        ))}
      </div>

      <footer className="mt-10 text-center text-xs text-ink-soft">
        Smart Networking — one page, all your links
      </footer>

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
