import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
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
    <html lang="en" className={inter.variable}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
