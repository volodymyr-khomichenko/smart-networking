import Script from "next/script";

// ---------------------------------------------------------------------------
// Google Analytics (GA4).
// To change the tracked property, replace the ID below (looks like G-XXXXXXXXXX).
// Set it to an empty string ("") to disable analytics entirely.
// ---------------------------------------------------------------------------
const GA_MEASUREMENT_ID = "G-NFHN0JSMQG";

export default function Analytics() {
  if (!GA_MEASUREMENT_ID) {
    return null;
  }
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
