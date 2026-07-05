"use client";

import { useEffect } from "react";

/**
 * Registers the service worker (public/sw.js) that caches the page
 * so the card keeps working offline — useful at venues with bad Wi-Fi.
 * Registration only happens in production builds.
 */
export default function RegisterSW() {
  useEffect(() => {
    if (
      process.env.NODE_ENV === "production" &&
      "serviceWorker" in navigator
    ) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* offline support is a progressive enhancement — ignore failures */
      });
    }
  }, []);
  return null;
}
