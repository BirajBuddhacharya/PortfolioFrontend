"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";

const titleContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const titleLine: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] } },
};

// Padding/negative-margin pair gives descenders (j, y) room inside the
// overflow clip without shifting layout.
const maskLine = "block overflow-hidden pb-[0.2em] -mb-[0.2em]";

function BioParagraph() {
  return (
    <p
      className="m-0 text-[17px] leading-[1.65]"
      style={{ color: "#A1A1AA", textWrap: "pretty" } as React.CSSProperties}
    >
      Machine learning engineer and full-stack developer. I build backends that
      think — RAG chatbots, recommendation engines and analytics systems — and
      the interfaces that make them usable.
    </p>
  );
}

function CtaButtons() {
  return (
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
  );
}

export function HeroSection() {
  return (
    <section className="max-w-[1180px] mx-auto px-4 sm:px-7 pt-[130px] sm:pt-[150px] pb-[90px]">
      {/* Layered name + centered portrait */}
      <div className="relative mb-[28px] min-h-[420px] sm:min-h-[700px] lg:min-h-[820px]">
        {/* Accent glow behind the portrait */}
        <motion.div
          className="absolute pointer-events-none left-1/2 sm:left-[26%] bottom-0 w-[70%] sm:w-[40%] max-w-[520px] h-[80%]"
          style={{ x: "-50%" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        >
          <motion.div
            className="w-full h-full"
            style={{
              background:
                "radial-gradient(circle at 50% 42%, rgba(255,107,107,0.7) 0%, rgba(255,107,107,0.3) 38%, rgba(255,107,107,0.08) 62%, transparent 75%)",
              filter: "blur(46px)",
            }}
            animate={{
              scale: [1, 1.09, 1],
              filter: ["blur(46px)", "blur(62px)", "blur(46px)"],
            }}
            transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Name — stacked on mobile, split left/right around the portrait on sm+ */}
        <motion.h1
          variants={titleContainer}
          initial="hidden"
          animate="show"
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
          <motion.span className={maskLine}>
            <motion.span variants={titleLine} className="block">
              Biraj
            </motion.span>
          </motion.span>
          <motion.span
            className={`${maskLine} sm:absolute sm:right-0 sm:top-[0.95em] sm:whitespace-nowrap`}
          >
            <motion.span variants={titleLine} className="block">
              Buddhacharya<span style={{ color: "#FF6B6B" }}>.</span>
            </motion.span>
          </motion.span>
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
        {/* Bio + CTA — sm+ only, absolute right of portrait below Buddhacharya */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
          className="hidden sm:flex sm:absolute sm:right-0 sm:top-[clamp(270px,15vw,200px)] sm:w-[42%] flex-col gap-8"
        >
          <BioParagraph />
          <CtaButtons />
        </motion.div>
      </div>

      {/* Bio + CTA — mobile only, below the portrait block */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
        className="sm:hidden border-t border-white/[0.08] pt-[30px] flex flex-col gap-6"
      >
        <BioParagraph />
        <CtaButtons />
      </motion.div>
    </section>
  );
}
