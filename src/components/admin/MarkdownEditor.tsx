'use client';

import dynamic from 'next/dynamic';

export type { MarkdownEditorHandle } from './MarkdownEditorClient';

/**
 * Markdown body editor with vim keybindings (CodeMirror 6 + `@replit/codemirror-vim`).
 * Client-only: the vim extension touches browser globals on import, which breaks
 * Next's page-data collection at build time.
 */
export const MarkdownEditor = dynamic(
  () => import('./MarkdownEditorClient').then((m) => m.MarkdownEditorClient),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[460px] font-mono text-[13px] text-[#3A3A42]">Loading editor…</div>
    ),
  },
);
