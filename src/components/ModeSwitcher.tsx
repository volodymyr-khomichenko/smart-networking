import { Mode } from "@/data/profile";

interface ModeSwitcherProps {
  modes: Mode[];
  active: Mode["id"];
  onChange: (id: Mode["id"]) => void;
}

export default function ModeSwitcher({
  modes,
  active,
  onChange,
}: ModeSwitcherProps) {
  return (
    <div
      role="tablist"
      aria-label="Profile mode"
      className="mt-6 flex gap-1.5 rounded-xl border border-line bg-card p-1.5"
    >
      {modes.map((m) => {
        const isActive = m.id === active;
        return (
          <button
            key={m.id}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onChange(m.id)}
            className={`flex-1 rounded-lg px-2 py-2.5 font-display text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lanyard ${
              isActive
                ? "bg-lanyard text-white"
                : "text-ink-soft hover:bg-lanyard-soft hover:text-ink"
            }`}
          >
            {m.label}
          </button>
        );
      })}
    </div>
  );
}
