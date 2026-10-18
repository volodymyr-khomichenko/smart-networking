import { createClient } from "@/lib/supabase/client";
import {
  BACKUP_KEY,
  bookToStored,
  clearDirty,
  isDirty,
  loadProfileBook,
  parseStoredBook,
  ProfileBook,
  storeProfileBook,
} from "@/lib/storage";

const TABLE = "smart_networking_cards";

function sameBook(a: ProfileBook, b: ProfileBook) {
  return JSON.stringify(bookToStored(a)) === JSON.stringify(bookToStored(b));
}

async function upsertRow(userId: string, book: ProfileBook) {
  const supabase = createClient();
  const { error } = await supabase.from(TABLE).upsert(
    { user_id: userId, data: bookToStored(book) },
    { onConflict: "user_id" }
  );
  if (error) throw error;
}

/**
 * On sign-in: upload a local book when the cloud is empty,
 * or when the local book has edits that never reached the cloud.
 * Otherwise use the cloud book and cache it locally.
 * If both exist, differ, and the local copy is clean, keep it under the backup key first.
 * Throws when the cloud read or the required upload fails.
 */
export async function reconcileCloud(userId: string): Promise<ProfileBook | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select("data")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;

  const local = loadProfileBook();
  const dirty = isDirty();

  if (!data) {
    if (local) {
      await upsertRow(userId, local);
      clearDirty();
    }
    return local;
  }

  const cloud = parseStoredBook(data.data);
  if (!cloud) return local;

  if (local && dirty) {
    await upsertRow(userId, local);
    clearDirty();
    return local;
  }

  if (local && !sameBook(local, cloud)) {
    try {
      localStorage.setItem(BACKUP_KEY, JSON.stringify(bookToStored(local)));
    } catch {
      /* the cloud copy is still applied */
    }
  }

  storeProfileBook(cloud);
  clearDirty();
  return cloud;
}

export async function upsertCloudBook(userId: string, book: ProfileBook) {
  await upsertRow(userId, book);
}

export async function deleteCloudBook(userId: string) {
  const supabase = createClient();
  const { error } = await supabase.from(TABLE).delete().eq("user_id", userId);
  if (error) throw error;
}
