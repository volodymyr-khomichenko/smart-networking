"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Contact, Profile, qrValueFor } from "@/data/profile";
import { buildVCard } from "@/lib/card";

interface QRModalProps {
  contact: Contact;
  profile: Profile;
  onClose: () => void;
}

function Corner({ className }: { className: string }) {
  return (
    <span aria-hidden="true" className={`pointer-events-none absolute h-7 w-7 border-lanyard ${className}`} />
  );
}

function monogramSrc(initials: string): string {
  const text = (initials || "SN").replace(/[<>&"']/g, "").slice(0, 2).toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 72 72"><circle cx="36" cy="36" r="34" fill="#ffffff"/><circle cx="36" cy="36" r="29" fill="none" stroke="#2f52e0" stroke-width="3"/><text x="36" y="42" text-anchor="middle" font-family="Arial,sans-serif" font-size="20" font-weight="700" fill="#2f52e0">${text}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export default function QRModal({ contact, profile, onClose }: QRModalProps) {
  const value = contact.type === "vcard" ? buildVCard(profile) : qrValueFor(contact, profile);
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const branded = value.length < 320;

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
    const text = contact.type === "vcard" ? value : contact.value;
    try { await navigator.clipboard.writeText(text); } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch { /* ignore */ }
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareValue = async () => {
    try { await navigator.share({ title: contact.label, url: contact.value }); } catch { /* dismissed */ }
  };

  const showActions = contact.type === "url" || contact.type === "email" || contact.type === "phone";
  const canShareThis = canShare && contact.type === "url";

  return (
    <div role="dialog" aria-modal="true" aria-label={`QR code for ${contact.label}`} className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-card px-6" onClick={onClose}>
      <div className="flex w-full max-w-sm flex-col items-center" onClick={(e) => e.stopPropagation()}>
        <p className="font-display text-lg font-semibold">{contact.label}</p>
        <p className="mt-1 text-sm text-ink-soft">{contact.type === "vcard" ? "Scan to save my contact" : contact.type === "phone" ? "Scan to call or save the number" : "Scan with your phone camera"}</p>
        <div className="relative mt-8 p-5">
          <Corner className="left-0 top-0 border-l-4 border-t-4 rounded-tl-lg" />
          <Corner className="right-0 top-0 border-r-4 border-t-4 rounded-tr-lg" />
          <Corner className="bottom-0 left-0 border-b-4 border-l-4 rounded-bl-lg" />
          <Corner className="bottom-0 right-0 border-b-4 border-r-4 rounded-br-lg" />
          <QRCodeSVG value={value} size={260} level={branded ? "H" : "M"} marginSize={2} bgColor="#ffffff" fgColor="#14161a" className="h-auto w-full max-w-[260px]" imageSettings={branded ? { src: monogramSrc(profile.initials), height: 48, width: 48, excavate: true } : undefined} />
        </div>
        <p className="mt-3 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-ink-soft">{profile.initials} · Smart Networking</p>
        {showActions && (
          <>
            <div className="mt-4 flex max-w-full items-center gap-1 rounded-lg border border-line py-1 pl-3 pr-1">
              <a href={value} target={contact.type === "url" ? "_blank" : undefined} rel={contact.type === "url" ? "noopener noreferrer" : undefined} aria-label={`Open ${contact.label}`} className="min-w-0 truncate py-1.5 text-xs text-ink-soft underline decoration-line underline-offset-2 transition-colors hover:text-lanyard focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lanyard">{contact.value}</a>
              <button type="button" onClick={copyValue} aria-label={`Copy ${contact.label}`} className={`shrink-0 rounded-md p-2 ${copied ? "text-lanyard" : "text-ink-soft"}`}>{copied ? "OK" : "Copy"}</button>
            </div>
            {canShareThis && <button type="button" onClick={shareValue} className="mt-3 text-sm font-semibold text-lanyard">Share link</button>}
          </>
        )}
        {contact.type === "vcard" && <button type="button" onClick={copyValue} className="mt-4 text-sm font-semibold text-lanyard">{copied ? "vCard copied" : "Copy vCard"}</button>}
        <button type="button" onClick={onClose} className="mt-8 w-full rounded-xl bg-ink px-6 py-3.5 font-display text-base font-semibold text-white">Close</button>
      </div>
    </div>
  );
}
