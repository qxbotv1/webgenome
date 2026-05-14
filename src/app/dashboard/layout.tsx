import type { Metadata } from "next";
import DashboardNav from "@/components/dashboard/DashboardNav";

export const metadata: Metadata = {
  title: "Dashboard — WebGenome",
  description: "Crawl any website, extract DOM elements, and export structured data.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      <DashboardNav />
      <main className="flex-1">{children}</main>
    </div>
  );
}
