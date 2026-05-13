"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const codeLines = [
  '{ "url": "https://nike.com/checkout",',
  '  "buttons": [',
  '    { "text": "Place Order",',
  '      "css": "#btn-place-order",',
  '      "xpath": "//button[@id=\'btn\']" }',
  '  ],',
  '  "forms": [{ "id": "checkout-form",',
  '    "inputs": ["email","card","address"] }],',
  '  "apis": ["POST /api/order",',
  '           "GET /api/cart"],',
  '  "screenshot": "cdn.webgenome.io/..."',
  '}',
];

export default function Hero() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [urlText, setUrlText] = useState("");
  const fullUrl = "https://nike.com";

  useEffect(() => {
    let i = 0;
    const typeUrl = setInterval(() => {
      setUrlText(fullUrl.slice(0, i + 1));
      i++;
      if (i >= fullUrl.length) {
        clearInterval(typeUrl);
        let line = 0;
        const showLines = setInterval(() => {
          setVisibleLines((v) => v + 1);
          line++;
          if (line >= codeLines.length) clearInterval(showLines);
        }, 180);
      }
    }, 60);
    return () => clearInterval(typeUrl);
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden"
      style={{ background: "linear-gradient(160deg,#0A0F1E 60%,#0D1929 100%)" }}
    >
      {/* Background glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle,rgba(0,212,255,0.06) 0%,transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT — Copy */}
          <div className="flex flex-col gap-6">
            <Badge
              className="w-fit px-3 py-1 text-xs font-semibold tracking-wider uppercase"
              style={{ background: "rgba(0,212,255,0.1)", color: "#00D4FF", border: "1px solid rgba(0,212,255,0.2)" }}
            >
              🧬 Website Intelligence Platform
            </Badge>

            <h1 className="text-5xl lg:text-6xl font-black leading-tight tracking-tight" style={{ color: "#F0F4FF" }}>
              Decode Any<br />
              <span
                style={{
                  background: "linear-gradient(90deg,#00D4FF,#0095B3)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Website.
              </span>
              <br />
              Automate<br />Everything.
            </h1>

            <p className="text-lg leading-relaxed max-w-xl" style={{ color: "#6B7FA3" }}>
              WebGenome crawls any website — public <em>or</em> authenticated — maps every DOM element,
              workflow, and API call, and delivers structured intelligence for automation, testing, and AI agents.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                size="lg"
                className="px-8 font-bold text-base"
                style={{
                  background: "linear-gradient(135deg,#00D4FF,#0080A6)",
                  color: "#0A0F1E",
                  border: "none",
                }}
              >
                Start Free Crawl →
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 font-semibold text-base"
                style={{ borderColor: "#1E2D4A", color: "#6B7FA3", background: "transparent" }}
              >
                ▶ See How It Works
              </Button>
            </div>

            {/* Stats row */}
            <div className="flex gap-8 pt-4">
              {[
                { val: "50K+", label: "Pages crawled" },
                { val: "120+", label: "DOM elements/page" },
                { val: "3", label: "Export formats" },
              ].map(({ val, label }) => (
                <div key={label}>
                  <div className="text-2xl font-black" style={{ color: "#00D4FF" }}>{val}</div>
                  <div className="text-xs" style={{ color: "#6B7FA3" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Animated terminal */}
          <div
            className="rounded-2xl overflow-hidden shadow-2xl border"
            style={{ background: "#0D1929", borderColor: "#1E2D4A" }}
          >
            {/* Terminal title bar */}
            <div
              className="flex items-center gap-2 px-4 py-3 border-b"
              style={{ background: "#111827", borderColor: "#1E2D4A" }}
            >
              <span className="w-3 h-3 rounded-full bg-red-500 opacity-80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500 opacity-80" />
              <span className="w-3 h-3 rounded-full bg-green-500 opacity-80" />
              <span className="ml-4 text-xs font-mono" style={{ color: "#6B7FA3" }}>
                webgenome — crawl output
              </span>
            </div>

            {/* URL input row */}
            <div
              className="flex items-center gap-3 px-4 py-3 border-b"
              style={{ background: "#0A0F1E", borderColor: "#1E2D4A" }}
            >
              <span className="text-xs font-mono" style={{ color: "#6B7FA3" }}>URL →</span>
              <span className="font-mono text-sm" style={{ color: "#00D4FF" }}>
                {urlText}
                <span className="animate-pulse">|</span>
              </span>
            </div>

            {/* Output lines */}
            <div className="p-4 font-mono text-xs leading-6 min-h-[280px]">
              {codeLines.slice(0, visibleLines).map((line, i) => (
                <div
                  key={i}
                  className="transition-all duration-200"
                  style={{
                    color: line.includes('"') ? "#00E5A0" : "#F0F4FF",
                    opacity: 1,
                  }}
                >
                  {line}
                </div>
              ))}
              {visibleLines < codeLines.length && visibleLines > 0 && (
                <span className="animate-pulse" style={{ color: "#00D4FF" }}>▋</span>
              )}
            </div>

            {/* Status bar */}
            <div
              className="flex items-center justify-between px-4 py-2 border-t text-xs font-mono"
              style={{ background: "#111827", borderColor: "#1E2D4A", color: "#6B7FA3" }}
            >
              <span>✓ 1 page extracted</span>
              <span style={{ color: "#00E5A0" }}>● LIVE</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
