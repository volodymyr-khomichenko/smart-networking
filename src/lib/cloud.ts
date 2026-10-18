import { createClient } from "@/lib/supabase/client";
import {
  BACKUP_KEY,
  bookToStored,
  loadProfileBook,
  parseStoredBook,
  ProfileBook,
  storeProfileBook,
} from "@/lib/storage";

const TABLE = "smart_networking_cards";

function sameBook(a: ProfileBook, b: ProfileBook) {
  return JSON.stringify(bookToStored(a)) === JSON.stringify(bookToStored(b));
}

/**
 * On sign-in: upload a local book when the cloud is empty,
 * otherwise use the cloud book and cache it locally.
 * If both exist and differ, keep the local book under the backup key first.
 * Returns the book that should be shown, or null when there is nothing stored.
 */
export async function reconcileCloud(userId: string): Promise<ProfileBook | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select("data")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) return null;

  const local = loadProfileBook();

  if (!data) {
    if (local) {
      await supabase.from(TABLE).upsert(
        { user_id: userId, data: bookToStored(local) },
        { onConflict: "user_id" }
      );
    }
    return local;
  }

  const cloud = parseStoredBook(data.data);
  if (!cloud) return local;

  if (local && !sameBook(local, cloud)) {
    try {
      localStorage.setItem(BACKUP_KEY, JSON.stringify(bookToStored(local)));
    } catch {
      /* the cloud copy is still applied */
    }
  }

  storeProfileBook(cloud);
  return cloud;
}

export async function upsertCloudBook(userId: string, book: ProfileBook) {
  const supabase = createClient();
  await supabase.from(TABLE).upsert(
    { user_id: userId, data: bookToStored(book) },
    { onConflict: "user_id" }
  );
}

export async function deleteCloudBook(userId: string) {
  const supabase = createClient();
  const { error } = await supabase.from(TABLE).delete().eq("user_id", userId);
  if (error) throw error;
}
