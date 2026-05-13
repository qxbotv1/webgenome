export default function TrustBar() {
  const items = [
    { icon: "🧪", label: "QA Teams" },
    { icon: "🤖", label: "AI Startups" },
    { icon: "⚙️", label: "RPA Agencies" },
    { icon: "🏢", label: "Enterprises" },
    { icon: "👨‍💻", label: "Developers" },
    { icon: "🔍", label: "SEO Agencies" },
  ];

  return (
    <div
      className="py-10 border-y"
      style={{ background: "#0D1525", borderColor: "#1E2F4A" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <p
          className="text-center text-xs font-bold uppercase tracking-[0.18em] mb-7"
          style={{ color: "#4A6080" }}
        >
          Trusted by teams building the AI-first internet
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {items.map(({ icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-full border"
              style={{ background: "#141F33", borderColor: "#1E2F4A" }}
            >
              <span className="text-base">{icon}</span>
              <span className="text-sm font-semibold" style={{ color: "#8A9FBF" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
