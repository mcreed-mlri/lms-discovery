import type { Metadata, Viewport } from "next";
import { Public_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import { Providers } from "./providers";
import "./globals.css";

// Public Sans — the binder's one workhorse family, used for every role. It is a
// variable font, so no weight list. Exposed as a CSS var consumed in globals.css.
const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
});

export const metadata: Metadata = {
  title: "LACE Learning Hub",
  description: "A discovery and navigation layer for Brightspace learning content.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Learning Hub",
  },
};

export const viewport: Viewport = {
  themeColor: "#c9c4bb",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const themeScript = `
    (function () {
      try {
        var theme = localStorage.getItem("lace-learning-hub-theme");
        document.documentElement.setAttribute("data-theme", theme === "dark" ? "dark" : "light");
      } catch (e) {
        document.documentElement.setAttribute("data-theme", "light");
      }
    })();
  `;

  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={publicSans.variable}>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
