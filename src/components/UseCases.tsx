"use client";
import { useState } from "react";

const cases = [
  {
    tab: "QA & Testing",
    icon: "🧪",
    headline: "Stop writing selectors. Start shipping tests.",
    body: "WebGenome automatically extracts every button, form, and input — with XPath and CSS selectors pre-generated. Feed them directly into your test suite. When UI changes, Monitor alerts your team before tests break.",
    bullets: ["Auto-generate Playwright / Selenium / Cypress scripts", "XPath + CSS selector for every element", "DOM change alerts before test failures"],
  },
  {
    tab: "AI Agents",
    icon: "🤖",
    headline: "Give your AI agent a map of the internet.",
    body: "AI agents fail because they navigate websites blindly. WebGenome gives them a structured memory layer — selectors, workflows, state sequences — so agents navigate reliably on the first attempt, every time.",
    bullets: ["Pre-mapped selectors for every page action", "Complete workflow state machines", "JSON format compatible with any LLM agent framework"],
  },
  {
    tab: "RPA Automation",
    icon: "⚙️",
    headline: "Map workflows in minutes, not weeks.",
    body: "Traditional RPA setup requires consultants and weeks of manual workflow mapping. WebGenome discovers workflows automatically — login flows, checkout sequences, form submissions — and exports them ready for UiPath, Make, or Zapier.",
    bullets: ["Automatic workflow discovery", "Export to UiPath / Make / Zapier formats", "Re-crawl on schedule to keep automations current"],
  },
  {
    tab: "Competitive Intel",
    icon: "🔍",
    headline: "Map your competitor's entire UX.",
    body: "See exactly how competitors structure their checkout, onboarding, pricing, and feature pages. Track changes weekly. Know when they redesign their CTA, add a new feature page, or change their API structure.",
    bullets: ["Full competitor site structure maps", "Weekly change tracking", "Side-by-side DOM comparison"],
  },
  {
    tab: "Enterprise Docs",
    icon: "🏢",
    headline: "Auto-document any legacy system.",
    body: "Enterprise teams spend months documenting internal tools and portals. WebGenome crawls authenticated internal systems and generates complete structural documentation — every page, every form, every workflow — automatically.",
    bullets: ["Authenticated internal system crawling", "Auto-generated structural documentation", "Exportable to Confluence, Notion, PDF"],
  },
];

export default function UseCases() {
  const [active, setActive] = useState(0);
  const item = cases[active];

  return (
    <section id="use-cases" className="py-24 px-6" style={{ background: "#0D1929" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-4xl font-black mb-4" style={{ color: "#F0F4FF" }}>
            Built for every team<br />that touches the web
          </h2>
        </div>

        {/* Tab bar */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {cases.map(({ tab, icon }, i) => (
            <button
              key={tab}
              onClick={() => setActive(i)}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border"
              style={{
                background: active === i ? "rgba(0,212,255,0.1)" : "transparent",
                borderColor: active === i ? "#00D4FF" : "#1E2D4A",
                color: active === i ? "#00D4FF" : "#6B7FA3",
              }}
            >
              {icon} {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div
          className="rounded-2xl border p-10 grid md:grid-cols-2 gap-10 items-center"
          style={{ background: "#111827", borderColor: "#1E2D4A" }}
        >
          <div>
            <div className="text-5xl mb-6">{item.icon}</div>
            <h3 className="text-2xl font-black mb-4" style={{ color: "#F0F4FF" }}>{item.headline}</h3>
            <p className="leading-relaxed mb-6" style={{ color: "#6B7FA3" }}>{item.body}</p>
            <ul className="flex flex-col gap-3">
              {item.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm" style={{ color: "#6B7FA3" }}>
                  <span style={{ color: "#00D4FF", marginTop: 2 }}>✓</span> {b}
                </li>
              ))}
            </ul>
          </div>

          {/* Code snippet preview */}
          <div
            className="rounded-xl p-6 font-mono text-xs leading-7 border"
            style={{ background: "#0A0F1E", borderColor: "#1E2D4A", color: "#00E5A0" }}
          >
            <div style={{ color: "#6B7FA3" }}>{`// ${item.tab} export`}</div>
            <div>{`{`}</div>
            <div>&nbsp;&nbsp;{`"workflow": "${item.tab.toLowerCase().replace(/ /g, "-")}",`}</div>
            <div>&nbsp;&nbsp;{`"pages_mapped": 47,`}</div>
            <div>&nbsp;&nbsp;{`"elements": 1842,`}</div>
            <div>&nbsp;&nbsp;{`"selectors": "ready",`}</div>
            <div>&nbsp;&nbsp;{`"export": ["json","csv","html"],`}</div>
            <div>&nbsp;&nbsp;<span style={{ color: "#00D4FF" }}>{`"status": "complete"`}</span></div>
            <div>{`}`}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
