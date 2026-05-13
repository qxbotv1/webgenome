const posts = [
  {
    title: "Why AI agents need website memory",
    tag: "AI Agents",
    excerpt: "Agents fail when they inspect live interfaces from scratch on every run. Structured site maps give them stable context.",
  },
  {
    title: "Selector maintenance is eating QA velocity",
    tag: "QA",
    excerpt: "The hidden cost of modern test automation is not writing tests. It is keeping brittle selectors alive after every redesign.",
  },
  {
    title: "A better crawl format for automation teams",
    tag: "Product",
    excerpt: "DOM, workflows, screenshots, API calls, and exports belong in one machine-readable intelligence layer.",
  },
];

export default function BlogPage() {
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
              WebGenome Blog
            </div>
            <h1 className="mb-5 text-4xl font-black leading-tight" style={{ color: "#EFF4FF" }}>
              Notes on crawling, automation, and AI-first interfaces.
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: "#A9BCE0" }}>
              Product thinking and technical notes from the WebGenome build.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {posts.map(({ title, tag, excerpt }) => (
              <article
                key={title}
                className="rounded-2xl border p-7 transition-all hover:-translate-y-1"
                style={{
                  background: "#0D1525",
                  borderColor: "#263B5D",
                  boxShadow: "0 16px 50px rgba(0,0,0,0.18)",
                }}
              >
                <div
                  className="mb-6 inline-flex rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-wider"
                  style={{
                    background: "rgba(0,212,255,0.08)",
                    borderColor: "rgba(0,212,255,0.24)",
                    color: "#00D4FF",
                  }}
                >
                  {tag}
                </div>
                <h2 className="mb-4 text-xl font-black leading-tight" style={{ color: "#EFF4FF" }}>
                  {title}
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: "#A9BCE0" }}>
                  {excerpt}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
