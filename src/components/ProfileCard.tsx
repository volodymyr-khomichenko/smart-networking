"use client";

import { useRef, useState } from "react";
import { Profile } from "@/data/profile";
import { readProfilePhoto } from "@/lib/card";

interface ProfileCardProps {
  profile: Profile;
  onEdit?: () => void;
  onAdd?: () => void;
  onCopy?: () => void;
  onSaveContact?: () => void;
  onPhoto?: (photo: string) => void;
  onExport?: () => void;
  onImport?: (file: File) => void;
  importError?: string;
}

export default function ProfileCard({
  profile,
  onEdit,
  onAdd,
  onCopy,
  onSaveContact,
  onPhoto,
  onExport,
  onImport,
  importError,
}: ProfileCardProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const [photoError, setPhotoError] = useState("");
  return (
    <section
      aria-label="Profile"
      className="relative rounded-2xl bg-card border border-line shadow-[0_10px_30px_rgba(20,22,26,0.08)] px-6 pt-9 pb-6"
    >
      {/* Badge hole punch — a nod to a physical conference badge */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-3 h-2 w-12 -translate-x-1/2 rounded-full bg-paper border border-line"
      />

      <div className="absolute right-4 top-4 flex items-center gap-2">
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            aria-label="Edit profile"
            className="flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-xs font-semibold text-ink-soft transition-colors hover:border-lanyard hover:text-lanyard focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lanyard"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-3.5 w-3.5">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
            </svg>
            Edit
          </button>
        )}
        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            aria-label="Add a card"
            title="Add a card"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-lanyard text-white shadow-[0_4px_12px_rgba(47,82,224,0.35)] transition-transform hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lanyard"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 shrink-0">
          <button
            type="button"
            onClick={() => photoRef.current?.click()}
            aria-label={profile.photo ? "Change photo" : "Add photo"}
            className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-lanyard text-white font-display text-xl font-semibold tracking-wide focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lanyard"
          >
            {profile.photo ? (
              <img src={profile.photo} alt="" className="h-full w-full object-cover" />
            ) : (
              profile.initials
            )}
          </button>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-white text-lanyard shadow-[0_1px_4px_rgba(20,22,26,0.25)]"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3">
              <path d="M9 3 7.2 5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-3.2L15 3H9zm3 12.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4z" />
            </svg>
          </span>
        </div>
        <input
          ref={photoRef}
          type="file"
          accept="image/jpeg,image/png,.jpg,.jpeg,.png"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (!file || !onPhoto) return;
            readProfilePhoto(file)
              .then((photo) => {
                setPhotoError("");
                onPhoto(photo);
              })
              .catch(() => setPhotoError("Use a JPEG or PNG under 1 MB."));
          }}
        />
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-semibold leading-tight tracking-tight">
            {profile.name}
          </h1>
          <p className="text-sm font-medium text-lanyard">{profile.title}</p>
          {profile.company ? (
            <p className="truncate text-sm text-ink-soft">{profile.company}</p>
          ) : null}
        </div>
      </div>
      {photoError ? (
        <p className="mt-2 text-xs text-red-500">{photoError}</p>
      ) : null}

      <p className="mt-4 text-sm leading-relaxed text-ink-soft">
        {profile.bio}
      </p>

      {onSaveContact && (
        <button
          type="button"
          onClick={onSaveContact}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-lanyard px-4 py-3 font-display text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lanyard"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
          Share contact
        </button>
      )}

      {onCopy && (
        <button
          type="button"
          onClick={onCopy}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-paper px-4 py-3 font-display text-sm font-semibold text-ink transition-colors hover:border-lanyard hover:text-lanyard focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lanyard"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
          </svg>
          Copy for forms
        </button>
      )}

      {(onExport || onImport) && (
        <div className="mt-3 flex items-center justify-center gap-3 text-xs font-semibold text-ink-soft">
          {onExport && (
            <button
              type="button"
              onClick={onExport}
              className="underline decoration-line underline-offset-2 hover:text-lanyard focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lanyard"
            >
              Export card
            </button>
          )}
          {onImport && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="underline decoration-line underline-offset-2 hover:text-lanyard focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lanyard"
            >
              Import card
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && onImport) onImport(file);
              e.target.value = "";
            }}
          />
        </div>
      )}
      {importError ? (
        <p className="mt-2 text-center text-xs text-red-500">{importError}</p>
      ) : null}
    </section>
  );
}
