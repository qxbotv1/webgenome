"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Badge } from "@/components/ui/badge";

interface CrawlData {
  crawlId: string;
  siteUrl: string;
  status: "queued" | "running" | "done" | "failed";
  maxPages: number;
  pagesTotal: number;
  pagesCrawled: number;
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
  error?: string;
}

interface CrawlStatusProps {
  crawlId: string;
  onComplete: (data: CrawlData) => void;
  onReset: () => void;
}

const STATUS_CONFIG = {
  queued: {
    label: "Queued",
    color: "#8A9FBF",
    bgColor: "rgba(138,159,191,0.08)",
    borderColor: "rgba(138,159,191,0.15)",
    pulse: true,
  },
  running: {
    label: "Crawling",
    color: "#00D4FF",
    bgColor: "rgba(0,212,255,0.08)",
    borderColor: "rgba(0,212,255,0.15)",
    pulse: true,
  },
  done: {
    label: "Complete",
    color: "#00E5A0",
    bgColor: "rgba(0,229,160,0.08)",
    borderColor: "rgba(0,229,160,0.15)",
    pulse: false,
  },
  failed: {
    label: "Failed",
    color: "#FF4D6A",
    bgColor: "rgba(255,77,106,0.08)",
    borderColor: "rgba(255,77,106,0.15)",
    pulse: false,
  },
};

export default function CrawlStatus({ crawlId, onComplete, onReset }: CrawlStatusProps) {
  const [data, setData] = useState<CrawlData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const poll = useCallback(async (signal: AbortSignal) => {
    try {
      const res = await fetch(`/api/crawl/${crawlId}`, { signal });
      if (!res.ok) {
        setError("Failed to fetch crawl status.");
        return;
      }

      const result: CrawlData = await res.json();
      if (signal.aborted) return;

      setData(result);
      setError(null);

      if (result.status === "done" || result.status === "failed") {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        if (result.status === "done") {
          onComplete(result);
        }
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      if (!signal.aborted) {
        setError("Network error polling status.");
      }
    }
  }, [crawlId, onComplete]);

  useEffect(() => {
    const controller = new AbortController();
    abortRef.current = controller;

    poll(controller.signal); // initial fetch
    intervalRef.current = setInterval(() => poll(controller.signal), 2000);

    return () => {
      controller.abort();
      abortRef.current = null;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [poll]);

  const config = data ? STATUS_CONFIG[data.status] : STATUS_CONFIG.queued;
  const progress = data && data.maxPages > 0
    ? Math.round((data.pagesCrawled / data.maxPages) * 100)
    : 0;

  const elapsed = data?.startedAt
    ? Math.round(
        ((data.finishedAt
          ? new Date(data.finishedAt).getTime()
          : Date.now()) -
          new Date(data.startedAt).getTime()) /
          1000,
      )
    : 0;

  return (
    <div
      className="rounded-xl overflow-hidden transition-all"
      style={{
        background: "var(--bg-2)",
        border: `1px solid ${config.borderColor}`,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-2.5">
          {/* Status dot */}
          <div className="relative flex items-center justify-center">
            {config.pulse && (
              <span
                className="absolute w-2.5 h-2.5 rounded-full animate-ping opacity-40"
                style={{ background: config.color }}
              />
            )}
            <span
              className="relative w-2 h-2 rounded-full"
              style={{ background: config.color }}
            />
          </div>
          <span className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>
            {data?.crawlId || crawlId}
          </span>
        </div>

        <Badge
          className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5"
          style={{
            background: config.bgColor,
            color: config.color,
            border: `1px solid ${config.borderColor}`,
          }}
        >
          {config.label}
        </Badge>
      </div>

      {/* Body */}
      <div className="px-4 py-4 flex flex-col gap-4">
        {/* URL */}
        {data?.siteUrl && (
          <div className="flex items-center gap-2">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--text-3)"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span
              className="text-sm font-mono truncate"
              style={{ color: "var(--text-2)" }}
              title={data.siteUrl}
            >
              {data.siteUrl}
            </span>
          </div>
        )}

        {/* Progress bar */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: "var(--text-3)" }}>
              Pages crawled
            </span>
            <span
              className="text-xs font-mono font-bold tabular-nums"
              style={{ color: config.color }}
            >
              {data?.pagesCrawled ?? 0} / {data?.maxPages ?? "—"}
            </span>
          </div>

          <div
            className="w-full h-2 rounded-full overflow-hidden"
            style={{ background: "var(--bg-3)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${Math.max(progress, data?.status === "queued" ? 2 : 0)}%`,
                background: `linear-gradient(90deg, ${config.color}, ${config.color}88)`,
                boxShadow: `0 0 12px ${config.color}33`,
              }}
            />
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <StatBox
            label="Progress"
            value={`${progress}%`}
            color={config.color}
          />
          <StatBox
            label="Pages"
            value={`${data?.pagesCrawled ?? 0}`}
            color="var(--text-1)"
          />
          <StatBox
            label="Elapsed"
            value={elapsed > 0 ? `${elapsed}s` : "—"}
            color="var(--text-1)"
          />
        </div>

        {/* Error message */}
        {(error || data?.error) && (
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
            style={{
              background: "rgba(255,77,106,0.08)",
              color: "var(--danger)",
              border: "1px solid rgba(255,77,106,0.15)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error || data?.error}
          </div>
        )}

        {/* Done actions */}
        {data?.status === "done" && (
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={onReset}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #00D4FF, #0080A6)",
                color: "#080D1A",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a10 10 0 0 0-7.07 2.93" />
                <path d="M2 12a10 10 0 1 0 3-7" />
                <polyline points="2 2 2 8 8 8" />
              </svg>
              New Crawl
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div
      className="flex flex-col items-center gap-0.5 py-2 rounded-lg"
      style={{ background: "var(--bg-3)" }}
    >
      <span
        className="text-base font-bold font-mono tabular-nums"
        style={{ color }}
      >
        {value}
      </span>
      <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-3)" }}>
        {label}
      </span>
    </div>
  );
}
