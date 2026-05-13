"use client";

import { useState } from "react";

const CASES = [
  {
    tab: "QA & Testing", icon: "🧪",
    headline: "Stop writing selectors. Start shipping tests.",
    body: "WebGenome auto-extracts every button, form, and input with XPath and CSS selectors pre-generated. Feed them straight into your test suite. When UI changes, Monitor alerts your team before anything breaks.",
    bullets: ["Auto-generate Playwright / Selenium / Cypress scripts", "XPath + CSS selector for every element", "DOM change alerts before test failures"],
    snippet: `// QA & Testing export\n{\n  "page": "/checkout",\n  "selectors": [\n    { "element": "Place Order btn",\n      "css": "#btn-place-order",\n      "xpath": "//button[@id='btn']" },\n    { "element": "Email input",\n      "css": "input[name='email']" }\n  ],\n  "status": "export_ready"\n}`,
  },
  {
    tab: "AI Agents", icon: "🤖",
    headline: "Give your AI agent a map of the internet.",
    body: "AI agents fail because they navigate websites blindly. WebGenome provides a structured memory layer — selectors, workflows, state sequences — so agents navigate reliably on the first attempt.",
    bullets: ["Pre-mapped selectors for every page action", "Complete workflow state machines", "JSON compatible with any LLM agent framework"],
    snippet: `// AI Agent memory format\n{\n  "site": "shopify-store.com",\n  "workflows": [\n    { "name": "checkout",\n      "steps": 5,\n      "selectors": "ready",\n      "state_map": "complete" }\n  ],\n  "agent_ready": true\n}`,
  },
  {
    tab: "RPA Automation", icon: "⚙️",
    headline: "Map workflows in minutes, not weeks.",
    body: "Traditional RPA setup takes weeks of manual mapping. WebGenome discovers workflows automatically — login flows, checkout sequences, form submissions — exported ready for UiPath, Make, or Zapier.",
    bullets: ["Automatic workflow discovery", "Export to UiPath / Make / Zapier", "Re-crawl on schedule to stay current"],
    snippet: `// RPA workflow export\n{\n  "workflow": "user-checkout",\n  "steps": [\n    { "action": "click", "selector": "#cart-btn" },\n    { "action": "fill",  "field": "email" },\n    { "action": "click", "selector": "#pay-btn" }\n  ]\n}`,
  },
  {
    tab: "Competitive Intel", icon: "🔍",
    headline: "Map your competitor's entire UX.",
    body: "See exactly how competitors structure their checkout, onboarding, and feature pages. Track changes weekly. Know when they redesign a CTA, add a feature page, or change their API structure.",
    bullets: ["Full competitor site structure maps", "Weekly change tracking", "Side-by-side DOM comparison"],
    snippet: `// Competitor snapshot diff\n{\n  "site": "competitor.com",\n  "scan_date": "2026-05-13",\n  "changes": [\n    { "page": "/pricing",\n      "change": "CTA text updated",\n      "old": "Get Started",\n      "new": "Start Free Trial" }\n  ]\n}`,
  },
  {
    tab: "Enterprise Docs", icon: "🏢",
    headline: "Auto-document any legacy system.",
    body: "Enterprise teams spend months documenting internal tools. WebGenome crawls authenticated internal portals and generates complete structural docs — every page, form, and workflow — automatically.",
    bullets: ["Authenticated internal system crawling", "Auto-generated structural documentation", "Export to Confluence, Notion, or PDF"],
    snippet: `// Internal portal docs\n{\n  "system": "hr-portal.internal",\n  "pages": 142,\n  "forms": 38,\n  "workflows": 12,\n  "auth": "role-based",\n  "export": "confluence_ready"\n}`,
  },
];

export default function UseCases() {
  const [active, setActive] = useState(0);
  const c = CASES[active];

  return (
    <section
      id="use-cases"
      className="py-24 px-6"
      style={{ background: "#0D1525" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-4xl font-black mb-4" style={{ color: "#EFF4FF" }}>
            Built for every team<br />that touches the web
          </h2>
        </div>

        {/* Tab bar */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CASES.map(({ tab, icon }, i) => (
            <button
              key={tab}
              onClick={() => setActive(i)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-150"
              style={{
                background: active === i ? "rgba(0,212,255,0.1)" : "transparent",
                borderColor: active === i ? "#00D4FF" : "#1E2F4A",
                color: active === i ? "#00D4FF" : "#8A9FBF",
              }}
            >
              <span>{icon}</span> {tab}
            </button>
          ))}
        </div>

        {/* Content panel */}
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ background: "#111C2E", borderColor: "#1E2F4A" }}
        >
          <div className="grid md:grid-cols-2">
            {/* Left */}
            <div className="p-10 flex flex-col gap-5 border-r" style={{ borderColor: "#1E2F4A" }}>
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                style={{ background: "#1A2840" }}
              >
                {c.icon}
              </div>
              <h3 className="text-2xl font-black leading-tight" style={{ color: "#EFF4FF" }}>
                {c.headline}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#8A9FBF" }}>{c.body}</p>
              <ul className="flex flex-col gap-3 mt-2">
                {c.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-sm" style={{ color: "#8A9FBF" }}>
                    <span className="mt-0.5 shrink-0 font-bold" style={{ color: "#00D4FF" }}>✓</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right - code */}
            <div
              className="p-8 font-mono text-xs leading-7 overflow-auto"
              style={{ background: "#080D1A" }}
            >
              {c.snippet.split("\n").map((line, i) => {
                const color = line.includes("//") ? "#4A6080"
                  : line.includes('"status"') || line.includes('"agent_ready"') || line.includes('"export"') ? "#00D4FF"
                  : line.includes('"') ? "#00E5A0"
                  : "#EFF4FF";
                return <div key={i} style={{ color }}>{line || "\u00A0"}</div>;
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
