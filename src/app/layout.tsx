import type { Metadata, Viewport } from "next";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/inter";
import "./globals.css";
import RegisterSW from "@/components/RegisterSW";

const SITE_URL = "https://smart-networking.khomichenko.com";
const DESCRIPTION =
  "One mobile page with QR codes for all your professional links. Built for conferences, events and networking.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Smart Networking",
  description: DESCRIPTION,
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "Smart Networking",
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Smart Networking",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Networking",
    description: DESCRIPTION,
    images: ["/og.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    title: "Smart Networking",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#eceef1",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <RegisterSW />
        {children}
      </body>
    </html>
  );
}
