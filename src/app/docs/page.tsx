const sections = [
  {
    title: "Quickstart",
    body: "Create a crawl, pass a URL, and receive structured page intelligence with selectors, screenshots, workflows, and export metadata.",
    items: ["Create a project", "Add a target URL", "Run a crawl", "Export JSON or CSV"],
  },
  {
    title: "Authenticated Crawls",
    body: "Model login steps, session handling, MFA prompts, and role-based workflows before mapping private product surfaces.",
    items: ["Credential vault", "Session replay", "OTP handoff", "Role scopes"],
  },
  {
    title: "API Reference",
    body: "Use REST endpoints and webhooks to trigger crawls from CI, RPA tools, QA pipelines, or internal automation systems.",
    items: ["POST /crawl", "GET /crawl/:id", "GET /exports/:id", "Webhook events"],
  },
];

export default function DocsPage() {
  return (
    <main className="pt-16">
      <section className="px-6 py-24" style={{ background: "#080D1A" }}>
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <div
              className="mx-auto mb-6 inline-flex rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-widest"
              style={{
                background: "rgba(0,212,255,0.08)",
                borderColor: "rgba(0,212,255,0.24)",
                color: "#00D4FF",
              }}
            >
              Documentation
            </div>
            <h1 className="mb-5 text-4xl font-black leading-tight" style={{ color: "#EFF4FF" }}>
              Build on WebGenome without guessing.
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: "#A9BCE0" }}>
              Developer guides for crawls, auth flows, exports, monitoring, and
              automation-ready website intelligence.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {sections.map(({ title, body, items }) => (
              <article
                key={title}
                className="rounded-2xl border p-7"
                style={{
                  background: "#0D1525",
                  borderColor: "#263B5D",
                  boxShadow: "0 16px 50px rgba(0,0,0,0.18)",
                }}
              >
                <h2 className="mb-3 text-xl font-black" style={{ color: "#EFF4FF" }}>
                  {title}
                </h2>
                <p className="mb-6 text-sm leading-relaxed" style={{ color: "#A9BCE0" }}>
                  {body}
                </p>
                <ul className="flex flex-col gap-3">
                  {items.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm" style={{ color: "#A9BCE0" }}>
                      <span style={{ color: "#00D4FF" }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div
            className="mt-6 rounded-2xl border p-8"
            style={{ background: "#111C2E", borderColor: "#263B5D" }}
          >
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <h2 className="mb-3 text-2xl font-black" style={{ color: "#EFF4FF" }}>
                  Example crawl response
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: "#A9BCE0" }}>
                  The API returns machine-readable selectors, forms, workflows,
                  screenshots, and export links for downstream automation.
                </p>
              </div>
              <pre
                className="overflow-auto rounded-xl border p-5 text-xs leading-6"
                style={{ background: "#080D1A", borderColor: "#263B5D", color: "#00E5A0" }}
              >{`{
  "crawl_id": "crwl_9x28",
  "site": "example.com",
  "pages": 47,
  "elements": 1842,
  "exports": ["json", "csv", "html"],
  "status": "ready"
}`}</pre>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
