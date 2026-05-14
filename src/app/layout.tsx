import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Analytics } from "@vercel/analytics/react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "WebGenome — Decode Any Website. Automate Everything.",
  description:
    "WebGenome crawls any website — public or authenticated — maps every DOM element, workflow, and API call, and delivers structured intelligence for automation, testing, and AI agents.",
  keywords: "web crawling, DOM extraction, test automation, AI agents, RPA, browser automation",
  openGraph: {
    title: "WebGenome",
    description: "Decode any website. Automate everything.",
    url: "https://webgenome.io",
    siteName: "WebGenome",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en" className={inter.variable}>
        <body>
          <Navbar />
          {children}
          <Footer />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
