"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="max-w-[1180px] mx-auto px-4 sm:px-7 pt-[130px] sm:pt-[150px] pb-[90px]">
      {/* Layered name + centered portrait */}
      <div className="relative mb-[28px] min-h-[420px] sm:min-h-[700px] lg:min-h-[820px]">
        {/* Accent glow behind the portrait */}
        <div
          className="absolute pointer-events-none left-1/2 sm:left-[26%] -translate-x-1/2 bottom-0 w-[78%] sm:w-[46%] max-w-[620px] h-[82%]"
          style={{
            background:
              "radial-gradient(ellipse at 50% 58%, rgba(255,107,107,0.15) 0%, transparent 70%)",
          }}
        />

        {/* Name — stacked on mobile, split left/right around the portrait on sm+ */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
          className="relative z-10 sm:z-0 m-0"
          style={{
            fontFamily: "var(--font-space-grotesk), sans-serif",
            fontSize: "clamp(50px, 8.2vw, 112px)",
            lineHeight: 0.9,
            letterSpacing: "-0.05em",
            fontWeight: 600,
            color: "#EDEDEF",
            margin: 0,
          }}
        >
          <span className="block">Biraj</span>
          <span className="block sm:absolute sm:right-0 sm:top-[0.95em] sm:whitespace-nowrap">
            Buddhacharya<span style={{ color: "#FF6B6B" }}>.</span>
          </span>
        </motion.h1>

        {/* Portrait — centered; behind + faded on mobile, in front on sm+ */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
          className="absolute z-0 sm:z-20 left-1/2 sm:left-[26%] -translate-x-1/2 bottom-0 h-[82%] sm:h-[92%] pointer-events-none select-none opacity-30 sm:opacity-100"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-portrait.png"
            alt="Biraj Buddhacharya"
            className="h-full w-auto object-contain object-bottom"
            style={{
              WebkitMaskImage:
                "linear-gradient(to bottom, #000 78%, transparent 99%)",
              maskImage:
                "linear-gradient(to bottom, #000 78%, transparent 99%)",
            }}
          />
        </motion.div>
      </div>

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
