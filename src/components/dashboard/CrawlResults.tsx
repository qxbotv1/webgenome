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
  const accessiblePages = exportData?.data.filter((p) => !p.isGated).length ?? 0;
  const gatedPage = exportData?.data.find((p) => p.isGated);
  const siteUrl = exportData?.siteUrl ?? "";

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
                Crawl paused at first access gate
              </p>
              <p className="text-xs text-[var(--danger)] opacity-80 mt-0.5">
                {accessiblePages} accessible page{accessiblePages !== 1 ? "s" : ""} crawled before protection blocked further discovery.
                {gatedPage?.gateReason ? ` (${gatedPage.gateReason})` : ""}
              </p>
              <p className="text-[10px] mt-1 opacity-60" style={{ color: "var(--danger)" }}>
                No further pages will be attempted until access is provided.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsUnlockModalOpen(true)}
            className="px-4 py-2 rounded-lg text-xs font-bold transition-opacity hover:opacity-80 whitespace-nowrap"
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
          siteUrl={siteUrl}
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
          <ExportButton
            href={`/api/crawl/${crawlId}/export?format=html`}
            label="HTML"
            color="#FFA726"
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

function UnlockModal({ crawlId, siteUrl, onClose }: { crawlId: string; siteUrl: string; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<"open" | "paste">("open");
  const [token, setToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenSite = () => {
    window.open(siteUrl, "_blank", "noopener,noreferrer");
  };

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

  const tabStyle = (active: boolean) => ({
    background: active ? "var(--teal-glow)" : "transparent",
    color: active ? "var(--teal)" : "var(--text-3)",
    borderBottom: active ? "2px solid var(--teal)" : "2px solid transparent",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div
        className="w-full max-w-lg rounded-2xl shadow-2xl border overflow-hidden"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-3">
          <h2 className="text-lg font-bold mb-1" style={{ color: "var(--text-1)" }}>
            Unlock Crawl Session
          </h2>
          <p className="text-xs" style={{ color: "var(--text-3)" }}>
            Open the target website to log in or solve a CAPTCHA, then provide the session token to continue crawling.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b" style={{ borderColor: "var(--border)" }}>
          <button
            onClick={() => setActiveTab("open")}
            className="flex-1 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors"
            style={tabStyle(activeTab === "open")}
          >
            Open Website
          </button>
          <button
            onClick={() => setActiveTab("paste")}
            className="flex-1 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors"
            style={tabStyle(activeTab === "paste")}
          >
            Paste Token
          </button>
        </div>

        {/* Tab Content */}
        <div className="px-6 py-5">
          {activeTab === "open" ? (
            <div className="flex flex-col items-center gap-4 py-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: "var(--teal-glow)", border: "1px solid rgba(0,212,255,0.15)" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </div>
              <p className="text-sm text-center" style={{ color: "var(--text-2)" }}>
                Opens <span className="font-mono text-xs" style={{ color: "var(--teal)" }}>{siteUrl ? new URL(siteUrl).host : "target site"}</span> in a new tab.
                Log in or solve the CAPTCHA, then switch to the <strong>Paste Token</strong> tab.
              </p>
              <button
                onClick={handleOpenSite}
                className="px-6 py-2.5 rounded-lg text-sm font-bold transition-opacity hover:opacity-90"
                style={{ background: "var(--teal)", color: "#000" }}
              >
                Open in new tab
              </button>
              <p className="text-[10px]" style={{ color: "var(--text-3)" }}>
                After solving, copy the <code className="text-[10px]" style={{ background: "var(--bg-3)", padding: "1px 4px", borderRadius: 3 }}>cf_clearance</code> cookie from your browser DevTools.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-[10px] uppercase tracking-wider font-semibold mb-1.5 block" style={{ color: "var(--text-3)" }}>
                  Session cookie or clearance token
                </label>
                <textarea
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="cf_clearance=abc123... or full cookie string"
                  className="w-full rounded-lg px-3 py-2.5 text-sm font-mono border outline-none resize-none"
                  style={{
                    background: "var(--bg-3)",
                    borderColor: "var(--border)",
                    color: "var(--text-1)",
                    minHeight: "90px",
                  }}
                  required
                />
              </div>
              <p className="text-[10px]" style={{ color: "var(--text-3)" }}>
                The crawler will inject this token into a new browser session and retry the blocked page.
                Tokens may fail if the originating IP or user-agent differs from the crawler environment.
              </p>
              <div className="flex justify-end gap-3">
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
                  disabled={isSubmitting || !token.trim()}
                  className="px-4 py-2 rounded-lg text-sm font-bold transition-opacity hover:opacity-90 disabled:opacity-50"
                  style={{ background: "var(--teal)", color: "#000" }}
                >
                  {isSubmitting ? "Resuming…" : "Resume Crawl"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
