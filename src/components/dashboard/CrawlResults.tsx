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
  return (
    <div className="flex flex-col gap-4">
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
