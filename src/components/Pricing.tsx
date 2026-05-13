import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    name: "Starter",
    price: "$49",
    period: "/month",
    desc: "For freelancers and small teams getting started",
    features: [
      "5 crawls per month",
      "500 pages per crawl",
      "JSON + CSV exports",
      "Screenshot capture",
      "Email support",
    ],
    cta: "Start Free Trial",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$299",
    period: "/month",
    desc: "For agencies, AI startups, and growing teams",
    features: [
      "50 crawls per month",
      "5,000 pages per crawl",
      "All export formats",
      "Authenticated crawling",
      "DOM Monitor (daily scans)",
      "Workflow maps",
      "API access",
      "Priority support",
    ],
    cta: "Start Free Trial",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For large teams needing full platform access",
    features: [
      "Unlimited crawls",
      "Unlimited pages",
      "Role-based crawling",
      "SAML / SSO auth",
      "Dedicated infrastructure",
      "SLA guarantee",
      "Slack integration",
      "Custom integrations",
    ],
    cta: "Contact Sales",
    highlight: false,
  },
  {
    name: "API",
    price: "$0.50",
    period: "/crawl",
    desc: "For developers integrating crawl intelligence",
    features: [
      "Pay as you go",
      "Full REST API",
      "No monthly commitment",
      "JSON responses",
      "Webhook support",
    ],
    cta: "Get API Key",
    highlight: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6" style={{ background: "#0A0F1E" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-black mb-4" style={{ color: "#F0F4FF" }}>
            Simple, transparent pricing
          </h2>
          <p style={{ color: "#6B7FA3" }}>
            Start free. No credit card required. Cancel anytime.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map(({ name, price, period, desc, features, cta, highlight }) => (
            <div
              key={name}
              className="rounded-2xl border p-6 flex flex-col gap-5 relative"
              style={{
                background: highlight ? "linear-gradient(160deg,#0D1E30,#0A1525)" : "#111827",
                borderColor: highlight ? "#00D4FF" : "#1E2D4A",
                boxShadow: highlight ? "0 0 40px rgba(0,212,255,0.1)" : "none",
              }}
            >
              {highlight && (
                <Badge
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-bold"
                  style={{ background: "#00D4FF", color: "#0A0F1E" }}
                >
                  Most Popular
                </Badge>
              )}

              <div>
                <div className="font-bold text-lg mb-1" style={{ color: "#F0F4FF" }}>{name}</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black" style={{ color: highlight ? "#00D4FF" : "#F0F4FF" }}>
                    {price}
                  </span>
                  <span className="text-sm" style={{ color: "#6B7FA3" }}>{period}</span>
                </div>
                <p className="text-xs mt-2 leading-relaxed" style={{ color: "#6B7FA3" }}>{desc}</p>
              </div>

              <ul className="flex flex-col gap-2 flex-1">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs" style={{ color: "#6B7FA3" }}>
                    <span style={{ color: "#00D4FF", flexShrink: 0 }}>✓</span> {f}
                  </li>
                ))}
              </ul>

              <Button
                className="w-full font-bold"
                style={
                  highlight
                    ? { background: "linear-gradient(135deg,#00D4FF,#0080A6)", color: "#0A0F1E", border: "none" }
                    : { background: "transparent", borderColor: "#1E2D4A", color: "#6B7FA3" }
                }
                variant={highlight ? "default" : "outline"}
              >
                {cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
