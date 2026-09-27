'use client';

import { useImperativeHandle, useRef, type RefObject } from 'react';
import CodeMirror, { EditorView, type ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';
import { Vim, vim } from '@replit/codemirror-vim';
import { cn } from '@/components/lib/utils';

export type MarkdownEditorHandle = {
  /** Focus the editor and select `[from, to)`, scrolling it into view. */
  select: (from: number, to: number) => void;
};

/** Matches the plain-textarea look the forms used before. */
const theme = EditorView.theme(
  {
    '&': { background: 'transparent', color: '#C7C7CE', fontSize: '13.5px' },
    '&.cm-focused': { outline: 'none' },
    '.cm-content': {
      padding: 0,
      minHeight: '420px',
      fontFamily: 'var(--font-jetbrains-mono), ui-monospace, monospace',
      lineHeight: '1.85',
      caretColor: '#FF6B6B',
    },
    '.cm-gutters': { display: 'none' },
    '.cm-line': { padding: 0 },
    '.cm-activeLine': { background: 'transparent' },
    // 1px is the default and is easy to lose on this background.
    '.cm-cursor, .cm-cursor-primary': { borderLeftColor: '#FF6B6B', borderLeftWidth: '2px' },
    '.cm-fat-cursor': { background: '#FF6B6B !important', color: '#09090B !important' },
    '.cm-selectionBackground, &.cm-focused .cm-selectionBackground, ::selection': {
      background: 'rgba(255,107,107,0.22) !important',
    },
    '.cm-panels': {
      background: 'transparent',
      borderTop: '1px solid rgba(255,255,255,0.07)',
      color: '#8A8A93',
      fontFamily: 'var(--font-jetbrains-mono), ui-monospace, monospace',
      fontSize: '11.5px',
    },
    '.cm-vim-panel input': { color: '#EDEDEF', outline: 'none' },
  },
  { dark: true },
);

// `jk` leaves insert mode, the usual escape-key replacement.
Vim.map('jk', '<Esc>', 'insert');

/** Markdown tokens, tuned for the dark admin background. */
const highlight = HighlightStyle.define([
  { tag: t.heading, color: '#FF6B6B', fontWeight: '600' },
  { tag: t.strong, color: '#EDEDEF', fontWeight: '600' },
  { tag: t.emphasis, color: '#EDEDEF', fontStyle: 'italic' },
  { tag: t.link, color: '#7AA2F7' },
  { tag: t.url, color: '#6E6E78' },
  { tag: t.monospace, color: '#10B981' },
  { tag: t.quote, color: '#8A8A93', fontStyle: 'italic' },
  { tag: [t.list, t.processingInstruction], color: '#FF6B6B' },
  { tag: t.strikethrough, color: '#6E6E78', textDecoration: 'line-through' },
]);

// vim() must come first so its keymap wins over the default one.
const extensions = [
  vim({ status: true }),
  markdown(),
  syntaxHighlighting(highlight),
  theme,
  EditorView.lineWrapping,
];

export function MarkdownEditorClient({
  value,
  onChange,
  handleRef,
  placeholder,
  className,
  minHeight = '460px',
}: {
  value: string;
  onChange: (value: string) => void;
  /** Optional handle for driving the editor from the parent (see `select`). */
  handleRef?: RefObject<MarkdownEditorHandle | null>;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}) {
  const cmRef = useRef<ReactCodeMirrorRef>(null);

  useImperativeHandle(handleRef, () => ({
    select(from, to) {
      const view = cmRef.current?.view;
      if (!view) return;
      const max = view.state.doc.length;
      view.focus();
      view.dispatch({
        selection: { anchor: Math.min(from, max), head: Math.min(to, max) },
        scrollIntoView: true,
      });
    },
  }));

  // theme="none": uiw's bundled light theme would otherwise paint the editor white.
  return (
    <CodeMirror
      ref={cmRef}
      theme="none"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      extensions={extensions}
      basicSetup={{ lineNumbers: false, foldGutter: false, highlightActiveLine: false }}
      minHeight={minHeight}
      className={cn('font-mono text-[13.5px]', className)}
    />
  );
}
