"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(
          "You're on the list! We'll reach out as soon as early access opens.",
        );
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  return (
    <section
      id="waitlist"
      className="relative overflow-hidden px-6 py-24"
      style={{
        background:
          "radial-gradient(ellipse at center,rgba(0,212,255,0.07) 0%,transparent 58%),linear-gradient(160deg,#0A0F1E 0%,#0D1929 100%)",
      }}
    >
      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <Badge
          className="mx-auto mb-6 w-fit px-4 py-1 text-xs font-bold uppercase tracking-widest"
          style={{
            background: "rgba(0,212,255,0.1)",
            color: "#00D4FF",
            border: "1px solid rgba(0,212,255,0.2)",
          }}
        >
          Early Access
        </Badge>

        <h2
          className="mb-4 text-4xl leading-tight font-black"
          style={{ color: "#F0F4FF" }}
        >
          Be first to decode
          <br />
          <span
            style={{
              background: "linear-gradient(90deg,#00D4FF,#0095B3)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            the entire web.
          </span>
        </h2>

        <p
          className="mb-10 text-base leading-relaxed"
          style={{ color: "#6B7FA3" }}
        >
          WebGenome is in early access. Join the waitlist and get priority
          onboarding, founding member pricing, and direct input into the product
          roadmap.
        </p>

        <div className="mb-10 flex flex-wrap justify-center gap-3">
          {[
            "Founding member pricing",
            "Priority onboarding",
            "Direct product input",
            "Free crawl credits",
          ].map((perk) => (
            <span
              key={perk}
              className="rounded-full border px-3 py-1.5 text-xs"
              style={{
                background: "#111827",
                borderColor: "#1E2D4A",
                color: "#6B7FA3",
              }}
            >
              {perk}
            </span>
          ))}
        </div>

        {status === "success" ? (
          <div
            className="rounded-lg border px-8 py-10 text-center"
            style={{
              background: "rgba(0,229,160,0.05)",
              borderColor: "rgba(0,229,160,0.2)",
            }}
          >
            <div
              className="mb-2 text-lg font-bold"
              style={{ color: "#00E5A0" }}
            >
              You&apos;re on the list.
            </div>
            <p className="text-sm" style={{ color: "#6B7FA3" }}>
              {message}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "loading"}
              className="flex-1 rounded-lg border px-5 py-3 text-sm outline-none transition-all"
              style={{
                background: "#111827",
                borderColor: status === "error" ? "#EF4444" : "#1E2D4A",
                color: "#F0F4FF",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#00D4FF";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor =
                  status === "error" ? "#EF4444" : "#1E2D4A";
              }}
            />
            <Button
              type="submit"
              disabled={status === "loading"}
              className="px-8 py-3 font-bold whitespace-nowrap"
              style={{
                background: "linear-gradient(135deg,#00D4FF,#0080A6)",
                color: "#0A0F1E",
                border: "none",
                opacity: status === "loading" ? 0.7 : 1,
              }}
            >
              {status === "loading" ? "Joining..." : "Join Waitlist"}
            </Button>
          </form>
        )}

        {status === "error" && (
          <p className="mt-3 text-xs" style={{ color: "#EF4444" }}>
            {message}
          </p>
        )}

        <p className="mt-4 text-xs" style={{ color: "#4A5568" }}>
          No spam. No credit card. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
