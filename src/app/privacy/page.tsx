import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy — Smart Networking",
  description:
    "How Smart Networking stores your card. Without Google sign-in it stays in your browser. With sign-in it syncs through Supabase.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto min-h-dvh w-full max-w-md px-4 py-10 text-sm leading-relaxed text-ink">
      <h1 className="font-display text-2xl font-semibold">Privacy</h1>
      <div className="mt-4 space-y-4 text-ink-soft">
        <p>
          Without a login, your card stays only in this browser. It is not
          uploaded anywhere.
        </p>
        <p>
          If you sign in with Google, we store your Google name, email, avatar
          and the card data you enter. That data is kept in Supabase (EU
          region) only so we can sign you in and sync your cards across your
          devices.
        </p>
        <p>We do not sell or share your data.</p>
        <p>
          You can delete your cloud data at any time with “Delete my cloud
          data” in the app, or by contacting us via{" "}
          <a
            href="https://khomichenko.com"
            className="underline decoration-line underline-offset-2 hover:text-lanyard"
          >
            khomichenko.com
          </a>
          .
        </p>
      </div>
      <p className="mt-8">
        <Link
          href="/"
          className="text-sm font-semibold text-lanyard underline decoration-line underline-offset-2"
        >
          Back to Smart Networking
        </Link>
      </p>
    </main>
  );
}
