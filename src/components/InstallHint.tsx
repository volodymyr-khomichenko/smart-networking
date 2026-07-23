"use client";

import { useEffect, useState } from "react";

// Minimal shape of the beforeinstallprompt event (not in TS DOM lib)
interface BIPEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "smart-networking-install-dismissed";

/**
 * A quiet, dismissible banner suggesting the visitor install the app.
 * - Android/Chrome: uses the real beforeinstallprompt event → one-tap install.
 * - iOS Safari: shows a short "Share → Add to Home Screen" hint.
 * Never shows if already installed, or once dismissed.
 */
export default function InstallHint() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [show, setShow] = useState(false);
  const [iosHint, setIosHint] = useState(false);

  useEffect(() => {
    const dismissed = (() => {
      try {
        return localStorage.getItem(DISMISS_KEY) === "1";
      } catch {
        return false;
      }
    })();
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    if (dismissed || standalone) return;

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);

    const isIOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
    const isSafari = /^((?!chrome|android|crios|fxios).)*safari/i.test(
      window.navigator.userAgent
    );
    let t: ReturnType<typeof setTimeout> | undefined;
    if (isIOS && isSafari) {
      t = setTimeout(() => {
        setIosHint(true);
        setShow(true);
      }, 2500);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      if (t) clearTimeout(t);
    };
  }, []);

  const dismiss = () => {
    setShow(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    dismiss();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4">
      <div className="mx-auto flex w-full max-w-md items-center gap-3 rounded-xl border border-line bg-card px-4 py-3 shadow-[0_8px_24px_rgba(20,22,26,0.12)]">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-lanyard text-white">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
          </svg>
        </span>
        <p className="min-w-0 flex-1 text-sm leading-snug text-ink">
          {iosHint ? (
            <>
              Install this app: tap{" "}
              <span className="font-semibold">Share</span> →{" "}
              <span className="font-semibold">Add to Home Screen</span>
            </>
          ) : (
            <>Add Smart Networking to your home screen — works offline.</>
          )}
        </p>
        {!iosHint && deferred && (
          <button
            type="button"
            onClick={install}
            className="shrink-0 rounded-lg bg-lanyard px-3 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Install
          </button>
        )}
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="shrink-0 rounded-lg p-2 text-ink-soft hover:bg-paper"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
