"use client";

import Link from "next/link";
import type { Project } from "../../types/project";

export function ProjectCard({
  p,
  coverHeight,
}: {
  p: Project;
  coverHeight?: number;
}) {
  const accent = p.coverAccent ?? p.coverColor ?? "#FF6B6B";
  const coverH = coverHeight ?? p.coverHeight ?? 172;

  return (
    <Link
      href={`/projects/${p.slug}`}
      className="block rounded-[18px] overflow-hidden border border-white/[0.08] transition-all duration-[0.35s]"
      style={{ background: "#0C0C0F", color: "inherit" }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = `${accent}55`;
        el.style.boxShadow = `0 28px 64px -32px ${accent}44`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "rgba(255,255,255,0.08)";
        el.style.boxShadow = "none";
      }}
    >
      {/* Cover */}
      <div
        className="relative flex items-center justify-center overflow-hidden border-b border-white/[0.07]"
        style={{
          height: coverH,
          background: `linear-gradient(140deg, ${accent}18 0%, #0E0E11 70%)`,
        }}
      >
        {p.coverImage ? (
          <img
            src={p.coverImage}
            alt={p.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          /* Ambient glow blob */
          <div
            className="absolute rounded-full blur-3xl opacity-30"
            style={{
              width: coverH * 1.2,
              height: coverH * 1.2,
              background: accent,
              top: "-30%",
              left: "20%",
            }}
          />
        )}
        {/* Kind badge */}
        {p.kind && (
          <span
            className="absolute top-[14px] left-[14px] text-[11px] px-[10px] py-1 rounded-full"
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              color: accent,
              background: `${accent}18`,
              border: `1px solid ${accent}40`,
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              letterSpacing: "0.04em",
            }}
          >
            {p.kind}
          </span>
        )}
        {/* Year — dark blurred pill, readable over any cover */}
        {p.year && (
          <span
            className="absolute top-[14px] right-[14px] text-[11px] px-[10px] py-1 rounded-full"
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              color: "#EDEDEF",
              background: "rgba(9,9,11,0.78)",
              border: "1px solid rgba(255,255,255,0.22)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              letterSpacing: "0.04em",
            }}
          >
            {p.year}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-[22px] pb-[24px]">
        <div className="flex items-center justify-between gap-3">
          <h3
            className="m-0 text-[21px] font-semibold leading-tight"
            style={{
              fontFamily: "var(--font-space-grotesk), sans-serif",
              letterSpacing: "-0.02em",
              color: "#EDEDEF",
            }}
          >
            {p.title}
          </h3>
          <span className="text-[16px]" style={{ color: accent }}>
            ↗
          </span>
        </div>
        {p.blurb && (
          <p
            className="my-[10px] mb-4 text-[14.5px] leading-[1.6]"
            style={{ color: "#8A8A93" }}
          >
            {p.blurb}
          </p>
        )}
        {p.stack.length > 0 && (
          <div className="flex flex-wrap gap-[6px]">
            {p.stack.map((s) => (
              <span
                key={s}
                className="text-[11px] px-[9px] py-1 rounded-[6px] border border-white/[0.07]"
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  color: "#A1A1AA",
                  background: "rgba(255,255,255,0.05)",
                }}
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
