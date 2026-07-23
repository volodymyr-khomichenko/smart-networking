import { Profile } from "@/data/profile";

interface ProfileCardProps {
  profile: Profile;
  onEdit?: () => void;
  onAdd?: () => void;
}

export default function ProfileCard({ profile, onEdit, onAdd }: ProfileCardProps) {
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
            aria-label="Add a link"
            title="Add a link"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-lanyard text-white shadow-[0_4px_12px_rgba(47,82,224,0.35)] transition-transform hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lanyard"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-lanyard text-white font-display text-xl font-semibold tracking-wide">
          {profile.initials}
        </div>
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-semibold leading-tight tracking-tight">
            {profile.name}
          </h1>
          <p className="text-sm font-medium text-lanyard">{profile.title}</p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-ink-soft">
        {profile.bio}
      </p>
    </section>
  );
}
