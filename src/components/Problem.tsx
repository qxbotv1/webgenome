export default function Problem() {
  const pains = [
    {
      icon: "⏳",
      title: "QA engineers waste weeks on selectors",
      body: "Every UI update breaks test suites. Teams spend more time maintaining selectors than writing actual tests.",
    },
    {
      icon: "💥",
      title: "AI agents fail on live websites",
      body: "Agents navigate blindly. They don't know where buttons, forms, or checkout flows are — so they crash and retry endlessly.",
    },
    {
      icon: "🔄",
      title: "RPA workflows break with every redesign",
      body: "Automation teams rebuild from scratch after every UI change. Costs thousands of hours across the industry every year.",
    },
  ];

  return (
    <section
      className="py-24 px-6"
      style={{ background: "#080D1A" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2
            className="text-4xl font-black leading-tight mb-5"
            style={{ color: "#EFF4FF" }}
          >
            Every automation breaks.<br />
            Every AI agent fails.
          </h2>
          <p className="text-lg" style={{ color: "#8A9FBF" }}>
            Because websites are black boxes. No map. No structure. No memory.
          </p>
        </div>

        {/* Pain cards */}
        <div className="grid md:grid-cols-3 gap-5">
          {pains.map(({ icon, title, body }) => (
            <div
              key={title}
              className="p-7 rounded-2xl border"
              style={{ background: "#0D1525", borderColor: "#1E2F4A" }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-5"
                style={{ background: "rgba(255,77,106,0.1)", border: "1px solid rgba(255,77,106,0.2)" }}
              >
                {icon}
              </div>
              <h3 className="font-bold text-base mb-3" style={{ color: "#EFF4FF" }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#8A9FBF" }}>{body}</p>
            </div>
          ))}
        </div>

        {/* Resolution bridge */}
        <div className="text-center mt-14">
          <div className="inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl border" style={{ background: "rgba(0,212,255,0.05)", borderColor: "rgba(0,212,255,0.2)" }}>
            <span className="text-lg">🧬</span>
            <span className="font-bold text-sm" style={{ color: "#00D4FF" }}>
              WebGenome makes every website machine-readable — in minutes.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
