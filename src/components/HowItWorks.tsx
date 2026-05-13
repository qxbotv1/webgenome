export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Enter any URL",
      body: "Paste any website URL — public site, authenticated dashboard, or mobile app. Optionally provide login credentials for full authenticated access.",
      icon: "🌐",
    },
    {
      num: "02",
      title: "WebGenome crawls & maps",
      body: "Our headless browser visits every accessible page, clicks every button, fills every form, and captures the complete DOM tree — including post-login workflows.",
      icon: "🧬",
    },
    {
      num: "03",
      title: "Export structured intelligence",
      body: "Download everything as JSON, CSV, or HTML. Plug directly into your automation tools, AI agents, QA pipelines, or API integrations.",
      icon: "⚡",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 px-6" style={{ background: "#0D1929" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-black mb-4" style={{ color: "#F0F4FF" }}>
            From URL to intelligence<br />in minutes
          </h2>
          <p style={{ color: "#6B7FA3" }}>Three steps. Zero manual work.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          <div
            className="hidden md:block absolute top-12 left-[20%] right-[20%] h-px"
            style={{ background: "linear-gradient(90deg,transparent,#1E2D4A,transparent)" }}
          />

          {steps.map(({ num, title, body, icon }) => (
            <div key={num} className="flex flex-col items-center text-center gap-4">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-3xl border-2 relative z-10"
                style={{ background: "#111827", borderColor: "#00D4FF" }}
              >
                {icon}
              </div>
              <div className="text-xs font-black tracking-widest uppercase" style={{ color: "#00D4FF" }}>
                Step {num}
              </div>
              <h3 className="text-xl font-bold" style={{ color: "#F0F4FF" }}>{title}</h3>
              <p className="text-sm leading-relaxed max-w-xs" style={{ color: "#6B7FA3" }}>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
