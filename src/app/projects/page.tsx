'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { useProjects } from '../../services/projectsService';
import type { Project } from '../../types/project';

const filters = [
  { id: 'all', label: 'All' },
  { id: 'ML', label: 'ML / AI' },
  { id: 'Web app', label: 'Web app' },
  { id: 'CLI tool', label: 'CLI' },
  { id: 'AI product', label: 'AI product' },
];

const COLUMN_COUNT = 3;

function useColumns(items: Project[], count: number): Project[][] {
  return useMemo(() => {
    const cols: Project[][] = Array.from({ length: count }, () => []);
    const heights = new Array<number>(count).fill(0);
    items.forEach((item) => {
      const shortest = heights.indexOf(Math.min(...heights));
      cols[shortest].push(item);
      heights[shortest] += (item.coverHeight ?? 180) + 140;
    });
    return cols;
  }, [items, count]);
}

function ProjectCard({ p, index }: { p: Project; index: number }) {
  const accent = p.coverAccent ?? '#FF6B6B';
  const coverH = p.coverHeight ?? 180;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <Link
        href={`/projects/${p.id}`}
        className="block rounded-[20px] overflow-hidden border border-white/[0.08] transition-all duration-[0.35s]"
        style={{ background: '#0C0C0F', color: 'inherit' }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.transform = 'translateY(-6px)';
          el.style.borderColor = `${accent}55`;
          el.style.boxShadow = `0 28px 64px -32px ${accent}44`;
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.transform = 'translateY(0)';
          el.style.borderColor = 'rgba(255,255,255,0.08)';
          el.style.boxShadow = 'none';
        }}
      >
        {/* Cover */}
        <div
          className="relative flex items-center justify-center overflow-hidden"
          style={{
            height: coverH,
            background: `linear-gradient(140deg, ${accent}18 0%, #0E0E11 70%)`,
          }}
        >
          {/* Ambient glow blob */}
          <div
            className="absolute rounded-full blur-3xl opacity-30"
            style={{
              width: coverH * 1.2,
              height: coverH * 1.2,
              background: accent,
              top: '-30%',
              left: '20%',
            }}
          />
          {/* Kind badge */}
          {p.kind && (
            <span
              className="absolute top-[14px] left-[14px] text-[10.5px] border px-[9px] py-1 rounded-full"
              style={{
                fontFamily: 'var(--font-jetbrains-mono), monospace',
                color: accent,
                background: `${accent}18`,
                borderColor: `${accent}40`,
              }}
            >
              {p.kind}
            </span>
          )}

          {/* Year */}
          {p.year && (
            <span
              className="absolute bottom-[14px] right-[14px] text-[10.5px]"
              style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: '#6E6E78' }}
            >
              {p.year}
            </span>
          )}
        </div>

        {/* Body */}
        <div className="p-[22px] pb-[24px]">
          <div className="flex items-start justify-between gap-3 mb-[10px]">
            <h3
              className="m-0 text-[21px] font-semibold leading-tight"
              style={{
                fontFamily: 'var(--font-space-grotesk), sans-serif',
                letterSpacing: '-0.025em',
                color: '#EDEDEF',
              }}
            >
              {p.title}
            </h3>
            <span
              className="mt-1 flex-shrink-0 text-[15px] transition-transform duration-200 group-hover:translate-x-1"
              style={{ color: accent }}
            >
              ↗
            </span>
          </div>

          {p.blurb && (
            <p className="mb-4 text-[14px] leading-[1.65]" style={{ color: '#8A8A93' }}>
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
                    fontFamily: 'var(--font-jetbrains-mono), monospace',
                    color: '#A1A1AA',
                    background: 'rgba(255,255,255,0.04)',
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

export default function ProjectsPage() {
  const { data: projects = [] } = useProjects();
  const [activeFilter, setActiveFilter] = useState('all');

  const visible: Project[] = activeFilter === 'all'
    ? projects
    : projects.filter((p) => p.kind === activeFilter);

  const columns = useColumns(visible, COLUMN_COUNT);

  return (
    <div style={{ background: '#09090B', color: '#EDEDEF', minHeight: '100vh', overflowX: 'hidden' }}>
      <Navbar />
      <main className="relative z-10 max-w-[1180px] mx-auto px-7 pt-[160px]">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="text-[12px] uppercase tracking-[0.14em] mb-4"
            style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: '#FF6B6B' }}
          >
            projects
          </div>
          <h1
            className="mb-5"
            style={{
              fontFamily: 'var(--font-space-grotesk), sans-serif',
              fontSize: 'clamp(38px, 6.4vw, 78px)',
              lineHeight: 1,
              letterSpacing: '-0.04em',
              fontWeight: 600,
              color: '#EDEDEF',
              margin: '0 0 20px',
            }}
          >
            Work, in detail<span style={{ color: '#FF6B6B' }}>.</span>
          </h1>
          <p className="text-[16.5px] leading-[1.7] max-w-[56ch] mb-[38px]" style={{ color: '#8A8A93' }}>
            Client freelance builds, product work, and machine-learning experiments that made it past the notebook.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap mb-[40px]">
          {filters.map((f) => {
            const isActive = activeFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className="px-4 py-[9px] rounded-full text-[12.5px] border transition-all duration-200 cursor-pointer"
                style={{
                  fontFamily: 'var(--font-jetbrains-mono), monospace',
                  background: isActive ? 'rgba(255,107,107,0.12)' : 'transparent',
                  borderColor: isActive ? 'rgba(255,107,107,0.5)' : 'rgba(255,255,255,0.10)',
                  color: isActive ? '#FF6B6B' : '#6E6E78',
                  transform: isActive ? 'scale(1.02)' : 'scale(1)',
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Masonry grid — 3 flexbox columns, shortest-column-first distribution */}
        <div className="flex gap-5 items-start pb-10">
          {columns.map((col, ci) => (
            <div key={ci} className="flex-1 flex flex-col gap-5 min-w-0">
              <AnimatePresence mode="popLayout">
                {col.map((p, i) => (
                  <ProjectCard key={p.id} p={p} index={ci * 2 + i} />
                ))}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {visible.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-24 text-center"
          >
            <div
              className="text-[13px]"
              style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: '#6E6E78' }}
            >
              no projects in this category yet
            </div>
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  );
}
