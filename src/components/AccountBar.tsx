"use client";

import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

interface AccountBarProps {
  user: User | null;
  authError: boolean;
  onSignOut: () => Promise<void>;
  onDeleteCloud: () => Promise<void>;
}

export default function AccountBar({ user, authError, onSignOut, onDeleteCloud }: AccountBarProps) {
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  const signIn = async () => {
    setNotice("");
    setBusy(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) setNotice("Couldn't sign in. Please try again.");
    } catch {
      setNotice("Couldn't sign in. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const signOut = async () => {
    setNotice("");
    setBusy(true);
    try {
      await onSignOut();
    } catch {
      setNotice("Couldn't sign out. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const deleteCloud = async () => {
    if (!user) return;
    if (!window.confirm("Delete your cloud data? The copy on this device stays.")) return;
    setNotice("");
    setBusy(true);
    try {
      await onDeleteCloud();
      setNotice("Cloud data deleted and you were signed out.");
    } catch {
      setNotice("Couldn't delete cloud data. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const avatar =
    (user?.user_metadata?.avatar_url as string | undefined) ||
    (user?.user_metadata?.picture as string | undefined);

  return (
    <section className="mb-4 rounded-xl border border-line bg-card px-4 py-4 text-center">
      {user ? (
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            {avatar ? (
              <img src={avatar} alt="" className="h-8 w-8 rounded-full" />
            ) : null}
            <p className="text-sm font-semibold text-ink">{user.email}</p>
          </div>
          <div className="flex items-center justify-center gap-4 text-xs font-semibold text-ink-soft">
            <button
              type="button"
              onClick={signOut}
              disabled={busy}
              className="underline decoration-line underline-offset-2 hover:text-lanyard disabled:opacity-50"
            >
              Sign out
            </button>
            <button
              type="button"
              onClick={deleteCloud}
              disabled={busy}
              className="underline decoration-line underline-offset-2 hover:text-lanyard disabled:opacity-50"
            >
              Delete my cloud data
            </button>
          </div>
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={signIn}
            disabled={busy}
            className="rounded-xl border border-line bg-paper px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-lanyard hover:text-lanyard disabled:opacity-50"
          >
            Continue with Google
          </button>
          <p className="mt-3 text-xs leading-relaxed text-ink-soft">
            Optional. Sign in with Google to sync your cards across devices. We
            store your Google name, email and your card data.{" "}
            <a href="/privacy" className="underline decoration-line underline-offset-2 hover:text-lanyard">
              Privacy
            </a>
          </p>
        </>
      )}
      {authError ? (
        <p className="mt-3 text-xs text-red-500">Couldn't sign in. Please try again.</p>
      ) : null}
      {notice ? <p className="mt-3 text-xs text-ink-soft">{notice}</p> : null}
    </section>
  );
}
