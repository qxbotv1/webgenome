"use client";

import Link from "next/link";

export default function DashboardNav() {
  return (
    <nav
      className="sticky top-0 z-50 h-14 flex items-center justify-between px-6 border-b"
      style={{
        background: "rgba(8,13,26,0.95)",
        backdropFilter: "blur(16px)",
        borderColor: "var(--border)",
      }}
    >
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-black"
            style={{
              background: "linear-gradient(135deg,#00D4FF,#0070A0)",
              color: "#080D1A",
            }}
          >
            WG
          </div>
          <span
            className="text-sm font-bold tracking-tight"
            style={{ color: "var(--text-1)" }}
          >
            Web<span style={{ color: "var(--teal)" }}>Genome</span>
          </span>
        </Link>

        <div
          className="w-px h-5 mx-1"
          style={{ background: "var(--border)" }}
        />

        <span
          className="text-sm font-medium"
          style={{ color: "var(--text-2)" }}
        >
          Dashboard
        </span>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="text-xs font-medium transition-colors hover:text-[var(--teal)]"
          style={{ color: "var(--text-3)" }}
        >
          ← Back to site
        </Link>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold"
          style={{
            background: "var(--surface-2)",
            color: "var(--teal)",
            border: "1px solid var(--border)",
          }}
        >
          U
        </div>
      </div>
    </nav>
  );
}
