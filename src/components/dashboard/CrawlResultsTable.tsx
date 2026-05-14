"use client";

import { useState, useMemo } from "react";
import type { PageElement } from "./CrawlPageList";

/* ── Tag color mapping ──────────────────────────────────────────────────── */

const TAG_COLORS: Record<string, { bg: string; fg: string; border: string }> = {
  a:      { bg: "rgba(0,212,255,0.08)",  fg: "#00D4FF", border: "rgba(0,212,255,0.15)" },
  button: { bg: "rgba(0,229,160,0.08)",  fg: "#00E5A0", border: "rgba(0,229,160,0.15)" },
  input:  { bg: "rgba(255,167,38,0.08)", fg: "#FFA726", border: "rgba(255,167,38,0.15)" },
  form:   { bg: "rgba(171,71,188,0.08)", fg: "#AB47BC", border: "rgba(171,71,188,0.15)" },
  select: { bg: "rgba(255,167,38,0.08)", fg: "#FFA726", border: "rgba(255,167,38,0.15)" },
  textarea: { bg: "rgba(255,167,38,0.08)", fg: "#FFA726", border: "rgba(255,167,38,0.15)" },
  img:    { bg: "rgba(66,165,245,0.08)", fg: "#42A5F5", border: "rgba(66,165,245,0.15)" },
  video:  { bg: "rgba(66,165,245,0.08)", fg: "#42A5F5", border: "rgba(66,165,245,0.15)" },
};

const DEFAULT_TAG_COLOR = { bg: "rgba(138,159,191,0.06)", fg: "#8A9FBF", border: "rgba(138,159,191,0.1)" };

type SortKey = "tag" | "text" | "css" | "xpath" | "href";
type SortDir = "asc" | "desc";

/* ── Component ──────────────────────────────────────────────────────────── */

interface CrawlResultsTableProps {
  elements: PageElement[];
  pageUrl: string;
}

