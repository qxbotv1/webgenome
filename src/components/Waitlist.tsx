"use client";

import { useState } from "react";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");
  const [msg, setMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) { setStatus("error"); setMsg("Enter a valid email."); return; }
    setStatus("loading");
    try {
      const r = await fetch("/api/waitlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const d = await r.json();
      if (r.ok) { setStatus("success"); setEmail(""); }
      else { setStatus("error"); setMsg(d.error || "Something went wrong."); }
    } catch { setStatus("error"); setMsg("Network error. Try again."); }
  };

  return (
    <section
      id="waitlist"
      className="py-28 px-6 relative overflow-hidden"
      style={{ background: "#080D1A" }}
    >
      {/* Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,212,255,0.05) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-xl mx-auto text-center">
        {/* Label */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest mb-7"
          style={{ background: "rgba(0,212,255,0.06)", borderColor: "rgba(0,212,255,0.2)", color: "#00D4FF" }}
        >
          🚀 Early Access
        </div>

        <h2 className="text-4xl font-black mb-5 leading-tight" style={{ color: "#EFF4FF" }}>
          Be first to decode<br />
          <span className="glow-text">the entire web.</span>
        </h2>

        <p className="text-base mb-10 leading-relaxed" style={{ color: "#8A9FBF" }}>
          Join the waitlist for priority onboarding, founding member pricing,
          and direct input into the product roadmap.
        </p>

        {/* Perks */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-10">
          {["🔒 Founding pricing", "⚡ Priority access", "🎯 Shape the product", "📦 Free crawl credits"].map((p) => (
            <span
              key={p}
              className="text-xs px-3 py-1.5 rounded-full border font-medium"
              style={{ background: "#0D1525", borderColor: "#1E2F4A", color: "#8A9FBF" }}
            >
              {p}
            </span>
          ))}
        </div>

        {/* Form / Success */}
        {status === "success" ? (
          <div
            className="rounded-2xl border px-8 py-10"
            style={{ background: "rgba(0,229,160,0.05)", borderColor: "rgba(0,229,160,0.25)" }}
          >
            <div className="text-4xl mb-4">🎉</div>
            <div className="text-xl font-black mb-2" style={{ color: "#00E5A0" }}>You&apos;re on the list!</div>
            <p className="text-sm" style={{ color: "#8A9FBF" }}>
              We&apos;ll reach out as soon as early access opens. Watch your inbox.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }}
              className="flex-1 px-5 py-3.5 rounded-xl text-sm border outline-none transition-all"
              style={{
                background: "#0D1525",
                borderColor: status === "error" ? "#FF4D6A" : "#1E2F4A",
                color: "#EFF4FF",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#00D4FF")}
              onBlur={(e) => (e.currentTarget.style.borderColor = status === "error" ? "#FF4D6A" : "#1E2F4A")}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-7 py-3.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg,#00D4FF,#0080A6)", color: "#080D1A", opacity: status === "loading" ? 0.7 : 1 }}
            >
              {status === "loading" ? "Joining…" : "Join Waitlist →"}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="text-xs mt-3" style={{ color: "#FF4D6A" }}>{msg}</p>
        )}
        <p className="text-xs mt-5" style={{ color: "#4A6080" }}>No spam. No credit card. Unsubscribe anytime.</p>
      </div>
    </section>
  );
}
