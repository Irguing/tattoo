import "./globals.css";
import type { Metadata } from "next";
import { Bangers, Inter } from "next/font/google";
import LayoutShell from "../components/layout/LayoutShell.client";

const fontDisplay = Bangers({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

const fontBody = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Tattoo Studio",
  description: "Tattoos, ilustración y merch",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${fontDisplay.variable} ${fontBody.variable}`}>
      <body className="min-h-screen bg-sand text-ink antialiased">
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
