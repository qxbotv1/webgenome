"use client";

import { useState } from "react";

/* ── Shared types (mirrors crawler types.ts) ────────────────────────────── */

export interface PageElement {
  tag: string;
  text: string | null;
  css: string;
  xpath: string;
  type: string | null;
  href: string | null;
  name: string | null;
  id: string | null;
  role: string | null;
  testId: string | null;
}

export interface CrawledPage {
  crawlId: string;
  url: string;
  title: string;
  statusCode: number | null;
  elements: PageElement[];
  screenshotUrl: string | null;
  crawledAt: string;
  isGated?: boolean;
  gateReason?: string;
}

/* ── Component ──────────────────────────────────────────────────────────── */

interface CrawlPageListProps {
  pages: CrawledPage[];
  selectedUrl: string | null;
  onSelect: (url: string) => void;
}

export default function CrawlPageList({
  pages,
  selectedUrl,
  onSelect,
}: CrawlPageListProps) {
  const [search, setSearch] = useState("");

  const filtered = search
    ? pages.filter(
        (p) =>
          p.url.toLowerCase().includes(search.toLowerCase()) ||
          p.title.toLowerCase().includes(search.toLowerCase()),
      )
    : pages;

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="px-3 pt-3 pb-2">
        <div
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-md"
          style={{
            background: "var(--bg-3)",
            border: "1px solid var(--border)",
          }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--text-3)"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter pages…"
            className="flex-1 bg-transparent text-xs outline-none placeholder:text-[var(--text-3)]"
            style={{ color: "var(--text-1)" }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-[10px] hover:opacity-80"
              style={{ color: "var(--text-3)" }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Count */}
      <div className="px-3 pb-1.5">
        <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-3)" }}>
          {filtered.length} page{filtered.length !== 1 ? "s" : ""} crawled
        </span>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-1.5 pb-2">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <span className="text-xs" style={{ color: "var(--text-3)" }}>
              {search ? "No pages match filter" : "No pages crawled"}
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-0.5">
            {filtered.map((page) => {
              const active = page.url === selectedUrl;
              return (
                <button
                  key={page.url}
                  onClick={() => onSelect(page.url)}
                  className="w-full text-left px-2.5 py-2 rounded-md transition-colors group"
                  style={{
                    background: active ? "var(--teal-glow)" : "transparent",
                    border: active
                      ? "1px solid rgba(0,212,255,0.12)"
                      : "1px solid transparent",
                  }}
                >
                  {/* Title */}
                  <div
                    className="text-xs font-medium truncate mb-0.5"
                    style={{
                      color: active ? "var(--teal)" : "var(--text-1)",
                    }}
                  >
                    {page.title || "Untitled"}
                  </div>

                  {/* URL */}
                  <div
                    className="text-[10px] font-mono truncate"
                    style={{ color: "var(--text-3)" }}
                  >
                    {shortenUrl(page.url)}
                  </div>

                  {/* Meta row */}
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="text-[10px] tabular-nums"
                      style={{ color: active ? "var(--teal-dim)" : "var(--text-3)" }}
                    >
                      {page.elements.length} element{page.elements.length !== 1 ? "s" : ""}
                    </span>
                    {page.statusCode && (
                      <span
                        className="text-[10px] font-mono tabular-nums"
                        style={{
                          color:
                            page.statusCode >= 400
                              ? "var(--danger)"
                              : page.statusCode >= 300
                                ? "#FFA726"
                                : "var(--green)",
                        }}
                      >
                        {page.statusCode}
                      </span>
                    )}
                    {page.isGated && (
                      <span
                        className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                        style={{
                          background: "rgba(255,77,106,0.15)",
                          color: "var(--danger)",
                        }}
                        title={page.gateReason || "Access Blocked"}
                      >
                        Gated
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function shortenUrl(url: string): string {
  try {
    const u = new URL(url);
    const path = u.pathname === "/" ? "" : u.pathname;
    return `${u.host}${path}`;
  } catch {
    return url;
  }
}
