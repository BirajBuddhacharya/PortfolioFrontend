'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  CircleDot,
  Github,
  Images,
  Layers,
  Link2,
  Palette,
  Plus,
  Shapes,
  Text,
  X,
} from 'lucide-react';
import { Input } from '@/components/components/ui/input';
import { Textarea } from '@/components/components/ui/textarea';
import { Button } from '@/components/components/ui/button';
import { Separator } from '@/components/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/components/ui/select';
import { cn } from '@/components/lib/utils';
import { Prose } from '../Prose';
import { ChipInput, Row, field } from './FormPrimitives';
import type { Project, CreateProjectPayload } from '../../types/project';

const KIND_OPTIONS = ['ML', 'Web app', 'CLI tool', 'AI product'];
const NONE = '__none__';

/* ── Form ─────────────────────────────────────────────────────────────────── */
export function ProjectForm({
  project,
  saving,
  onSave,
}: {
  project?: Project;
  saving: boolean;
  onSave: (data: CreateProjectPayload) => void;
}) {
  const isEdit = !!project;

  const [title, setTitle] = useState(project?.title ?? '');
  const [blurb, setBlurb] = useState(project?.blurb ?? '');
  const [summary, setSummary] = useState(project?.summary ?? '');
  const [content, setContent] = useState(project?.content ?? '');
  const [year, setYear] = useState(project?.year ?? '');
  const [kind, setKind] = useState(project?.kind ?? '');
  const [status, setStatus] = useState(project?.status ?? 'live');
  const [stack, setStack] = useState<string[]>(project?.stack ?? []);
  const [gallery, setGallery] = useState<string[]>(project?.gallery ?? []);
  const [live, setLive] = useState(project?.live ?? '');
  const [repo, setRepo] = useState(project?.repo ?? '');
  const [coverAccent, setCoverAccent] = useState(project?.coverAccent ?? '#FF6B6B');
  const [coverColor, setCoverColor] = useState(project?.coverColor ?? '#141418');
  const [coverHeight, setCoverHeight] = useState(project?.coverHeight ?? 260);
  const [metrics, setMetrics] = useState<{ value: string; label: string }[]>(project?.metrics ?? []);
  const [preview, setPreview] = useState(false);

  const trimmed = (s: string) => (s.trim() ? s.trim() : undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title: title.trim(),
      blurb: trimmed(blurb),
      summary: trimmed(summary),
      content: trimmed(content),
      year: trimmed(year),
      kind: trimmed(kind),
      status,
      stack,
      gallery,
      metrics: metrics.filter((m) => m.value.trim() || m.label.trim()),
      live: trimmed(live),
      repo: trimmed(repo),
      coverAccent,
      coverColor,
      coverHeight,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Sticky bar */}
      <div className="sticky top-0 z-20 -mx-7 mb-10 flex items-center justify-between gap-4 border-b border-border bg-background/85 px-7 py-3 backdrop-blur">
        <Button asChild variant="ghost" size="sm" className="h-8 gap-1.5 px-2 font-mono text-[12px] text-[#6E6E78] hover:text-[#FF6B6B]">
          <Link href="/admin?tab=projects">
            <ArrowLeft size={13} /> projects
          </Link>
        </Button>

        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-[#6E6E78]">{isEdit ? 'editing' : 'draft'}</span>
          <Button type="submit" size="sm" disabled={saving || !title.trim()} className="h-8 font-mono text-[12px] font-semibold">
            {saving ? 'Saving…' : isEdit ? 'Save' : 'Create'}
          </Button>
        </div>
      </div>

      {/* Title */}
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Untitled"
        autoFocus={!isEdit}
        className="h-auto border-none bg-transparent p-0 font-[family-name:var(--font-space-grotesk)] text-[clamp(30px,4vw,40px)] font-semibold leading-[1.15] tracking-[-0.03em] shadow-none placeholder:text-[#313139] focus-visible:ring-0 md:text-[clamp(30px,4vw,40px)]"
      />

      {/* Blurb — page subtitle */}
      <Input
        value={blurb}
        onChange={(e) => setBlurb(e.target.value)}
        placeholder="Add a short description…"
        className={cn(field, '-ml-2 mb-6 mt-1 h-9 text-[15px] text-[#A1A1AA]')}
      />

      {/* ── Properties ─────────────────────────────────────────────────── */}
      <div className="-ml-2 flex flex-col gap-0.5">
        <Row icon={Calendar} label="Year">
          <Input value={year} onChange={(e) => setYear(e.target.value)} placeholder="Empty" className={field} />
        </Row>

        <Row icon={Shapes} label="Kind">
          <Select value={kind || NONE} onValueChange={(v) => setKind(v === NONE ? '' : v)}>
            <SelectTrigger
              size="sm"
              className={cn(field, 'w-full justify-between data-[size=sm]:h-8', !kind && 'text-[#45454E]')}
            >
              <SelectValue placeholder="Empty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE} className="text-[#6E6E78]">Empty</SelectItem>
              {KIND_OPTIONS.map((k) => (
                <SelectItem key={k} value={k}>{k}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Row>

        <Row icon={CircleDot} label="Status">
          <div className="flex gap-1.5 px-2 py-1">
            {(['live', 'archived'] as const).map((s) => {
              const on = status === s;
              const color = s === 'live' ? '#10B981' : '#6E6E78';
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

        <Row icon={Layers} label="Stack">
          <ChipInput values={stack} onChange={setStack} placeholder="Type and press Enter…" />
        </Row>

        <Row icon={Link2} label="Live URL">
          <Input value={live} onChange={(e) => setLive(e.target.value)} placeholder="Empty" className={field} />
        </Row>

        <Row icon={Github} label="Repo URL">
          <Input value={repo} onChange={(e) => setRepo(e.target.value)} placeholder="Empty" className={field} />
        </Row>

        <Row icon={Text} label="Summary" align="start">
          <Textarea
            rows={2}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Intro paragraph shown above the body…"
            className={cn(field, 'h-auto min-h-0 resize-y py-1.5 leading-relaxed')}
          />
        </Row>

        <Row icon={BarChart3} label="Metrics" align="start">
          <div className="flex flex-col gap-1.5 px-2 py-1">
            {metrics.map((m, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  value={m.value}
                  placeholder="80%+"
                  onChange={(e) => setMetrics((p) => p.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))}
                  className={cn(field, 'flex-1 font-mono text-[13px]')}
                />
                <Input
                  value={m.label}
                  placeholder="model accuracy"
                  onChange={(e) => setMetrics((p) => p.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))}
                  className={cn(field, 'flex-[2] text-[13px]')}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setMetrics((p) => p.filter((_, j) => j !== i))}
                  className="size-7 shrink-0 text-[#6E6E78] hover:bg-destructive/10 hover:text-destructive"
                >
                  <X size={13} />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setMetrics((m) => [...m, { value: '', label: '' }])}
              className="h-7 w-fit gap-1.5 px-1 font-mono text-[12px] font-normal text-[#6E6E78] hover:bg-transparent hover:text-[#FF6B6B]"
            >
              <Plus size={12} /> Add metric
            </Button>
          </div>
        </Row>

        <Row icon={Images} label="Gallery">
          <ChipInput values={gallery} onChange={setGallery} placeholder="Caption or image URL…" />
        </Row>

        <Row icon={Palette} label="Cover">
          <div className="flex flex-wrap items-center gap-2 px-2 py-1">
            {[
              { v: coverAccent, set: setCoverAccent, title: 'Accent' },
              { v: coverColor, set: setCoverColor, title: 'Background' },
            ].map((c) => (
              <div key={c.title} className="flex items-center gap-1.5">
                <Input
                  type="color"
                  value={c.v}
                  title={c.title}
                  onChange={(e) => c.set(e.target.value)}
                  className="size-6 shrink-0 cursor-pointer rounded-md border-border bg-transparent p-0.5 shadow-none focus-visible:ring-0"
                />
                <span className="font-mono text-[11.5px] text-[#A1A1AA]">{c.v}</span>
              </div>
            ))}
            <span className="ml-1 font-mono text-[11.5px] text-[#6E6E78]">h</span>
            <Input
              type="number"
              value={coverHeight}
              onChange={(e) => setCoverHeight(Number(e.target.value))}
              className={cn(field, 'w-[72px] font-mono text-[12.5px]')}
            />
          </div>
        </Row>
      </div>

      <Separator className="my-8" />

      {/* ── Body ───────────────────────────────────────────────────────── */}
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#6E6E78]">body · markdown</span>
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
          <div className="min-h-[460px]">
            {content.trim()
              ? <Prose>{content}</Prose>
              : <span className="font-mono text-[13px] text-[#6E6E78]">Nothing to preview yet.</span>}
          </div>
        ) : (
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={""}
            className="min-h-[460px] resize-y border-none bg-transparent p-0 font-mono text-[13.5px] leading-[1.85] text-[#C7C7CE] shadow-none placeholder:text-[#3A3A42] focus-visible:ring-0 md:text-[13.5px]"
          />
        )}
      </div>
    </form>
  );
}
