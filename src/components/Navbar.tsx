"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(10,15,30,0.95)"
          : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid #1E2D4A" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm"
            style={{ background: "linear-gradient(135deg,#00D4FF,#0080A6)", color: "#0A0F1E" }}
          >
            WG
          </div>
          <span className="font-bold text-lg tracking-tight" style={{ color: "#F0F4FF" }}>
            Web<span style={{ color: "#00D4FF" }}>Genome</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {["Products", "Use Cases", "Pricing", "Docs", "Blog"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(" ", "-")}`}
              className="text-sm text-[#6B7FA3] transition-colors hover:text-[#00D4FF]"
            >
              {item}
            </a>
          ))}
        </div>

        {/* CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm" style={{ color: "#6B7FA3" }}>
            Sign In
          </Button>
          <Button
            size="sm"
            style={{
              background: "linear-gradient(135deg,#00D4FF,#0080A6)",
              color: "#0A0F1E",
              fontWeight: 700,
              border: "none",
            }}
          >
            Start Free Crawl
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block w-5 h-0.5 rounded transition-all"
              style={{ background: "#00D4FF" }}
            />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden px-6 pb-6 flex flex-col gap-4"
          style={{ background: "rgba(10,15,30,0.98)", borderBottom: "1px solid #1E2D4A" }}
        >
          {["Products", "Use Cases", "Pricing", "Docs", "Blog"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm text-[#6B7FA3]"
            >
              {item}
            </a>
          ))}
          <Button
            style={{
              background: "linear-gradient(135deg,#00D4FF,#0080A6)",
              color: "#0A0F1E",
              fontWeight: 700,
              border: "none",
            }}
          >
            Start Free Crawl
          </Button>
        </div>
      )}
    </nav>
  );
}
