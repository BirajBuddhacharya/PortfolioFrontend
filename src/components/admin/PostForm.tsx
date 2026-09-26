'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CalendarClock, CircleDot, Clock, Image as ImageIcon, Tags } from 'lucide-react';
import { Input } from '@/components/components/ui/input';
import { Textarea } from '@/components/components/ui/textarea';
import { Button } from '@/components/components/ui/button';
import { Separator } from '@/components/components/ui/separator';
import { cn } from '@/components/lib/utils';
import { Prose } from '../Prose';
import { HeadingExplorer, parseHeadings, type Heading } from './HeadingExplorer';
import { ChipInput, Row, field } from './FormPrimitives';
import type { BlogPost, CreateBlogPostPayload } from '../../types/blog';

/** `2026-09-26T10:00:00.000Z` → `2026-09-26` for a date input. */
const toDateInput = (iso?: string | null) => (iso ? iso.slice(0, 10) : '');

export function PostForm({
  post,
  saving,
  onSave,
}: {
  post?: BlogPost;
  saving: boolean;
  onSave: (data: CreateBlogPostPayload) => void;
}) {
  const isEdit = !!post;

  const [title, setTitle] = useState(post?.title ?? '');
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '');
  const [content, setContent] = useState(post?.content ?? '');
  const [tags, setTags] = useState<string[]>(post?.tags ?? []);
  const [status, setStatus] = useState<'draft' | 'published'>(
    (post?.status as 'draft' | 'published') ?? 'draft',
  );
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? '');
  const [publishedAt, setPublishedAt] = useState(toDateInput(post?.publishedAt));
  const [preview, setPreview] = useState(false);
  const [activeSlug, setActiveSlug] = useState<string>();

  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const headings = useMemo(() => parseHeadings(content), [content]);

  const wordCount = useMemo(
    () => content.trim().split(/\s+/).filter(Boolean).length,
    [content],
  );
  const readTime = Math.max(1, Math.round(wordCount / 200));

  /** Jump to a heading — scroll the editor to its line, or the preview to its anchor. */
  const goToHeading = (h: Heading) => {
    setActiveSlug(h.slug);

    if (preview) {
      previewRef.current
        ?.querySelector(`#${CSS.escape(h.slug)}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    const el = bodyRef.current;
    if (!el) return;
    el.focus();
    el.setSelectionRange(h.offset, h.offset + h.text.length + h.level + 1);

    // Scroll the heading's line to the top of the viewport.
    const line = content.slice(0, h.offset).split('\n').length - 1;
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 25;
    window.scrollTo({ top: el.offsetTop + line * lineHeight - 90, behavior: 'smooth' });
  };

  const trimmed = (s: string) => (s.trim() ? s.trim() : undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title: title.trim(),
      excerpt: trimmed(excerpt),
      content: trimmed(content),
      tags,
      status,
      coverImage: trimmed(coverImage),
      publishedAt: publishedAt ? new Date(publishedAt).toISOString() : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Sticky bar */}
      <div className="sticky top-0 z-20 -mx-7 mb-10 flex items-center justify-between gap-4 border-b border-border bg-background/85 px-7 py-3 backdrop-blur">
        <Button asChild variant="ghost" size="sm" className="h-8 gap-1.5 px-2 font-mono text-[12px] text-[#6E6E78] hover:text-[#FF6B6B]">
          <Link href="/admin?tab=posts">
            <ArrowLeft size={13} /> posts
          </Link>
        </Button>

        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-[#6E6E78]">
            {wordCount.toLocaleString()} words · {readTime} min
          </span>
          <Button type="submit" size="sm" disabled={saving || !title.trim()} className="h-8 font-mono text-[12px] font-semibold">
            {saving ? 'Saving…' : isEdit ? 'Save' : 'Create'}
          </Button>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[200px_minmax(0,1fr)]">
        {/* ── Explorer ─────────────────────────────────────────────────── */}
        <HeadingExplorer
          headings={headings}
          activeSlug={activeSlug}
          onSelect={goToHeading}
          className="order-1 hidden lg:block"
        />

        {/* ── Page ─────────────────────────────────────────────────────── */}
        <div className="order-2 min-w-0">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled"
            autoFocus={!isEdit}
            className="h-auto border-none bg-transparent p-0 font-[family-name:var(--font-space-grotesk)] text-[clamp(28px,3.6vw,38px)] font-semibold leading-[1.15] tracking-[-0.03em] shadow-none placeholder:text-[#313139] focus-visible:ring-0 md:text-[clamp(28px,3.6vw,38px)]"
          />

          <Input
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Add an excerpt — shown on the blog list…"
            className={cn(field, '-ml-2 mb-6 mt-1 h-9 text-[15px] text-[#A1A1AA]')}
          />

          {/* Properties */}
          <div className="-ml-2 flex flex-col gap-0.5">
            <Row icon={CircleDot} label="Status">
              <div className="flex gap-1.5 px-2 py-1">
                {(['draft', 'published'] as const).map((s) => {
                  const on = status === s;
                  const color = s === 'published' ? '#10B981' : '#6E6E78';
                  return (
                    <Button
                      key={s}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setStatus(s)}
                      className="h-auto rounded-full px-[10px] py-[3px] font-mono text-[11.5px] font-normal"
                      style={{
                        color: on ? color : '#6E6E78',
                        background: on ? `${color}18` : 'transparent',
                        borderColor: on ? `${color}45` : 'rgba(255,255,255,0.07)',
                      }}
                    >
                      {s}
                    </Button>
                  );
                })}
              </div>
            </Row>

            <Row icon={Tags} label="Tags">
              <ChipInput values={tags} onChange={setTags} placeholder="Type and press Enter…" />
            </Row>

            <Row icon={CalendarClock} label="Published">
              <Input
                type="date"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className={cn(field, 'w-[180px] font-mono text-[13px]')}
              />
            </Row>

            <Row icon={ImageIcon} label="Cover image">
              <Input
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="Empty"
                className={field}
              />
            </Row>

            <Row icon={Clock} label="Read time">
              <span className="px-2 font-mono text-[13px] text-[#8A8A93]">
                {readTime} min · {wordCount.toLocaleString()} words
              </span>
            </Row>
          </div>

          <Separator className="my-8" />

          {/* Body */}
          <div className="mb-4 flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#6E6E78]">
              body · markdown
            </span>
            <div className="flex gap-1 rounded-lg border border-border p-[3px]">
              {[{ id: false, label: 'Write' }, { id: true, label: 'Preview' }].map((t) => (
                <Button
                  key={t.label}
                  type="button"
                  variant={preview === t.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPreview(t.id)}
                  className={cn(
                    'h-auto rounded-md px-3 py-1 font-mono text-[11px] font-normal',
                    preview !== t.id && 'text-[#A1A1AA] hover:bg-white/[0.05]',
                  )}
                >
                  {t.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="pb-24">
            {preview ? (
              <div ref={previewRef} className="min-h-[460px] scroll-mt-24">
                {content.trim()
                  ? <Prose>{content}</Prose>
                  : <span className="font-mono text-[13px] text-[#6E6E78]">Nothing to preview yet.</span>}
              </div>
            ) : (
              <Textarea
                ref={bodyRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={"Start writing…\n\n## Introduction\n\nSet the scene.\n\n## How it works\n\n- Point one\n- Point two\n\n```ts\nconst example = true;\n```"}
                className="min-h-[460px] resize-y border-none bg-transparent p-0 font-mono text-[13.5px] leading-[1.85] text-[#C7C7CE] shadow-none placeholder:text-[#3A3A42] focus-visible:ring-0 md:text-[13.5px]"
              />
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
