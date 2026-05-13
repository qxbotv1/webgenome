import { Badge } from "@/components/ui/badge";

const products = [
  { icon: "🕷️", name: "WebGenome Crawl", desc: "Full site DOM extraction — every page, every element, every selector. Public and authenticated.", status: "Available", color: "#00D4FF" },
  { icon: "🔐", name: "WebGenome Auth", desc: "Authenticated crawl engine — login, sessions, MFA, role-based access, OTP handling.", status: "Available", color: "#00D4FF" },
  { icon: "🗺️", name: "WebGenome Flow", desc: "Visual workflow maps — auto-detect user journeys as interactive clickable graphs.", status: "Beta", color: "#00E5A0" },
  { icon: "📡", name: "WebGenome Monitor", desc: "Daily DOM change detection — instant alerts when UI, selectors, or APIs change.", status: "Beta", color: "#00E5A0" },
  { icon: "🧪", name: "WebGenome Test", desc: "Auto-generate Playwright, Selenium, and Cypress test scripts from any crawled site.", status: "Coming Soon", color: "#6B7FA3" },
  { icon: "🤖", name: "WebGenome Agent", desc: "AI website memory layer — give any LLM agent reliable navigation of any website.", status: "Coming Soon", color: "#6B7FA3" },
  { icon: "⚡", name: "WebGenome API", desc: "Developer API — integrate crawl intelligence into any pipeline with REST endpoints.", status: "Coming Soon", color: "#6B7FA3" },
  { icon: "📱", name: "WebGenome Mobile", desc: "Android & iOS app intelligence — same DOM extraction power, now for native apps.", status: "Roadmap", color: "#4A5568" },
];

export default function Products() {
  return (
    <section id="products" className="py-24 px-6" style={{ background: "#0A0F1E" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-black mb-4" style={{ color: "#F0F4FF" }}>
            One platform.<br />Eight products.
          </h2>
          <p style={{ color: "#6B7FA3" }}>
            Start with Crawl. Expand into the full intelligence stack as you grow.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map(({ icon, name, desc, status, color }) => (
            <div
              key={name}
              className="group flex cursor-pointer flex-col gap-3 rounded-2xl border border-[#1E2D4A] bg-[#111827] p-5 transition-all duration-200 hover:border-[#00D4FF33] hover:bg-[#0D1929]"
            >
              <div className="text-3xl">{icon}</div>
              <div>
                <div className="font-bold text-sm mb-1" style={{ color: "#F0F4FF" }}>{name}</div>
                <p className="text-xs leading-relaxed" style={{ color: "#6B7FA3" }}>{desc}</p>
              </div>
              <Badge
                className="w-fit text-xs px-2 py-0.5 mt-auto"
                style={{
                  background: `${color}15`,
                  color: color,
                  border: `1px solid ${color}30`,
                }}
              >
                {status}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
