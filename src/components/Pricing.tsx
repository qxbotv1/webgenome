const PLANS = [
  {
    name: "Starter", price: "$49", period: "/month",
    desc: "For freelancers and small teams",
    features: ["5 crawls/month", "500 pages/crawl", "JSON + CSV exports", "Screenshots", "Email support"],
    cta: "Start Free Trial", hot: false,
  },
  {
    name: "Pro", price: "$299", period: "/month",
    desc: "For agencies, AI startups, and growing teams",
    features: ["50 crawls/month", "5,000 pages/crawl", "All export formats", "Authenticated crawling", "DOM Monitor", "Workflow maps", "API access", "Priority support"],
    cta: "Start Free Trial", hot: true,
  },
  {
    name: "Enterprise", price: "Custom", period: "",
    desc: "For large teams needing the full stack",
    features: ["Unlimited crawls", "Unlimited pages", "Role-based crawling", "SAML / SSO auth", "Dedicated infra", "SLA guarantee", "Slack + custom integrations"],
    cta: "Contact Sales", hot: false,
  },
  {
    name: "API", price: "$0.50", period: "/crawl",
    desc: "For developers integrating crawl intelligence",
    features: ["Pay-as-you-go", "Full REST API", "No commitment", "JSON responses", "Webhook support"],
    cta: "Get API Key", hot: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6" style={{ background: "#080D1A" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-4xl font-black mb-4" style={{ color: "#EFF4FF" }}>
            Simple, transparent pricing
          </h2>
          <p style={{ color: "#8A9FBF" }}>Start free. No credit card required. Cancel anytime.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PLANS.map(({ name, price, period, desc, features, cta, hot }) => (
            <div
              key={name}
              className="relative flex flex-col p-7 rounded-2xl border gap-6"
              style={{
                background: hot ? "linear-gradient(160deg,#0E1E33,#0A1728)" : "#0D1525",
                borderColor: hot ? "#00D4FF" : "#1E2F4A",
                boxShadow: hot ? "0 0 50px rgba(0,212,255,0.08), inset 0 1px 0 rgba(0,212,255,0.15)" : "none",
              }}
            >
              {hot && (
                <div
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[11px] font-black uppercase tracking-wider"
                  style={{ background: "linear-gradient(135deg,#00D4FF,#0080A6)", color: "#080D1A" }}
                >
                  Most Popular
                </div>
              )}

              <div>
                <div className="font-bold text-base mb-1.5" style={{ color: "#EFF4FF" }}>{name}</div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span
                    className="text-3xl font-black"
                    style={{ color: hot ? "#00D4FF" : "#EFF4FF" }}
                  >
                    {price}
                  </span>
                  {period && <span className="text-sm" style={{ color: "#4A6080" }}>{period}</span>}
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "#8A9FBF" }}>{desc}</p>
              </div>

              <ul className="flex flex-col gap-2.5 flex-1">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-xs" style={{ color: "#8A9FBF" }}>
                    <span className="shrink-0 font-bold mt-0.5" style={{ color: hot ? "#00D4FF" : "#4A6080" }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className="w-full py-3 rounded-xl text-sm font-bold transition-all duration-150 hover:opacity-90"
                style={
                  hot
                    ? { background: "linear-gradient(135deg,#00D4FF,#0080A6)", color: "#080D1A" }
                    : { background: "#141F33", color: "#8A9FBF", border: "1px solid #1E2F4A" }
                }
              >
                {cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
