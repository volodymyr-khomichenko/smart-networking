import { Profile } from "@/data/profile";

export default function ProfileCard({ profile }: { profile: Profile }) {
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
