'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Project } from '../../../types/project';
import { ProjectCard } from '../../../components/projects/ProjectCard';
import { useTags } from '../../../services/tagsService';
import { usePublicProjectsByTag } from '../../../services/projectsService';

function useColumnCount() {
  const [count, setCount] = useState(3);
  useEffect(() => {
    const update = () =>
      setCount(window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return count;
}

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

function ProjectCardItem({ p, index }: { p: Project; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <ProjectCard p={p} />
    </motion.div>
  );
}

export function ProjectsView({ projects: initialProjects }: { projects: Project[] }) {
  const [activeTagId, setActiveTagId] = useState<string | null>(null);
  const columnCount = useColumnCount();

  const { data: tags = [] } = useTags();
  const { data: filteredProjects, isFetching } = usePublicProjectsByTag(activeTagId);

  const visible: Project[] = activeTagId ? (filteredProjects ?? []) : initialProjects;
  const columns = useColumns(visible, columnCount);

  return (
    <div style={{ background: '#09090B', color: '#EDEDEF', minHeight: '100vh' }}>
      <main className="relative z-10 max-w-[1180px] mx-auto px-4 sm:px-7 pt-[120px] sm:pt-[160px]">

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
        </motion.div>

        {initialProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="py-32 flex flex-col items-center gap-5"
          >
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
              <rect x="4" y="28" width="24" height="24" rx="4" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5"/>
              <rect x="32" y="16" width="20" height="36" rx="4" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5"/>
              <rect x="18" y="8" width="16" height="16" rx="3" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5"/>
              <circle cx="44" cy="44" r="10" fill="#0C0C0F" stroke="rgba(255,107,107,0.3)" strokeWidth="1.5"/>
              <path d="M41 44h6M44 41v6" stroke="#FF6B6B" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <div className="text-center">
              <div
                className="text-[15px] font-medium mb-2"
                style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', color: '#EDEDEF' }}
              >
                No projects yet
              </div>
              <div
                className="text-[13px]"
                style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: '#6E6E78' }}
              >
                building something new — check back soon
              </div>
            </div>
          </motion.div>
        )}

        {/* Tag filters */}
        {initialProjects.length > 0 && tags.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-[40px]">
            {[{ id: null, label: 'All' }, ...tags.map((t) => ({ id: t.id, label: t.name }))].map((f) => {
              const isActive = activeTagId === f.id;
              return (
                <button
                  key={f.id ?? 'all'}
                  onClick={() => setActiveTagId(f.id)}
                  className="px-4 py-[9px] rounded-full text-[12.5px] border transition-all duration-200 cursor-pointer"
                  style={{
                    fontFamily: 'var(--font-jetbrains-mono), monospace',
                    background: isActive ? 'rgba(255,107,107,0.12)' : 'transparent',
                    borderColor: isActive ? 'rgba(255,107,107,0.5)' : 'rgba(255,255,255,0.10)',
                    color: isActive ? '#FF6B6B' : '#6E6E78',
                    transform: isActive ? 'scale(1.02)' : 'scale(1)',
                    opacity: isFetching && f.id === activeTagId ? 0.6 : 1,
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Masonry grid */}
        {initialProjects.length > 0 && (
          <div className="flex gap-5 items-start pb-10">
            {columns.map((col, ci) => (
              <div key={ci} className="flex-1 flex flex-col gap-5 min-w-0">
                <AnimatePresence mode="popLayout">
                  {col.map((p, i) => (
                    <ProjectCardItem key={p.id} p={p} index={ci * 2 + i} />
                  ))}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}

        {initialProjects.length > 0 && visible.length === 0 && !isFetching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-24 text-center"
          >
            <div
              className="text-[13px]"
              style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: '#6E6E78' }}
            >
              no projects with this tag yet
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
