"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const navLinks = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Products", href: "/products" },
    { label: "Use Cases", href: "/use-cases" },
    { label: "Pricing", href: "/pricing" },
    { label: "Docs", href: "/docs" },
    { label: "Blog", href: "/blog" },
  ];

  return (
    <nav
      className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(8,13,26,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid #1E2F4A" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black"
            style={{ background: "linear-gradient(135deg,#00D4FF,#0070A0)", color: "#080D1A" }}
          >
            WG
          </div>
          <span className="text-base font-bold tracking-tight" style={{ color: "#EFF4FF" }}>
            Web<span style={{ color: "#00D4FF" }}>Genome</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium transition-colors duration-150 hover:text-[#00D4FF]"
              style={{ color: pathname === href ? "#00D4FF" : "#8A9FBF" }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="#"
            className="text-sm font-medium px-4 py-2 rounded-lg text-[#8A9FBF] transition-colors hover:text-[#00D4FF]"
          >
            Sign In
          </a>
          <Link
            href="/dashboard"
            className="text-sm font-bold px-5 py-2 rounded-lg transition-all duration-150 hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#00D4FF,#0080A6)", color: "#080D1A" }}
          >
            Start Free Crawl
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 flex flex-col gap-1.5"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span className="block w-5 h-0.5 rounded" style={{ background: "#00D4FF" }} />
          <span className="block w-5 h-0.5 rounded" style={{ background: "#00D4FF" }} />
          <span className="block w-5 h-0.5 rounded" style={{ background: "#00D4FF" }} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden px-6 pt-2 pb-6 flex flex-col gap-3 border-t"
          style={{ background: "rgba(8,13,26,0.98)", borderColor: "#1E2F4A" }}
        >
          {navLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="text-sm py-2"
              style={{ color: pathname === href ? "#00D4FF" : "#8A9FBF" }}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/dashboard"
            className="text-sm font-bold px-5 py-3 rounded-lg text-center mt-2"
            style={{ background: "linear-gradient(135deg,#00D4FF,#0080A6)", color: "#080D1A" }}
            onClick={() => setOpen(false)}
          >
            Start Free Crawl
          </Link>
        </div>
      )}
    </nav>
  );
}
