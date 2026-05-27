import type { Metadata, Viewport } from "next";
import { Lato } from "next/font/google";
import type { ReactNode } from "react";
import { Providers } from "./providers";
import "./globals.css";

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-lato",
});

export const metadata: Metadata = {
  title: "MLRI Learning Hub",
  description: "A discovery and navigation layer for Brightspace learning content.",
  manifest: "/manifest.json",
  icons: {
    apple: "/icon-192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Learning Hub",
  },
};

export const viewport: Viewport = {
  themeColor: "#171713",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={lato.variable}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
