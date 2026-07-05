// ---------------------------------------------------------------------------
// Local profile storage.
// A visitor can edit the demo profile and keep their own version — it is
// saved only in their browser (localStorage), never sent anywhere.
// ---------------------------------------------------------------------------

import { DEFAULT_TABS, Profile } from "@/data/profile";

const KEY = "smart-networking-profile-v1";

export function loadStoredProfile(): Profile | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || typeof data !== "object" || !data.profile) return null;
    const profile = data.profile as Profile;
    // Older saved profiles may predate editable tabs
    if (!Array.isArray(profile.tabs) || profile.tabs.length === 0) {
      profile.tabs = JSON.parse(JSON.stringify(DEFAULT_TABS));
    }
    return profile;
  } catch {
    return null;
  }
}

export function storeProfile(profile: Profile): void {
  try {
    localStorage.setItem(KEY, JSON.stringify({ version: 1, profile }));
  } catch {
    /* storage may be unavailable (private mode) — editing still works in memory */
  }
}

export function clearStoredProfile(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
