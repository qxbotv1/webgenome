"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";

interface CrawlFormProps {
  onCrawlSubmitted: (crawlId: string) => void;
  disabled?: boolean;
}

export default function CrawlForm({ onCrawlSubmitted, disabled }: CrawlFormProps) {
  const [url, setUrl] = useState("");
  const [maxPages, setMaxPages] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      const trimmed = url.trim();
      if (!trimmed) {
        setError("Enter a URL to crawl.");
        inputRef.current?.focus();
        return;
      }

      // Basic URL validation — add protocol if missing
      let finalUrl = trimmed;
      if (!/^https?:\/\//i.test(finalUrl)) {
        finalUrl = `https://${finalUrl}`;
      }

      try {
        new URL(finalUrl);
      } catch {
        setError("Invalid URL. Try something like https://example.com");
        return;
      }

      setLoading(true);
      try {
        const res = await fetch("/api/crawl", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: finalUrl, maxPages }),
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Failed to start crawl.");
          return;
        }

        setUrl("");
        onCrawlSubmitted(data.crawlId);
      } catch {
        setError("Network error — is the crawler running?");
      } finally {
        setLoading(false);
      }
    },
    [url, maxPages, onCrawlSubmitted],
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* URL Input */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="crawl-url"
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--text-3)" }}
        >
          Website URL
        </label>
        <div
          className="flex items-center gap-0 rounded-lg overflow-hidden transition-all focus-within:ring-2"
          style={{
            background: "var(--bg-2)",
            border: "1px solid var(--border)",
            ["--tw-ring-color" as string]: "var(--teal-dim)",
          }}
        >
          <div
            className="flex items-center px-3 py-2.5 text-xs font-mono shrink-0 select-none"
            style={{ color: "var(--text-3)", borderRight: "1px solid var(--border)" }}
          >
            https://
          </div>
          <input
            ref={inputRef}
            id="crawl-url"
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError(null);
            }}
            placeholder="example.com"
            disabled={disabled || loading}
            className="flex-1 bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-[var(--text-3)]"
            style={{ color: "var(--text-1)" }}
            autoComplete="url"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Max Pages Slider */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="max-pages"
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--text-3)" }}
          >
            Max Pages
          </label>
          <span
            className="text-sm font-mono font-bold tabular-nums"
            style={{ color: "var(--teal)" }}
          >
            {maxPages}
          </span>
        </div>

        <div className="relative flex items-center gap-3">
          <span className="text-[10px] font-mono" style={{ color: "var(--text-3)" }}>
            1
          </span>
          <div className="relative flex-1 h-6 flex items-center">
            <div
              className="absolute inset-x-0 h-1.5 rounded-full"
              style={{ background: "var(--bg-3)" }}
            />
            <div
              className="absolute left-0 h-1.5 rounded-full transition-all"
              style={{
                width: `${((maxPages - 1) / 49) * 100}%`,
                background: "linear-gradient(90deg, var(--teal), var(--teal-dim))",
              }}
            />
            <input
              id="max-pages"
              type="range"
              min={1}
              max={50}
              value={maxPages}
              onChange={(e) => setMaxPages(Number(e.target.value))}
              disabled={disabled || loading}
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
              style={{ height: "24px" }}
            />
            <div
              className="absolute w-4 h-4 rounded-full border-2 shadow-lg transition-all pointer-events-none"
              style={{
                left: `calc(${((maxPages - 1) / 49) * 100}% - 8px)`,
                background: "var(--teal)",
                borderColor: "var(--bg)",
                boxShadow: "0 0 8px var(--teal-glow)",
              }}
            />
          </div>
          <span className="text-[10px] font-mono" style={{ color: "var(--text-3)" }}>
            50
          </span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium"
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
          {error}
        </div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        disabled={disabled || loading}
        className="w-full h-11 text-sm font-bold rounded-lg transition-all"
        style={{
          background: loading
            ? "var(--surface-2)"
            : "linear-gradient(135deg, #00D4FF, #0080A6)",
          color: loading ? "var(--text-3)" : "#080D1A",
          border: "none",
        }}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
            </svg>
            Starting crawl…
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            Start Crawl
          </span>
        )}
      </Button>
    </form>
  );
}