export default function CrawlResultsTable({ elements, pageUrl }: CrawlResultsTableProps) {
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("tag");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  /* Unique tags for filter toolbar */
  const uniqueTags = useMemo(() => {
    const tags = new Map<string, number>();
    for (const el of elements) {
      tags.set(el.tag, (tags.get(el.tag) || 0) + 1);
    }
    return Array.from(tags.entries()).sort((a, b) => b[1] - a[1]);
  }, [elements]);

  /* Filtered + sorted elements */
  const filtered = useMemo(() => {
    let result = elements;

    if (tagFilter) {
      result = result.filter((el) => el.tag === tagFilter);
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (el) =>
          el.tag.toLowerCase().includes(q) ||
          (el.text && el.text.toLowerCase().includes(q)) ||
          el.css.toLowerCase().includes(q) ||
          el.xpath.toLowerCase().includes(q) ||
          (el.href && el.href.toLowerCase().includes(q)) ||
          (el.id && el.id.toLowerCase().includes(q)),
      );
    }

    return [...result].sort((a, b) => {
      const aVal = (a[sortKey] ?? "") as string;
      const bVal = (b[sortKey] ?? "") as string;
      const cmp = aVal.localeCompare(bVal);
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [elements, tagFilter, search, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1500);
    });
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <span style={{ color: "var(--text-3)", opacity: 0.4 }}>↕</span>;
    return <span style={{ color: "var(--teal)" }}>{sortDir === "asc" ? "↑" : "↓"}</span>;
  };

  return (
    <div className="flex flex-col h-full">
      {/* ── Sticky toolbar ─────────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-10 flex flex-col gap-2.5 px-4 py-3 border-b"
        style={{
          background: "rgba(13,21,37,0.95)",
          backdropFilter: "blur(8px)",
          borderColor: "var(--border)",
        }}
      >
        {/* Top row: search + count */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 flex-1 px-2.5 py-1.5 rounded-md"
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
              placeholder="Search elements…"
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

          <div
            className="shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded"
            style={{
              color: "var(--teal)",
              background: "var(--teal-glow)",
            }}
          >
            {filtered.length} / {elements.length}
          </div>
        </div>

        {/* Tag filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
          <button
            onClick={() => setTagFilter(null)}
            className="shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md transition-colors"
            style={{
              background: !tagFilter ? "var(--teal-glow)" : "transparent",
              color: !tagFilter ? "var(--teal)" : "var(--text-3)",
              border: !tagFilter
                ? "1px solid rgba(0,212,255,0.15)"
                : "1px solid var(--border)",
            }}
          >
            All
          </button>
          {uniqueTags.map(([tag, count]) => {
            const colors = TAG_COLORS[tag] || DEFAULT_TAG_COLOR;
            const active = tagFilter === tag;
            return (
              <button
                key={tag}
                onClick={() => setTagFilter(active ? null : tag)}
                className="shrink-0 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md transition-colors"
                style={{
                  background: active ? colors.bg : "transparent",
                  color: active ? colors.fg : "var(--text-3)",
                  border: active
                    ? `1px solid ${colors.border}`
                    : "1px solid var(--border)",
                }}
              >
                &lt;{tag}&gt;
                <span style={{ opacity: 0.6 }}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Table ──────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--text-3)"
              strokeWidth="1"
              className="mb-3 opacity-40"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <span className="text-sm" style={{ color: "var(--text-3)" }}>
              {search || tagFilter
                ? "No elements match this filter"
                : "No elements found on this page"}
            </span>
            {(search || tagFilter) && (
              <button
                onClick={() => {
                  setSearch("");
                  setTagFilter(null);
                }}
                className="mt-2 text-xs font-medium"
                style={{ color: "var(--teal)" }}
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <table className="w-full text-xs" style={{ borderCollapse: "separate", borderSpacing: 0 }}>
            <thead>
              <tr>
                {(
                  [
                    { key: "tag" as SortKey, label: "Tag", width: "70px" },
                    { key: "text" as SortKey, label: "Text", width: "auto" },
                    { key: "css" as SortKey, label: "CSS Selector", width: "220px" },
                    { key: "xpath" as SortKey, label: "XPath", width: "220px" },
                    { key: "href" as SortKey, label: "Href / Value", width: "180px" },
                  ] as const
                ).map((col) => (
                  <th
                    key={col.key}
                    onClick={() => toggleSort(col.key)}
                    className="text-left px-3 py-2 cursor-pointer select-none border-b sticky top-0"
                    style={{
                      width: col.width,
                      color: "var(--text-3)",
                      borderColor: "var(--border)",
                      background: "var(--bg-2)",
                      fontSize: "10px",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    <span className="flex items-center gap-1">
                      {col.label}
                      <SortIcon col={col.key} />
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((el, i) => {
                const colors = TAG_COLORS[el.tag] || DEFAULT_TAG_COLOR;
                return (
                  <tr
                    key={`${el.css}-${i}`}
                    className="group transition-colors"
                    style={{
                      borderBottom: "1px solid var(--border)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "rgba(0,212,255,0.02)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    {/* Tag */}
                    <td className="px-3 py-2 border-b" style={{ borderColor: "var(--border)" }}>
                      <span
                        className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold font-mono uppercase"
                        style={{
                          background: colors.bg,
                          color: colors.fg,
                          border: `1px solid ${colors.border}`,
                        }}
                      >
                        {el.tag}
                      </span>
                    </td>

                    {/* Text */}
                    <td
                      className="px-3 py-2 border-b max-w-[200px]"
                      style={{
                        color: "var(--text-1)",
                        borderColor: "var(--border)",
                      }}
                    >
                      <span className="line-clamp-2" title={el.text || ""}>
                        {el.text || (
                          <span style={{ color: "var(--text-3)", fontStyle: "italic" }}>
                            —
                          </span>
                        )}
                      </span>
                    </td>

                    {/* CSS Selector */}
                    <td className="px-3 py-2 border-b" style={{ borderColor: "var(--border)" }}>
                      <CopyableCell
                        value={el.css}
                        copied={copiedIdx === i * 2}
                        onCopy={() => copyToClipboard(el.css, i * 2)}
                      />
                    </td>

                    {/* XPath */}
                    <td className="px-3 py-2 border-b" style={{ borderColor: "var(--border)" }}>
                      <CopyableCell
                        value={el.xpath}
                        copied={copiedIdx === i * 2 + 1}
                        onCopy={() => copyToClipboard(el.xpath, i * 2 + 1)}
                      />
                    </td>

                    {/* Href */}
                    <td
                      className="px-3 py-2 border-b max-w-[180px]"
                      style={{ borderColor: "var(--border)" }}
                    >
                      {el.href ? (
                        <a
                          href={el.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-[11px] truncate block hover:underline"
                          style={{ color: "var(--teal-dim)" }}
                          title={el.href}
                        >
                          {el.href}
                        </a>
                      ) : el.type ? (
                        <span className="font-mono text-[11px]" style={{ color: "var(--text-3)" }}>
                          type={el.type}
                        </span>
                      ) : (
                        <span style={{ color: "var(--text-3)" }}>—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ── Copy-to-clipboard cell ─────────────────────────────────────────────── */

function CopyableCell({
  value,
  copied,
  onCopy,
}: {
  value: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="flex items-center gap-1.5 group/cell max-w-full">
      <span
        className="font-mono text-[11px] truncate flex-1"
        style={{ color: "var(--text-2)" }}
        title={value}
      >
        {value}
      </span>
      <button
        onClick={onCopy}
        className="shrink-0 opacity-0 group-hover/cell:opacity-100 transition-opacity p-0.5 rounded hover:bg-[var(--bg-3)]"
        title="Copy selector"
      >
        {copied ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
      </button>
    </div>
  );
}
