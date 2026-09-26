'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { use } from 'react';
import { Navbar } from '../../../components/layout/Navbar';
import { Footer } from '../../../components/layout/Footer';
import { Prose } from '../../../components/Prose';
import { Toc } from '../../../components/Toc';
import { useProjectDetail } from '../../../services/projectsService';

const mono = 'var(--font-jetbrains-mono), monospace';
const heading = 'var(--font-space-grotesk), sans-serif';

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[12px] uppercase tracking-[0.1em] mb-4" style={{ fontFamily: mono, color: '#FF6B6B' }}>
      {children}
    </div>
  );
}

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: project, isLoading, isError } = useProjectDetail(id);

  const meta = project ? [project.year, project.kind, project.status].filter(Boolean) : [];

  return (
    <div style={{ background: '#09090B', color: '#EDEDEF', minHeight: '100vh', overflowX: 'hidden' }}>
      <Navbar />
      <main className="relative z-10 max-w-[1220px] mx-auto px-7 pt-[150px]">
        {isLoading && (
          <div className="text-[14px]" style={{ fontFamily: mono, color: '#6E6E78' }}>
            Loading…
          </div>
        )}

        {isError && (
          <div>
            <p style={{ color: '#8A8A93' }}>Project not found.</p>
            <Link href="/projects" style={{ color: '#FF6B6B', fontFamily: mono, fontSize: 13 }}>← all projects</Link>
          </div>
        )}

        {project && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid gap-12 lg:grid-cols-[200px_minmax(0,1000px)] lg:justify-center"
          >
            <Toc content={project.content ?? ''} className="order-1 hidden lg:block" />
            <div className="order-2 min-w-0">
            <Link
              href="/projects"
              className="text-[12.5px] transition-colors duration-200"
              style={{ fontFamily: mono, color: '#8A8A93' }}
              onMouseEnter={(e) => { (e.target as HTMLElement).style.color = '#FF6B6B'; }}
              onMouseLeave={(e) => { (e.target as HTMLElement).style.color = '#8A8A93'; }}
            >
              ← all projects
            </Link>

            <h1
              className="mt-[26px] mb-[18px]"
              style={{
                fontFamily: heading,
                fontSize: 'clamp(36px, 6vw, 68px)',
                lineHeight: 1.02,
                letterSpacing: '-0.04em',
                fontWeight: 600,
                color: '#EDEDEF',
              }}
            >
              {project.title}
            </h1>

            {meta.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-[20px]">
                {meta.map((m) => (
                  <span
                    key={m}
                    className="text-[11px] uppercase tracking-[0.1em] px-[10px] py-[5px] rounded-[8px] border"
                    style={{ fontFamily: mono, color: '#8A8A93', borderColor: 'rgba(255,255,255,0.09)' }}
                  >
                    {m}
                  </span>
                ))}
              </div>
            )}

            {project.summary && (
              <p
                className="text-[18px] leading-[1.7] mb-[26px] max-w-[60ch]"
                style={{ color: '#A1A1AA', textWrap: 'pretty' } as React.CSSProperties}
              >
                {project.summary}
              </p>
            )}

            {(project.live || project.repo) && (
              <div className="flex gap-[10px] flex-wrap mb-[34px]">
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-[11px] rounded-[10px] text-[12.5px] font-semibold transition-colors duration-200"
                    style={{ background: '#FF6B6B', color: '#12080A', fontFamily: mono }}
                    onMouseEnter={(e) => { (e.target as HTMLElement).style.background = '#FF867F'; }}
                    onMouseLeave={(e) => { (e.target as HTMLElement).style.background = '#FF6B6B'; }}
                  >
                    Live site ↗
                  </a>
                )}
                {project.repo && (
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-[11px] rounded-[10px] text-[12.5px] border border-white/[0.14] transition-colors duration-200"
                    style={{ color: '#EDEDEF', fontFamily: mono }}
                    onMouseEnter={(e) => { const el = e.target as HTMLElement; el.style.borderColor = '#FF6B6B'; el.style.color = '#FF6B6B'; }}
                    onMouseLeave={(e) => { const el = e.target as HTMLElement; el.style.borderColor = 'rgba(255,255,255,0.14)'; el.style.color = '#EDEDEF'; }}
                  >
                    GitHub ↗
                  </a>
                )}
              </div>
            )}

            {project.metrics.length > 0 && (
              <div
                className="grid gap-[1px] border border-white/[0.08] rounded-[18px] overflow-hidden mb-[56px]"
                style={{
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  background: 'rgba(255,255,255,0.08)',
                }}
              >
                {project.metrics.map((m, i) => (
                  <div key={i} className="p-[26px]" style={{ background: '#0C0C0F' }}>
                    <div
                      className="text-[32px] font-semibold mb-2"
                      style={{ fontFamily: heading, letterSpacing: '-0.03em', color: '#FF6B6B' }}
                    >
                      {m.value}
                    </div>
                    <div className="text-[11px] uppercase tracking-[0.06em]" style={{ fontFamily: mono, color: '#8A8A93' }}>
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {project.content && (
              <div className="mb-[56px]">
                <Prose>{project.content}</Prose>
              </div>
            )}

            {project.stack.length > 0 && (
              <div className="mb-[56px]">
                <SectionLabel>stack</SectionLabel>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((s) => (
                    <span
                      key={s}
                      className="text-[12.5px] px-[14px] py-2 rounded-[8px] border border-white/[0.08]"
                      style={{ fontFamily: mono, color: '#C7C7CE', background: 'rgba(255,255,255,0.05)' }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {project.gallery.length > 0 && (
              <div className="pb-5">
                <SectionLabel>gallery</SectionLabel>
                <div className="grid gap-[14px]" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
                  {project.gallery.map((g, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-center rounded-[14px] border border-white/[0.08] transition-colors duration-200"
                      style={{ aspectRatio: '16/10', background: 'linear-gradient(135deg,#141418,#0C0C0F)' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,107,107,0.4)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'; }}
                    >
                      <span className="text-[11px] tracking-[0.1em]" style={{ fontFamily: mono, color: '#4A4A52' }}>
                        {g}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            </div>
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  );
}
