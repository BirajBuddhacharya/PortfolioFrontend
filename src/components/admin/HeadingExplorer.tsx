'use client';

import { useMemo } from 'react';
import { cn } from '@/components/lib/utils';
import type { Heading } from '../../lib/markdown';

export { parseHeadings } from '../../lib/markdown';
export type { Heading } from '../../lib/markdown';

export function HeadingExplorer({
  headings,
  activeSlug,
  onSelect,
  className,
}: {
  headings: Heading[];
  activeSlug?: string;
  onSelect: (h: Heading) => void;
  className?: string;
}) {
  const minLevel = useMemo(
    () => (headings.length ? Math.min(...headings.map((h) => h.level)) : 1),
    [headings],
  );

  return (
    <aside className={cn('w-[200px] shrink-0', className)}>
      <div className="sticky top-[72px]">
        <p className="mb-3 font-mono text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#6E6E78]">
          On this page
        </p>

        {headings.length === 0 ? (
          <p className="font-mono text-[11.5px] leading-relaxed text-[#45454E]">
            Add a <span className="text-[#6E6E78]">## heading</span> to build an outline.
          </p>
        ) : (
          <nav>
            <ol className="flex flex-col border-l border-border">
              {headings.map((h) => {
                const active = h.slug === activeSlug;
                return (
                  <li key={`${h.slug}-${h.offset}`}>
                    <button
                      type="button"
                      onClick={() => onSelect(h)}
                      title={h.text}
                      style={{ paddingLeft: 12 + (h.level - minLevel) * 12 }}
                      className={cn(
                        '-ml-px block w-full truncate border-l py-1 pr-2 text-left font-mono text-[12px] transition-colors',
                        active
                          ? 'border-[#FF6B6B] text-[#EDEDEF]'
                          : 'border-transparent text-[#8A8A93] hover:border-[#FF6B6B] hover:text-[#EDEDEF]',
                      )}
                    >
                      {h.text}
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>
        )}
      </div>
    </aside>
  );
}
