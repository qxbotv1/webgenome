"use client";

const PRODUCTS = [
  { icon: "🕷️", name: "Crawl", full: "WebGenome Crawl", desc: "Full site DOM extraction — every page, element, selector. Public and authenticated.", status: "Available", sc: "#00D4FF" },
  { icon: "🔐", name: "Auth", full: "WebGenome Auth", desc: "Authenticated crawl — login, sessions, MFA, OTP, role-based access.", status: "Available", sc: "#00D4FF" },
  { icon: "🗺️", name: "Flow", full: "WebGenome Flow", desc: "Visual workflow maps — auto-detect user journeys as interactive graphs.", status: "Beta", sc: "#00E5A0" },
  { icon: "📡", name: "Monitor", full: "WebGenome Monitor", desc: "Daily DOM change detection — instant alerts when UI, selectors, or APIs change.", status: "Beta", sc: "#00E5A0" },
  { icon: "🧪", name: "Test", full: "WebGenome Test", desc: "Auto-generate Playwright, Selenium, and Cypress test scripts instantly.", status: "Coming Soon", sc: "#8A9FBF" },
  { icon: "🤖", name: "Agent", full: "WebGenome Agent", desc: "AI website memory layer — reliable navigation for any LLM agent.", status: "Coming Soon", sc: "#8A9FBF" },
  { icon: "⚡", name: "API", full: "WebGenome API", desc: "REST API — integrate crawl intelligence into any pipeline or workflow.", status: "Coming Soon", sc: "#8A9FBF" },
  { icon: "📱", name: "Mobile", full: "WebGenome Mobile", desc: "Android & iOS app intelligence via Appium — same power, native apps.", status: "Roadmap", sc: "#4A6080" },
];

export default function Products() {
  return (
    <section id="products" className="py-24 px-6" style={{ background: "#080D1A" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-black mb-4" style={{ color: "#EFF4FF" }}>
            One platform.<br />Eight products.
          </h2>
          <p style={{ color: "#8A9FBF" }}>
            Start with Crawl. Expand into the full intelligence stack as you grow.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRODUCTS.map(({ icon, full, desc, status, sc }) => (
            <div
              key={full}
              className="group p-6 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col gap-4"
              style={{ background: "#0D1525", borderColor: "#1E2F4A" }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = "rgba(0,212,255,0.35)";
                el.style.background = "#111C2E";
                el.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = "#1E2F4A";
                el.style.background = "#0D1525";
                el.style.transform = "translateY(0)";
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ background: "#141F33" }}
              >
                {icon}
              </div>

              <div className="flex flex-col gap-1.5 flex-1">
                <div className="text-sm font-bold" style={{ color: "#EFF4FF" }}>{full}</div>
                <p className="text-xs leading-relaxed" style={{ color: "#8A9FBF" }}>{desc}</p>
              </div>

              <div
                className="inline-flex w-fit items-center px-2.5 py-1 rounded-full text-[11px] font-bold border"
                style={{ background: `${sc}12`, color: sc, borderColor: `${sc}30` }}
              >
                {status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
