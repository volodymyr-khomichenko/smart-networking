"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Contact, Profile, qrValueFor } from "@/data/profile";

interface QRModalProps {
  contact: Contact;
  profile: Profile;
  onClose: () => void;
}

function Corner({ className }: { className: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute h-7 w-7 border-lanyard ${className}`}
    />
  );
}


export default function QRModal({ contact, profile, onClose }: QRModalProps) {
  const value = qrValueFor(contact, profile);
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const branded = value.length <= 320;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    setCanShare(typeof navigator !== "undefined" && !!navigator.share);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const copyValue = async () => {
    const text = contact.value;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        /* ignore */
      }
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareValue = async () => {
    try {
      await navigator.share({ title: contact.label, url: contact.value });
    } catch {
      /* user dismissed the share sheet */
    }
  };

  const showActions =
    contact.type === "url" ||
    contact.type === "email" ||
    contact.type === "phone";
  const canShareThis = canShare && contact.type === "url";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`QR code for ${contact.label}`}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-card px-6"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-sm flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-display text-lg font-semibold">{contact.label}</p>
        <p className="mt-1 text-sm text-ink-soft">
          {contact.type === "vcard"
            ? "Scan to save my contact"
            : contact.type === "phone"
              ? "Scan to call or save the number"
              : "Scan with your phone camera"}
        </p>

        <div className="relative mt-8 p-5">
          <Corner className="left-0 top-0 border-l-4 border-t-4 rounded-tl-lg" />
          <Corner className="right-0 top-0 border-r-4 border-t-4 rounded-tr-lg" />
          <Corner className="bottom-0 left-0 border-b-4 border-l-4 rounded-bl-lg" />
          <Corner className="bottom-0 right-0 border-b-4 border-r-4 rounded-br-lg" />
          <QRCodeSVG
            value={value}
            size={260}
            level={branded ? "H" : "M"}
            boostLevel={false}
            marginSize={2}
            bgColor="#ffffff"
            fgColor="#14161a"
            className="h-auto w-full max-w-[260px]"
            imageSettings={
              branded
                ? {
                    src: "/icon-512.png",
                    height: 52,
                    width: 52,
                    excavate: true,
                  }
                : undefined
            }
          />
        </div>
        <p className="mt-4 font-display text-base font-semibold tracking-tight text-ink">
          Smart Networking
        </p>

        {showActions && (
          <>
            <div className="mt-4 flex max-w-full items-center gap-1 rounded-lg border border-line py-1 pl-3 pr-1">
              <a
                href={value}
                target={contact.type === "url" ? "_blank" : undefined}
                rel={contact.type === "url" ? "noopener noreferrer" : undefined}
                aria-label={`Open ${contact.label}`}
                className="min-w-0 truncate py-1.5 text-xs text-ink-soft underline decoration-line underline-offset-2 transition-colors hover:text-lanyard focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lanyard"
              >
                {contact.value}
              </a>
              <button
                type="button"
                onClick={copyValue}
                aria-label={`Copy ${contact.label}`}
                title={copied ? "Copied!" : "Copy"}
                className={`shrink-0 rounded-md p-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lanyard ${
                  copied
                    ? "text-lanyard"
                    : "text-ink-soft hover:bg-lanyard-soft hover:text-lanyard"
                }`}
              >
                {copied ? (
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                  </svg>
                )}
              </button>
            </div>

            {canShareThis && (
              <button
                type="button"
                onClick={shareValue}
                className="mt-3 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-lanyard transition-colors hover:bg-lanyard-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lanyard"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
                  <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
                </svg>
                Share link
              </button>
            )}
          </>
        )}

        <button
          type="button"
          onClick={onClose}
          className="mt-8 w-full rounded-xl bg-ink px-6 py-3.5 font-display text-base font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lanyard"
        >
          Close
        </button>
      </div>
    </div>
  );
}
