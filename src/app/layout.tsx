import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PantryPro: Intent-Driven Culinary Curation Engine",
  description: "Modern, lightning-fast mobile-first recipe curation engine for busy professionals and home chefs.",
  keywords: ["recipe engine", "pantry chef", "quick meals", "culinary curation", "gourmet recipes", "leftover recipes"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcfbf9" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0e12" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen selection:bg-brand-500/20 selection:text-brand-500">
        {children}
      </body>
    </html>
  );
}
