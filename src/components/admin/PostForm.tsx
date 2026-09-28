'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

const toSlug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowLeft, CalendarClock, CircleDot, Clock, Hash, Image as ImageIcon, Tags } from 'lucide-react';
import { Input } from '@/components/components/ui/input';
import { Button } from '@/components/components/ui/button';
import { Separator } from '@/components/components/ui/separator';
import { Calendar } from '@/components/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/components/ui/popover';
import { cn } from '@/components/lib/utils';
import { Prose } from '../Prose';
import { MarkdownEditor, type MarkdownEditorHandle } from './MarkdownEditor';
import { HeadingExplorer, parseHeadings, type Heading } from './HeadingExplorer';
import { ChipInput, Row, field } from './FormPrimitives';
import type { BlogPost, CreateBlogPostPayload } from '../../types/blog';
import { ImageUploadButton } from './ImageUploadButton';

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
  const [slug, setSlug] = useState(post?.slug ?? '');
  const [slugEdited, setSlugEdited] = useState(isEdit);
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

  const bodyRef = useRef<MarkdownEditorHandle>(null);
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

    bodyRef.current?.select(h.offset, h.offset + h.text.length + h.level + 1);
  };

  useEffect(() => {
    if (!slugEdited) setSlug(toSlug(title));
  }, [title, slugEdited]);

  const trimmed = (s: string) => (s.trim() ? s.trim() : undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title: title.trim(),
      slug: slug.trim(),
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
          <Link href="/admin/blogs">
            <ArrowLeft size={13} /> Blogs
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
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    className={cn(field, 'w-[180px] justify-start font-mono text-[13px] font-normal', !publishedAt && 'text-[#45454E]')}
                  >
                    {publishedAt ? format(new Date(publishedAt), 'MMM d, yyyy') : 'Empty'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={publishedAt ? new Date(publishedAt) : undefined}
                    onSelect={(date) => setPublishedAt(date ? format(date, 'yyyy-MM-dd') : '')}

                  />
                </PopoverContent>
              </Popover>
            </Row>

            <Row icon={ImageIcon} label="Cover image">
              <div className="flex gap-2 items-center px-2 py-1 w-full">
                <Input
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="Empty"
                  className={cn(field, 'flex-1')}
                />
                <ImageUploadButton onUploaded={(url) => setCoverImage(url)} />
              </div>
            </Row>

            <Row icon={Hash} label="Slug">
              <Input
                value={slug}
                onChange={(e) => { setSlug(e.target.value); setSlugEdited(true); }}
                placeholder="auto-generated"
                className={cn(field, 'font-mono text-[13px]')}
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
              <MarkdownEditor handleRef={bodyRef} value={content} onChange={setContent} />
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
