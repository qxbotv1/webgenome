"use client";

import { useState, useCallback } from "react";
import CrawlForm from "@/components/dashboard/CrawlForm";
import CrawlStatus from "@/components/dashboard/CrawlStatus";

interface CrawlHistoryItem {
  crawlId: string;
  siteUrl?: string;
  status: string;
  pagesCrawled?: number;
  finishedAt?: string;
}

export default function DashboardPage() {
  const [activeCrawlId, setActiveCrawlId] = useState<string | null>(null);
  const [history, setHistory] = useState<CrawlHistoryItem[]>([]);

  const handleCrawlSubmitted = useCallback((crawlId: string) => {
    setActiveCrawlId(crawlId);
  }, []);

  const handleComplete = useCallback(
    (data: CrawlHistoryItem & { crawlId: string }) => {
      setHistory((prev) => [
        {
          crawlId: data.crawlId,
          siteUrl: data.siteUrl,
          status: data.status,
          pagesCrawled: data.pagesCrawled,
          finishedAt: data.finishedAt,
        },
        ...prev.filter((h) => h.crawlId !== data.crawlId),
      ]);
    },
    [],
  );

  const handleReset = useCallback(() => {
    setActiveCrawlId(null);
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-2xl font-bold tracking-tight mb-1"
          style={{ color: "var(--text-1)" }}
        >
          Crawl a Website
        </h1>
        <p className="text-sm" style={{ color: "var(--text-3)" }}>
          Enter a URL to extract every DOM element, link, form, and interactive
          component — structured for automation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 items-start">
        {/* Left: Form */}
        <div
          className="rounded-xl p-5"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          <div className="mb-4 flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{
                background: "var(--teal-glow)",
                border: "1px solid rgba(0,212,255,0.15)",
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--teal)"
                strokeWidth="2.5"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </div>
            <span
              className="text-sm font-bold"
              style={{ color: "var(--text-1)" }}
            >
              New Crawl
            </span>
          </div>

          <CrawlForm
            onCrawlSubmitted={handleCrawlSubmitted}
            disabled={!!activeCrawlId}
          />
        </div>

        {/* Right: Status / Empty State */}
        <div className="flex flex-col gap-4">
          {activeCrawlId ? (
            <CrawlStatus
              key={activeCrawlId}
              crawlId={activeCrawlId}
              onComplete={handleComplete}
              onReset={handleReset}
            />
          ) : (
            <EmptyState hasHistory={history.length > 0} />
          )}

          {/* History */}
          {history.length > 0 && (
            <div className="flex flex-col gap-2 mt-2">
              <span
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-3)" }}
              >
                Recent Crawls
              </span>
              {history.map((item) => (
                <HistoryRow key={item.crawlId} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ hasHistory }: { hasHistory: boolean }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 rounded-xl"
      style={{
        background: "var(--bg-2)",
        border: "1px dashed var(--border)",
      }}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
        style={{
          background: "var(--teal-glow)",
          border: "1px solid rgba(0,212,255,0.1)",
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--teal-dim)"
          strokeWidth="1.5"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      </div>
      <p
        className="text-sm font-medium mb-1"
        style={{ color: "var(--text-2)" }}
      >
        {hasHistory ? "Ready for another crawl" : "No active crawls"}
      </p>
      <p className="text-xs" style={{ color: "var(--text-3)" }}>
        Enter a URL on the left to start extracting website data.
      </p>
    </div>
  );
}

function HistoryRow({ item }: { item: CrawlHistoryItem }) {
  const isDone = item.status === "done";
  const timeAgo = item.finishedAt
    ? formatTimeAgo(new Date(item.finishedAt))
    : "—";

  return (
    <div
      className="flex items-center justify-between px-4 py-3 rounded-lg transition-colors"
      style={{
        background: "var(--bg-2)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ background: isDone ? "var(--green)" : "var(--text-3)" }}
        />
        <div className="flex flex-col min-w-0">
          <span
            className="text-xs font-mono font-medium truncate"
            style={{ color: "var(--text-2)" }}
          >
            {item.siteUrl || item.crawlId}
          </span>
          <span className="text-[10px]" style={{ color: "var(--text-3)" }}>
            {item.crawlId} · {item.pagesCrawled ?? 0} pages · {timeAgo}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <a
          href={`/api/crawl/${item.crawlId}/export?format=json`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-bold uppercase px-2 py-1 rounded transition-colors"
          style={{
            color: "var(--teal)",
            background: "var(--teal-glow)",
            border: "1px solid rgba(0,212,255,0.1)",
          }}
        >
          JSON
        </a>
        <a
          href={`/api/crawl/${item.crawlId}/export?format=csv`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-bold uppercase px-2 py-1 rounded transition-colors"
          style={{
            color: "var(--green)",
            background: "rgba(0,229,160,0.08)",
            border: "1px solid rgba(0,229,160,0.1)",
          }}
        >
          CSV
        </a>
      </div>
    </div>
  );
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.round((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  return `${hours}h ago`;
}
