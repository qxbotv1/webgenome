export default function TrustBar() {
  const stats = [
    { val: "QA Teams", desc: "Auto test generation" },
    { val: "AI Startups", desc: "Website memory layer" },
    { val: "RPA Agencies", desc: "Workflow automation" },
    { val: "Enterprises", desc: "Legacy documentation" },
    { val: "Developers", desc: "API integrations" },
  ];

  return (
    <section
      className="py-12 border-y"
      style={{ borderColor: "#1E2D4A", background: "#0D1929" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-sm mb-8 uppercase tracking-widest font-semibold" style={{ color: "#6B7FA3" }}>
          Trusted by teams building the AI-first internet
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          {stats.map(({ val, desc }) => (
            <div
              key={val}
              className="flex items-center gap-3 px-6 py-3 rounded-xl border"
              style={{ background: "#111827", borderColor: "#1E2D4A" }}
            >
              <div className="w-2 h-2 rounded-full" style={{ background: "#00D4FF" }} />
              <div>
                <div className="text-sm font-bold" style={{ color: "#F0F4FF" }}>{val}</div>
                <div className="text-xs" style={{ color: "#6B7FA3" }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
