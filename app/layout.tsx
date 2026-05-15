import type { Metadata } from "next";
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
