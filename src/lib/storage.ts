// ---------------------------------------------------------------------------
// Local profile storage.
// A visitor can edit the demo profile and keep their own version — it is
// saved only in their browser (localStorage), never sent anywhere.
// ---------------------------------------------------------------------------

import { DEFAULT_TABS, Profile, splitName } from "@/data/profile";

const KEY = "smart-networking-profile-v1";
const DEFAULT_ID = "default";

export interface SavedProfile {
  id: string;
  label: string;
  isDefault: boolean;
  profile: Profile;
}

export interface ProfileBook {
  activeId: string;
  profiles: SavedProfile[];
}

function normalize(profile: Profile): Profile {
  if (!Array.isArray(profile.tabs) || profile.tabs.length === 0) {
    profile.tabs = JSON.parse(JSON.stringify(DEFAULT_TABS));
  }
  if (typeof profile.firstName !== "string" || typeof profile.lastName !== "string") {
    const split = splitName(profile.name || "");
    if (typeof profile.firstName !== "string") profile.firstName = split.firstName;
    if (typeof profile.lastName !== "string") profile.lastName = split.lastName;
  }
  if (typeof profile.company !== "string") profile.company = "";
  if (typeof profile.photo !== "string" || !profile.photo.startsWith("data:image/")) {
    delete profile.photo;
  }
  const share = profile.share;
  if (
    !share ||
    !Array.isArray(share.fields) ||
    !Array.isArray(share.contactIds)
  ) {
    delete profile.share;
  }
  if (!Array.isArray(profile.contacts)) profile.contacts = [];
  return profile;
}

function freshBook(profile: Profile): ProfileBook {
  return {
    activeId: DEFAULT_ID,
    profiles: [
      { id: DEFAULT_ID, label: "Default", isDefault: true, profile },
    ],
  };
}

function asSlot(raw: unknown, fallbackDefault: boolean): SavedProfile | null {
  if (!raw || typeof raw !== "object") return null;
  const slot = raw as Partial<SavedProfile>;
  if (!slot.profile || typeof slot.profile !== "object") return null;
  const id = typeof slot.id === "string" && slot.id.trim() ? slot.id : DEFAULT_ID;
  const label = typeof slot.label === "string" && slot.label.trim() ? slot.label.trim() : "Profile";
  return {
    id,
    label,
    isDefault: fallbackDefault || slot.isDefault === true || id === DEFAULT_ID,
    profile: normalize(slot.profile as Profile),
  };
}

export function loadProfileBook(): ProfileBook | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || typeof data !== "object") return null;

    if (data.version === 2 && Array.isArray(data.profiles)) {
      const profiles = (data.profiles as unknown[])
        .map((slot) => asSlot(slot, false))
        .filter((slot): slot is SavedProfile => slot !== null);
      if (profiles.length === 0) return null;
      const defaults = profiles.filter((slot) => slot.isDefault);
      const defaultSlot = defaults[0] ?? profiles[0];
      const previousDefaultId = defaultSlot.id;
      defaultSlot.isDefault = true;
      defaultSlot.id = DEFAULT_ID;
      for (const slot of profiles) {
        if (slot !== defaultSlot) slot.isDefault = false;
      }
      const wanted = data.activeId === previousDefaultId ? DEFAULT_ID : data.activeId;
      const activeId = profiles.some((slot) => slot.id === wanted) ? wanted : DEFAULT_ID;
      return { activeId, profiles };
    }

    if (data.profile) {
      return freshBook(normalize(data.profile as Profile));
    }
    return null;
  } catch {
    return null;
  }
}

export function storeProfileBook(book: ProfileBook): void {
  try {
    localStorage.setItem(KEY, JSON.stringify({ version: 2, ...book }));
  } catch {
    /* storage may be unavailable (private mode) — editing still works in memory */
  }
}

export function loadStoredProfile(): Profile | null {
  return loadProfileBook()?.profiles.find((slot) => slot.id === loadProfileBook()?.activeId)?.profile ?? null;
}

export function storeProfile(profile: Profile): void {
  const book = loadProfileBook() ?? freshBook(profile);
  const active = book.profiles.find((slot) => slot.id === book.activeId) ?? book.profiles[0];
  active.profile = profile;
  storeProfileBook(book);
}

export function clearStoredProfile(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

export function profileToFile(profile: Profile): string {
  return JSON.stringify({ version: 1, profile }, null, 2);
}

/** Accepts the export file, or a bare profile object. Returns null if the shape is wrong. */
export function parseImportedProfile(raw: string): Profile | null {
  try {
    const data = JSON.parse(raw);
    const profile = (data && data.profile) || data;
    if (!profile || typeof profile !== "object") return null;
    if (typeof profile.name !== "string" || !Array.isArray(profile.contacts)) return null;
    return normalize(profile as Profile);
  } catch {
    return null;
  }
}
