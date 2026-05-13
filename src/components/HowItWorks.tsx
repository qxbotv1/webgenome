export default function HowItWorks() {
  const steps = [
    {
      n: "01",
      icon: "🌐",
      title: "Enter any URL",
      body: "Paste any URL — public site, authenticated portal, or SaaS dashboard. Add login credentials for full post-login access.",
    },
    {
      n: "02",
      icon: "🧬",
      title: "We crawl & map everything",
      body: "Our headless browser visits every page, clicks every element, and captures the complete DOM tree — including authenticated workflows.",
    },
    {
      n: "03",
      icon: "⚡",
      title: "Export structured intelligence",
      body: "Download as JSON, CSV, or HTML. Plug directly into AI agents, QA pipelines, RPA tools, or your own API integrations.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-24 px-6"
      style={{ background: "#0D1525" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-4xl font-black mb-4" style={{ color: "#EFF4FF" }}>
            From URL to intelligence<br />in minutes
          </h2>
          <p style={{ color: "#8A9FBF" }}>Three steps. Zero manual work.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map(({ n, icon, title, body }, i) => (
            <div
              key={n}
              className="relative p-8 rounded-2xl border flex flex-col gap-5"
              style={{ background: "#111C2E", borderColor: "#1E2F4A" }}
            >
              {/* Step number + connector */}
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black border-2 shrink-0"
                  style={{ borderColor: "#00D4FF", color: "#00D4FF", background: "rgba(0,212,255,0.08)" }}
                >
                  {n}
                </div>
                {i < 2 && (
                  <div className="hidden md:block flex-1 h-px" style={{ background: "linear-gradient(90deg,#1E2F4A,transparent)" }} />
                )}
              </div>

              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ background: "#1A2840" }}
              >
                {icon}
              </div>

              <div>
                <h3 className="font-bold text-lg mb-2" style={{ color: "#EFF4FF" }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#8A9FBF" }}>{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
