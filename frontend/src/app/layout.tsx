import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import { AppHeader } from "@/components/AppHeader";
import { AppProviders } from "@/components/AppProviders";
import { Footer } from "@/components/Footer";
import "./globals.css";

const interTight = Inter_Tight({
  variable: "--font-body",
  subsets: ["latin"],
});

// Using Inter Tight for both body and display for consistency
const displayFont = Inter_Tight({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Project Atlas",
  description: "Miniature artists community platform MVP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${interTight.variable} ${displayFont.variable} antialiased`}>
        <AppProviders>
          <AppHeader />
          {children}
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
