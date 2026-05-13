export default function Footer() {
  const links: Record<string, string[]> = {
    Products: ["Crawl", "Auth", "Flow", "Monitor", "Test", "Agent", "API", "Mobile"],
    "Use Cases": ["QA Testing", "AI Agents", "RPA Automation", "Competitive Intel", "Enterprise"],
    Developers: ["Documentation", "API Reference", "Changelog", "Status", "GitHub"],
    Company: ["About", "Blog", "Pricing", "Privacy", "Terms"],
  };

  return (
    <footer
      className="py-16 px-6 border-t"
      style={{ background: "#0D1929", borderColor: "#1E2D4A" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm"
                style={{ background: "linear-gradient(135deg,#00D4FF,#0080A6)", color: "#0A0F1E" }}
              >
                WG
              </div>
              <span className="font-bold text-lg" style={{ color: "#F0F4FF" }}>
                Web<span style={{ color: "#00D4FF" }}>Genome</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed mb-4" style={{ color: "#6B7FA3" }}>
              The intelligence layer for every digital interface. Decode websites. Automate everything.
            </p>
            <div className="flex gap-3">
              {["𝕏", "in", "gh"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold border transition-colors"
                  style={{ borderColor: "#1E2D4A", color: "#6B7FA3", background: "#111827" }}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <div className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#F0F4FF" }}>
                {section}
              </div>
              <ul className="flex flex-col gap-2">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-xs text-[#6B7FA3] transition-colors hover:text-[#00D4FF]"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="flex flex-col md:flex-row justify-between items-center pt-8 border-t gap-4"
          style={{ borderColor: "#1E2D4A" }}
        >
          <p className="text-xs" style={{ color: "#6B7FA3" }}>
            © 2026 WebGenome. Built for the AI-first internet.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
              <a key={item} href="#" className="text-xs" style={{ color: "#6B7FA3" }}>
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
