"use client";

import { useEffect, useState, useMemo } from "react";
import CrawlPageList, { type CrawledPage } from "./CrawlPageList";
import CrawlResultsTable from "./CrawlResultsTable";

interface ExportData {
  crawlId: string;
  siteUrl: string;
  pages: number;
  elements: number;
  status: string;
  data: CrawledPage[];
}

interface CrawlResultsProps {
  crawlId: string;
}

export default function CrawlResults({ crawlId }: CrawlResultsProps) {
  const [exportData, setExportData] = useState<ExportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchExport() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/crawl/${crawlId}/export?format=json`, {
          signal: controller.signal,
        });
        if (!res.ok) {
          setError("Failed to load crawl results.");
          return;
        }

        const data: ExportData = await res.json();
        if (controller.signal.aborted) return;

        setExportData(data);

        // Auto-select first page
        if (data.data.length > 0) {
          setSelectedUrl(data.data[0].url);
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        if (!controller.signal.aborted) setError("Network error loading results.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    fetchExport();
    return () => controller.abort();
  }, [crawlId]);

  const selectedPage = useMemo(
    () => exportData?.data.find((p) => p.url === selectedUrl) ?? null,
    [exportData, selectedUrl],
  );

  /* ── Loading ────────────────────────────────────────────────────────── */
  if (loading) {
    return (
      <div
        className="flex items-center justify-center py-20 rounded-xl"
        style={{
          background: "var(--bg-2)",
          border: "1px solid var(--border)",
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <svg
            className="animate-spin"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--teal)"
            strokeWidth="2"
          >
            <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
          </svg>
          <span className="text-xs" style={{ color: "var(--text-3)" }}>
            Loading crawl results…
          </span>
        </div>
      </div>
    );
  }

  /* ── Error ───────────────────────────────────────────────────────────── */
  if (error || !exportData) {
    return (
      <div
        className="flex items-center justify-center py-16 rounded-xl"
        style={{
          background: "rgba(255,77,106,0.04)",
          border: "1px solid rgba(255,77,106,0.1)",
        }}
      >
        <span className="text-sm" style={{ color: "var(--danger)" }}>
          {error || "No data available."}
        </span>
      </div>
    );
  }

  /* ── Results ─────────────────────────────────────────────────────────── */
  const hasGated = exportData?.data.some((p) => p.isGated);

  return (
    <div className="flex flex-col gap-4">
      {/* Gate Alert */}
      {hasGated && (
        <div
          className="flex items-center justify-between px-4 py-3 rounded-xl border"
          style={{
            background: "rgba(255,77,106,0.08)",
            borderColor: "rgba(255,77,106,0.15)",
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">🛑</span>
            <div>
              <p className="text-sm font-bold text-[var(--danger)]">
                Crawl blocked by access gate
              </p>
              <p className="text-xs text-[var(--danger)] opacity-80 mt-0.5">
                This site blocked automated access. Open access window to complete verification and continue.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsUnlockModalOpen(true)}
            className="px-4 py-2 rounded-lg text-xs font-bold transition-opacity hover:opacity-80"
            style={{ background: "var(--danger)", color: "#fff" }}
          >
            Open access window
          </button>
        </div>
      )}

      {/* Unlock Modal */}
      {isUnlockModalOpen && (
        <UnlockModal
          crawlId={crawlId}
          onClose={() => setIsUnlockModalOpen(false)}
        />
      )}

      {/* Summary bar */}
      <div
        className="flex items-center justify-between px-4 py-3 rounded-xl"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
        }}
      >
        <div className="flex items-center gap-4">
          <SummaryChip label="Pages" value={String(exportData.pages)} />
          <SummaryChip label="Elements" value={String(exportData.elements)} />
          <SummaryChip
            label="Site"
            value={shortenUrl(exportData.siteUrl)}
            mono
          />
        </div>

        <div className="flex items-center gap-2">
          <ExportButton
            href={`/api/crawl/${crawlId}/export?format=json`}
            label="JSON"
            color="var(--teal)"
          />
          <ExportButton
            href={`/api/crawl/${crawlId}/export?format=csv`}
            label="CSV"
            color="var(--green)"
          />
        </div>
      </div>

      {/* Master-detail layout */}
      <div
        className="grid grid-cols-[260px_1fr] rounded-xl overflow-hidden"
        style={{
          background: "var(--bg-2)",
          border: "1px solid var(--border)",
          minHeight: "480px",
          maxHeight: "calc(100vh - 260px)",
        }}
      >
        {/* Left: Page list */}
        <div
          className="overflow-hidden border-r flex flex-col"
          style={{ borderColor: "var(--border)" }}
        >
          <CrawlPageList
            pages={exportData.data}
            selectedUrl={selectedUrl}
            onSelect={setSelectedUrl}
          />
        </div>

        {/* Right: Elements table */}
        <div className="overflow-hidden flex flex-col">
          {selectedPage ? (
            <CrawlResultsTable
              elements={selectedPage.elements}
              pageUrl={selectedPage.url}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-sm" style={{ color: "var(--text-3)" }}>
                Select a page to view its elements
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────────────────── */

function SummaryChip({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="text-[10px] uppercase tracking-wider font-semibold"
        style={{ color: "var(--text-3)" }}
      >
        {label}
      </span>
      <span
        className={`text-xs font-bold ${mono ? "font-mono" : ""}`}
        style={{ color: "var(--text-1)" }}
      >
        {value}
      </span>
    </div>
  );
}

function ExportButton({
  href,
  label,
  color,
}: {
  href: string;
  label: string;
  color: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all hover:opacity-80"
      style={{
        background: `${color}11`,
        color,
        border: `1px solid ${color}22`,
      }}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      {label}
    </a>
  );
}

function shortenUrl(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

function UnlockModal({ crawlId, onClose }: { crawlId: string; onClose: () => void }) {
  const [token, setToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/crawl/${crawlId}/unlock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (res.ok) {
        window.location.reload();
      } else {
        const data = await res.json();
        alert(`Failed to unlock: ${data.error}`);
      }
    } catch (err) {
      alert("Network error trying to unlock.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div
        className="w-full max-w-md rounded-2xl p-6 shadow-2xl border"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}
      >
        <h2 className="text-lg font-bold mb-2" style={{ color: "var(--text-1)" }}>
          Unlock Crawl Session
        </h2>
        <p className="text-sm mb-6" style={{ color: "var(--text-3)" }}>
          The target site has an anti-bot check. Please open the site in your own browser, solve the challenge, and paste the session cookie or token below.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="cf_clearance=... or session token"
            className="w-full rounded-lg px-3 py-2 text-sm font-mono border outline-none"
            style={{
              background: "var(--bg-3)",
              borderColor: "var(--border)",
              color: "var(--text-1)",
              minHeight: "100px",
            }}
            required
          />
          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
              style={{ color: "var(--text-2)" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg text-sm font-bold transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: "var(--teal)", color: "#000" }}
            >
              {isSubmitting ? "Resuming..." : "Resume Crawl"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
