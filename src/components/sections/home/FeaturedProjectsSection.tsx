'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import type { Project } from '../../../types/project';

export function FeaturedProjectsSection({ projects }: { projects: Project[] }) {
  return (
    <section className="max-w-[1180px] mx-auto px-7 pt-[96px]">
      <motion.div
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <div className="flex items-end justify-between gap-6 flex-wrap mb-[34px]">
          <div>
            <div
              className="text-[12px] uppercase tracking-[0.14em] mb-[14px]"
              style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: '#FF6B6B' }}
            >
              01 / selected work
            </div>
            <h2
              className="m-0"
              style={{
                fontFamily: 'var(--font-space-grotesk), sans-serif',
                fontSize: 'clamp(30px, 4.4vw, 46px)',
                letterSpacing: '-0.035em',
                fontWeight: 600,
                color: '#EDEDEF',
              }}
            >
              Things I&apos;ve shipped
            </h2>
          </div>
          <Link
            href="/projects"
            className="text-[13px] border-b border-[rgba(255,107,107,0.4)] pb-[3px] transition-colors duration-200"
            style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: '#FF6B6B' }}
          >
            all {projects.length + 3} projects →
          </Link>
        </div>

        <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          {projects.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <Link
                href={`/projects/${p.id}`}
                className="block color-inherit rounded-[18px] overflow-hidden border border-white/[0.08] transition-all duration-[0.35s]"
                style={{ background: '#0C0C0F', color: 'inherit' }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = 'translateY(-6px)';
                  el.style.borderColor = 'rgba(255,107,107,0.45)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = 'translateY(0)';
                  el.style.borderColor = 'rgba(255,255,255,0.08)';
                }}
              >
                <div
                  className="h-[172px] border-b border-white/[0.07] flex items-center justify-center relative"
                  style={{ background: `linear-gradient(135deg, ${p.coverColor} 0%, #0E0E11 100%)` }}
                >
                  <span
                    className="text-[11px] uppercase tracking-[0.16em]"
                    style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: '#3F3F46' }}
                  >
                    cover image
                  </span>
                  <span
                    className="absolute top-[14px] left-[14px] text-[10.5px] border border-white/[0.12] px-[9px] py-1 rounded-full"
                    style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: '#8A8A93' }}
                  >
                    {p.year}
                  </span>
                </div>

                <div className="p-[22px] pb-[24px]">
                  <div className="flex items-center justify-between gap-3">
                    <h3
                      className="m-0 text-[21px] font-semibold"
                      style={{
                        fontFamily: 'var(--font-space-grotesk), sans-serif',
                        letterSpacing: '-0.02em',
                        color: '#EDEDEF',
                      }}
                    >
                      {p.title}
                    </h3>
                    <span className="text-[16px]" style={{ color: '#FF6B6B' }}>↗</span>
                  </div>
                  <p className="my-[10px] mb-4 text-[14.5px] leading-[1.6]" style={{ color: '#8A8A93' }}>
                    {p.blurb}
                  </p>
                  <div className="flex flex-wrap gap-[6px]">
                    {p.stack.map((s) => (
                      <span
                        key={s}
                        className="text-[11px] px-[9px] py-1 rounded-[6px] border border-white/[0.07]"
                        style={{
                          fontFamily: 'var(--font-jetbrains-mono), monospace',
                          color: '#A1A1AA',
                          background: 'rgba(255,255,255,0.05)',
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
