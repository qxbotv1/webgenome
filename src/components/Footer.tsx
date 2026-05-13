import Link from "next/link";

const LINKS = {
  Products: [
    { label: "Crawl", href: "/products" },
    { label: "Auth", href: "/products" },
    { label: "Flow", href: "/products" },
    { label: "Monitor", href: "/products" },
    { label: "Test", href: "/products" },
    { label: "Agent", href: "/products" },
    { label: "API", href: "/products" },
    { label: "Mobile", href: "/products" },
  ],
  "Use Cases": [
    { label: "QA Testing", href: "/use-cases" },
    { label: "AI Agents", href: "/use-cases" },
    { label: "RPA Automation", href: "/use-cases" },
    { label: "Competitive Intel", href: "/use-cases" },
    { label: "Enterprise", href: "/use-cases" },
  ],
  Developers: [
    { label: "Documentation", href: "/docs" },
    { label: "API Reference", href: "/docs" },
    { label: "Changelog", href: "/docs" },
    { label: "Status", href: "/docs" },
    { label: "GitHub", href: "/docs" },
  ],
  Company: [
    { label: "About", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "Pricing", href: "/pricing" },
    { label: "Privacy", href: "/docs" },
    { label: "Terms", href: "/docs" },
  ],
};

export default function Footer() {
  return (
    <footer
      className="pt-16 pb-10 px-6 border-t"
      style={{ background: "#0D1525", borderColor: "#1E2F4A" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 pb-12 border-b" style={{ borderColor: "#1E2F4A" }}>

          {/* Brand */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black"
                style={{ background: "linear-gradient(135deg,#00D4FF,#0070A0)", color: "#080D1A" }}
              >
                WG
              </div>
              <span className="font-bold text-base" style={{ color: "#EFF4FF" }}>
                Web<span style={{ color: "#00D4FF" }}>Genome</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "#4A6080" }}>
              The intelligence layer for every digital interface. Decode websites. Automate everything.
            </p>
            <div className="flex gap-2 mt-1">
              {[{ l: "𝕏", h: "#" }, { l: "in", h: "#" }, { l: "gh", h: "#" }].map(({ l, h }) => (
                <a
                  key={l}
                  href={h}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold border transition-all hover:border-[#00D4FF] hover:text-[#00D4FF]"
                  style={{ borderColor: "#1E2F4A", color: "#4A6080", background: "#141F33" }}
                >
                  {l}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([section, items]) => (
            <div key={section}>
              <div
                className="text-xs font-black uppercase tracking-widest mb-5"
                style={{ color: "#EFF4FF" }}
              >
                {section}
              </div>
              <ul className="flex flex-col gap-3">
                {items.map(({ label, href }) => (
                  <li key={`${section}-${label}`}>
                    <Link
                      href={href}
                      className="text-xs text-[#4A6080] transition-colors hover:text-[#00D4FF]"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8">
          <p className="text-xs" style={{ color: "#4A6080" }}>
            © 2026 WebGenome. Built for the AI-first internet.
          </p>
          <div className="flex gap-5">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((t) => (
              <Link key={t} href="/docs" className="text-xs text-[#4A6080] transition-colors hover:text-[#00D4FF]">
                {t}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
