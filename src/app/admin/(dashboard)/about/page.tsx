'use client';

import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/components/ui/button';
import { Input } from '@/components/components/ui/input';
import { Textarea } from '@/components/components/ui/textarea';
import { Card } from '@/components/components/ui/card';
import { cn } from '@/components/lib/utils';
import { Skeleton } from '@/components/components/ui/skeleton';
import { useAdminAbout, useUpdateProfile } from '../../../../services/adminService';
import { useAboutEducation } from '../../../../services/aboutService';
import { BORDER, MUTED, TEXT, ACCENT, mono, heading, formField, addButton, saveButton, rowDangerButton, SectionLabel } from '../../../../components/admin/adminUi';
import { ImageUploadButton } from '../../../../components/admin/ImageUploadButton';

export default function AdminAboutPage() {
  const { data: about, isLoading } = useAdminAbout();
  const updateProfile = useUpdateProfile();

  const [headline, setHeadline] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [facts, setFacts] = useState<{ k: string; v: string }[]>([]);
  const [stats, setStats] = useState<{ value: string; label: string }[]>([]);
  const hydrated = useRef(false);

  useEffect(() => {
    if (about && !hydrated.current) {
      hydrated.current = true;
      setHeadline(about.headline ?? '');
      setCoverImage(about.coverImage ?? '');
      setParagraphs(about.paragraphs ?? []);
      setFacts((about.facts ?? []).map((f) => ({ k: (f as { k?: string }).k ?? '', v: (f as { v?: string }).v ?? '' })));
      setStats((about.stats ?? []).map((s) => ({ value: (s as { value?: string }).value ?? '', label: (s as { label?: string }).label ?? '' })));
    }
  }, [about]);

  const handleSave = () => {
    updateProfile.mutate(
      {
        headline,
        coverImage: coverImage || undefined,
        paragraphs: paragraphs.filter((p) => p.trim()),
        facts: facts.filter((f) => f.k.trim() || f.v.trim()),
        stats: stats.filter((s) => s.value.trim() || s.label.trim()),
      },
      { onSuccess: () => toast.success('Saved') },
    );
  };

  const { data: educationEntries = [] } = useAboutEducation();

  if (isLoading) {
    return (
      <div className="max-w-[860px] flex flex-col gap-10">
        {/* Headline */}
        <div>
          <Skeleton className="h-3 w-28 mb-3 rounded-[4px]" />
          <Skeleton className="h-10 w-full rounded-[10px]" />
          <Skeleton className="h-2.5 w-64 mt-2 rounded-[4px]" />
        </div>
        {/* Cover image */}
        <div>
          <Skeleton className="h-3 w-24 mb-3 rounded-[4px]" />
          <Skeleton className="h-10 w-full rounded-[10px]" />
        </div>
        {/* Bio paragraphs */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-3 w-28 rounded-[4px]" />
            <Skeleton className="h-7 w-28 rounded-[8px]" />
          </div>
          <div className="flex flex-col gap-3">
            {[0, 1].map((i) => <Skeleton key={i} className="h-20 w-full rounded-[10px]" />)}
          </div>
        </div>
        {/* Stats */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-3 w-12 rounded-[4px]" />
            <Skeleton className="h-7 w-24 rounded-[8px]" />
          </div>
          <div className="flex flex-col gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 items-center">
                <Skeleton className="h-9 w-[120px] shrink-0 rounded-[9px]" />
                <Skeleton className="h-9 flex-1 rounded-[9px]" />
                <Skeleton className="h-9 w-12 shrink-0 rounded-[9px]" />
              </div>
            ))}
          </div>
        </div>
        {/* Facts */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-3 w-36 rounded-[4px]" />
            <Skeleton className="h-7 w-24 rounded-[8px]" />
          </div>
          <div className="flex flex-col gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex gap-3 items-center">
                <Skeleton className="h-9 w-[180px] shrink-0 rounded-[9px]" />
                <Skeleton className="h-9 flex-1 rounded-[9px]" />
                <Skeleton className="h-9 w-12 shrink-0 rounded-[9px]" />
              </div>
            ))}
          </div>
        </div>
        {/* Save button */}
        <Skeleton className="h-10 w-32 rounded-[10px]" />
      </div>
    );
  }

  return (
    <div className="max-w-[860px] flex flex-col gap-10">

      {/* ── Headline ── */}
      <div>
        <SectionLabel>page headline</SectionLabel>
        <Input
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          placeholder="e.g. ML engineer with a full-stack habit"
          className={cn(formField, 'h-auto px-4 py-[10px] text-[15px] font-semibold tracking-[-0.02em] md:text-[15px]')}
          style={{ fontFamily: heading }}
        />
        <div className="text-[11px] mt-2" style={{ fontFamily: mono, color: MUTED }}>
          The accent dot (.) is appended automatically on the public page.
        </div>
      </div>

      {/* ── Cover image ── */}
      <div>
        <SectionLabel>cover image</SectionLabel>
        <div className="flex gap-2 items-center">
          <Input
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="https://example.com/portrait.jpg  (or leave blank for placeholder)"
            className={cn(formField, 'flex-1 h-auto px-4 py-[10px]')}
          />
          <ImageUploadButton onUploaded={(url) => setCoverImage(url)} />
        </div>
        {coverImage && (
          <div
            className="mt-3 rounded-[12px] border overflow-hidden"
            style={{ borderColor: BORDER, maxWidth: 160, aspectRatio: '4/5' }}
          >
            <img
              src={coverImage}
              alt="cover preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}
      </div>

      {/* ── Bio paragraphs ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <SectionLabel>bio paragraphs</SectionLabel>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setParagraphs((prev) => [...prev, ''])}
            className={addButton}
          >
            + add paragraph
          </Button>
        </div>
        <div className="flex flex-col gap-3">
          {paragraphs.map((p, i) => (
            <div key={i} className="flex gap-2 items-start">
              <Textarea
                value={p}
                onChange={(e) => setParagraphs((prev) => prev.map((x, j) => j === i ? e.target.value : x))}
                rows={3}
                className={cn(formField, 'flex-1 resize-none px-4 py-3 leading-relaxed')}
              />
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={() => setParagraphs((prev) => prev.filter((_, j) => j !== i))}
                className={cn(rowDangerButton, 'mt-[1px] shrink-0 py-[7px]')}
              >
                del
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* ── Stats ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <SectionLabel>stats</SectionLabel>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setStats((prev) => [...prev, { value: '', label: '' }])}
            className={addButton}
          >
            + add stat
          </Button>
        </div>
        <div className="flex flex-col gap-3">
          {stats.map((s, i) => (
            <div key={i} className="flex gap-3 items-center">
              <Input
                value={s.value}
                onChange={(e) => setStats((prev) => prev.map((row, j) => j === i ? { ...row, value: e.target.value } : row))}
                placeholder="3+"
                className={cn(formField, 'h-auto w-[120px] shrink-0 rounded-[9px] px-3 py-[8px] font-mono text-[12px] md:text-[12px]')}
              />
              <Input
                value={s.label}
                onChange={(e) => setStats((prev) => prev.map((row, j) => j === i ? { ...row, label: e.target.value } : row))}
                placeholder="years experience"
                className={cn(formField, 'h-auto flex-1 rounded-[9px] px-3 py-[8px]')}
              />
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={() => setStats((prev) => prev.filter((_, j) => j !== i))}
                className={cn(rowDangerButton, 'shrink-0 py-[7px]')}
              >
                del
              </Button>
            </div>
          ))}
        </div>
        <div className="text-[11px] mt-2" style={{ fontFamily: mono, color: MUTED }}>
          Displayed in the homepage stats strip.
        </div>
      </div>

      {/* ── Beyond the keyboard (facts) ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <SectionLabel>beyond the keyboard</SectionLabel>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setFacts((prev) => [...prev, { k: '', v: '' }])}
            className={addButton}
          >
            + add fact
          </Button>
        </div>
        <div className="flex flex-col gap-3">
          {facts.map((f, i) => (
            <div key={i} className="flex gap-3 items-center">
              <Input
                value={f.k ?? ''}
                onChange={(e) => setFacts((prev) => prev.map((row, j) => j === i ? { ...row, k: e.target.value } : row))}
                placeholder="label"
                className={cn(formField, 'h-auto w-[180px] shrink-0 rounded-[9px] px-3 py-[8px] font-mono text-[12px] md:text-[12px]')}
              />
              <Input
                value={f.v ?? ''}
                onChange={(e) => setFacts((prev) => prev.map((row, j) => j === i ? { ...row, v: e.target.value } : row))}
                placeholder="value"
                className={cn(formField, 'h-auto flex-1 rounded-[9px] px-3 py-[8px]')}
              />
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={() => setFacts((prev) => prev.filter((_, j) => j !== i))}
                className={cn(rowDangerButton, 'shrink-0 py-[7px]')}
              >
                del
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* ── Save ── */}
      <Button
        type="button"
        onClick={handleSave}
        disabled={updateProfile.isPending}
        className={saveButton}
      >
        {updateProfile.isPending ? 'Saving…' : 'Save changes'}
      </Button>

    </div>
  );
}
