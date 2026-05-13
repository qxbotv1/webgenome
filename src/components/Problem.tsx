export default function Problem() {
  const pains = [
    {
      icon: "🔴",
      title: "QA engineers waste weeks",
      body: "Writing selectors manually for every test. One UI update wipes out months of work.",
    },
    {
      icon: "🔴",
      title: "AI agents constantly fail",
      body: "Agents break because they don't know where buttons, forms, or workflows live on a site.",
    },
    {
      icon: "🔴",
      title: "RPA teams rebuild everything",
      body: "Every website redesign forces automation teams to restart from scratch. Costs thousands.",
    },
  ];

  return (
    <section id="problem" className="py-24 px-6" style={{ background: "#0A0F1E" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-black mb-4" style={{ color: "#F0F4FF" }}>
            Every automation breaks.<br />
            Every AI agent fails.
          </h2>
          <p className="text-lg" style={{ color: "#6B7FA3" }}>
            Because websites are black boxes. No map. No structure. No memory.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {pains.map(({ icon, title, body }) => (
            <div
              key={title}
              className="p-6 rounded-2xl border"
              style={{ background: "#111827", borderColor: "#1E2D4A" }}
            >
              <div className="text-3xl mb-4">{icon}</div>
              <h3 className="font-bold text-lg mb-2" style={{ color: "#F0F4FF" }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#6B7FA3" }}>{body}</p>
            </div>
          ))}
        </div>

        {/* Arrow pointing to solution */}
        <div className="text-center mt-12 text-3xl" style={{ color: "#1E2D4A" }}>↓</div>
        <p className="text-center mt-4 text-xl font-bold" style={{ color: "#00D4FF" }}>
          WebGenome makes every website machine-readable.
        </p>
      </div>
    </section>
  );
}
