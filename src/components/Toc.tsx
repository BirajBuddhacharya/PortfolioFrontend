'use client';

import { useEffect, useMemo, useState } from 'react';
import { parseHeadings } from '../lib/markdown';

/**
 * "On this page" navigator for a rendered markdown body.
 * Anchors match the ids rehype-slug puts on the headings inside <Prose>.
 */
export function Toc({ content, className = '' }: { content: string; className?: string }) {
  const headings = useMemo(() => parseHeadings(content), [content]);
  const [activeSlug, setActiveSlug] = useState<string>();

  const minLevel = useMemo(
    () => (headings.length ? Math.min(...headings.map((h) => h.level)) : 1),
    [headings],
  );

  // Highlight whichever heading is currently nearest the top of the viewport.
  useEffect(() => {
    if (!headings.length) return;

    const nodes = headings
      .map((h) => document.getElementById(h.slug))
      .filter((n): n is HTMLElement => !!n);
    if (!nodes.length) return;

    const pick = () => {
      let current = nodes[0];
      for (const n of nodes) {
        if (n.getBoundingClientRect().top <= 96) current = n;
        else break;
      }
      setActiveSlug(current.id);
    };

    pick();
    window.addEventListener('scroll', pick, { passive: true });
    return () => window.removeEventListener('scroll', pick);
  }, [headings]);

  if (!headings.length) return null;

  return (
    <aside className={className}>
      <div className="sticky top-[120px]">
        <p
          className="mb-4 text-[11px] font-bold uppercase tracking-[0.12em]"
          style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: '#6E6E78' }}
        >
          On this page
        </p>
        <nav>
          <ol className="flex flex-col border-l" style={{ borderColor: 'rgba(255,255,255,0.09)' }}>
            {headings.map((h) => {
              const active = h.slug === activeSlug;
              return (
                <li key={`${h.slug}-${h.offset}`}>
                  <a
                    href={`#${h.slug}`}
                    title={h.text}
                    className="-ml-px block truncate border-l py-1 pr-2 text-[12.5px] transition-colors duration-150"
                    style={{
                      fontFamily: 'var(--font-jetbrains-mono), monospace',
                      paddingLeft: 12 + (h.level - minLevel) * 12,
                      borderColor: active ? '#FF6B6B' : 'transparent',
                      color: active ? '#EDEDEF' : '#8A8A93',
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget;
                      el.style.color = '#EDEDEF';
                      el.style.borderColor = '#FF6B6B';
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget;
                      el.style.color = active ? '#EDEDEF' : '#8A8A93';
                      el.style.borderColor = active ? '#FF6B6B' : 'transparent';
                    }}
                  >
                    {h.text}
                  </a>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </aside>
  );
}
