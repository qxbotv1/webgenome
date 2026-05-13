"use client";

import { useState, useEffect } from "react";

const OUTPUT_LINES = [
  { text: "{", color: "#EFF4FF" },
  { text: '  "page": "/checkout",', color: "#00E5A0" },
  { text: '  "buttons": [', color: "#EFF4FF" },
  { text: '    { "text": "Place Order",', color: "#00D4FF" },
  { text: '      "css": "#btn-place-order",', color: "#8A9FBF" },
  { text: '      "xpath": "//button[@id=\'btn\']" }', color: "#8A9FBF" },
  { text: "  ],", color: "#EFF4FF" },
  { text: '  "forms": [{ "inputs": ["email","card"] }],', color: "#00E5A0" },
  { text: '  "apis": ["POST /api/order"],', color: "#00D4FF" },
  { text: '  "screenshot": "cdn.webgenome.io/..."', color: "#8A9FBF" },
  { text: "}", color: "#EFF4FF" },
];

const FULL_URL = "https://nike.com";

export default function Hero() {
  const [urlText, setUrlText] = useState("");
  const [visibleLines, setVisibleLines] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setStarted(true);
      let i = 0;
      const typeUrl = setInterval(() => {
        i++;
        setUrlText(FULL_URL.slice(0, i));
        if (i >= FULL_URL.length) {
          clearInterval(typeUrl);
          let line = 0;
          const showLines = setInterval(() => {
            line++;
            setVisibleLines(line);
            if (line >= OUTPUT_LINES.length) clearInterval(showLines);
          }, 150);
        }
      }, 55);
    }, 600);
    return () => clearTimeout(t1);
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-center pt-20 pb-20 overflow-hidden"
      style={{ background: "linear-gradient(150deg, #080D1A 55%, #0C1628 100%)" }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #00D4FF 0%, transparent 65%)", transform: "translate(30%,-30%)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #0095B3 0%, transparent 65%)", transform: "translate(-40%,40%)" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">

          {/* LEFT */}
          <div className="flex flex-col gap-7">
            {/* Badge */}
            <div
              className="inline-flex w-fit items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border"
              style={{ background: "rgba(0,212,255,0.08)", borderColor: "rgba(0,212,255,0.25)", color: "#00D4FF" }}
            >
              <span>🧬</span> Website Intelligence Platform
            </div>

            {/* Headline */}
            <h1
              className="text-[3.2rem] leading-[1.08] font-black tracking-tight lg:text-[3.8rem]"
              style={{ color: "#EFF4FF" }}
            >
              Decode Any<br />
              <span className="glow-text">Website.</span><br />
              Automate<br />Everything.
            </h1>

            {/* Sub */}
            <p className="text-lg leading-relaxed max-w-lg" style={{ color: "#8A9FBF" }}>
              WebGenome crawls any website — public <em>or</em> authenticated — maps every
              DOM element, workflow, and API call, and delivers structured intelligence
              for automation, testing, and AI agents.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <a
                href="#waitlist"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold transition-all duration-150 hover:opacity-90 hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg,#00D4FF,#0080A6)", color: "#080D1A" }}
              >
                Start Free Crawl →
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold border transition-all duration-150 hover:border-[#00D4FF] hover:text-[#00D4FF]"
                style={{ borderColor: "#1E2F4A", color: "#8A9FBF", background: "transparent" }}
              >
                ▶ See How It Works
              </a>
            </div>

            {/* Stats */}
            <div className="flex gap-10 pt-3 border-t" style={{ borderColor: "#1E2F4A" }}>
              {[
                { v: "50K+", l: "Pages crawled" },
                { v: "120+", l: "Elements / page" },
                { v: "3", l: "Export formats" },
              ].map(({ v, l }) => (
                <div key={l}>
                  <div className="text-2xl font-black" style={{ color: "#00D4FF" }}>{v}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#4A6080" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT - Terminal */}
          <div
            className="rounded-2xl overflow-hidden border shadow-2xl"
            style={{ background: "#0D1525", borderColor: "#1E2F4A", boxShadow: "0 0 80px rgba(0,212,255,0.06)" }}
          >
            {/* Title bar */}
            <div
              className="flex items-center gap-2 px-4 py-3 border-b"
              style={{ background: "#111C2E", borderColor: "#1E2F4A" }}
            >
              <span className="w-3 h-3 rounded-full" style={{ background: "#FF5F57" }} />
              <span className="w-3 h-3 rounded-full" style={{ background: "#FFBD2E" }} />
              <span className="w-3 h-3 rounded-full" style={{ background: "#28C840" }} />
              <span className="ml-3 text-xs font-mono font-medium" style={{ color: "#4A6080" }}>
                webgenome — crawl output
              </span>
              <span
                className="ml-auto text-xs font-mono font-bold px-2 py-0.5 rounded"
                style={{ background: "rgba(0,229,160,0.1)", color: "#00E5A0" }}
              >
                ● LIVE
              </span>
            </div>

            {/* URL bar */}
            <div
              className="flex items-center gap-3 px-4 py-2.5 border-b"
              style={{ background: "#080D1A", borderColor: "#1E2F4A" }}
            >
              <span className="text-xs font-mono font-bold" style={{ color: "#4A6080" }}>URL →</span>
              <span className="font-mono text-sm font-semibold" style={{ color: "#00D4FF" }}>
                {urlText || " "}
                {(!started || urlText.length < FULL_URL.length) && (
                  <span className="animate-pulse">▋</span>
                )}
              </span>
            </div>

            {/* Output */}
            <div
              className="px-4 py-5 font-mono text-[13px] leading-7 min-h-[300px]"
              style={{ background: "#0D1525" }}
            >
              {OUTPUT_LINES.slice(0, visibleLines).map((line, i) => (
                <div key={i} style={{ color: line.color }}>
                  {line.text}
                </div>
              ))}
              {visibleLines > 0 && visibleLines < OUTPUT_LINES.length && (
                <span className="animate-pulse" style={{ color: "#00D4FF" }}>▋</span>
              )}
              {visibleLines === 0 && (
                <span style={{ color: "#1E2F4A" }}>Waiting for input...</span>
              )}
            </div>

            {/* Status bar */}
            <div
              className="flex items-center justify-between px-4 py-2.5 border-t font-mono text-xs"
              style={{ background: "#111C2E", borderColor: "#1E2F4A" }}
            >
              <span style={{ color: "#4A6080" }}>
                {visibleLines > 0 ? `✓ ${visibleLines} fields extracted` : "Ready"}
              </span>
              <span style={{ color: "#8A9FBF" }}>webgenome.io</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
