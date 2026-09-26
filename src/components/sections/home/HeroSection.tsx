"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="max-w-[1180px] mx-auto px-7 pt-[170px] pb-[90px]">
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
        className="mb-[28px] max-w-[16ch]"
        style={{
          fontFamily: "var(--font-space-grotesk), sans-serif",
          fontSize: "clamp(48px, 8.4vw, 116px)",
          lineHeight: 0.94,
          letterSpacing: "-0.045em",
          fontWeight: 600,
          color: "#EDEDEF",
          margin: "0 0 28px",
        }}
      >
        Biraj
        <br />
        Buddhacharya<span style={{ color: "#FF6B6B" }}>.</span>
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
        className="grid gap-[44px] items-end border-t border-white/[0.08] pt-[30px]"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}
      >
        <p
          className="m-0 text-[17px] leading-[1.65] max-w-[48ch]"
          style={
            { color: "#A1A1AA", textWrap: "pretty" } as React.CSSProperties
          }
        >
          Machine learning engineer and full-stack developer. I build backends
          that think — RAG chatbots, recommendation engines and analytics
          systems — and the interfaces that make them usable.
        </p>

        <div className="flex gap-3 flex-wrap">
          <Link
            href="/projects"
            className="px-6 py-[14px] rounded-[12px] text-[13px] font-semibold transition-colors duration-200"
            style={{
              background: "#FF6B6B",
              color: "#12080A",
              fontFamily: "var(--font-jetbrains-mono), monospace",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.background = "#FF867F";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.background = "#FF6B6B";
            }}
          >
            View projects →
          </Link>
          <Link
            href="/resume"
            className="px-6 py-[14px] rounded-[12px] text-[13px] font-medium border border-white/[0.14] transition-colors duration-200"
            style={{
              color: "#EDEDEF",
              fontFamily: "var(--font-jetbrains-mono), monospace",
            }}
            onMouseEnter={(e) => {
              const el = e.target as HTMLElement;
              el.style.borderColor = "#FF6B6B";
              el.style.color = "#FF6B6B";
            }}
            onMouseLeave={(e) => {
              const el = e.target as HTMLElement;
              el.style.borderColor = "rgba(255,255,255,0.14)";
              el.style.color = "#EDEDEF";
            }}
          >
            Résumé
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
