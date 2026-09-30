'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/components/ui/button';
import { Input } from '@/components/components/ui/input';
import { Textarea } from '@/components/components/ui/textarea';
import { Badge } from '@/components/components/ui/badge';
import { Label } from '@/components/components/ui/label';
import { Card } from '@/components/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/components/ui/alert-dialog';
import { cn } from '@/components/lib/utils';
import type { ResumeSection, CreateResumeItemPayload, UpdateResumeItemPayload } from '../../types/resume';
import type { CreateContactLinkPayload, UpdateContactLinkPayload } from '../../types/contact';

// ─── types shared across admin tabs ────────────────────────────────────────────
export type ResumeRow = { id?: string; title: string; period: string; organization: string; location?: string; body: string };
export type SkillRow = { id?: string; title: string; body: string };
export type ContactLinkRow = { id?: string; label: string; value: string; href: string };
export interface InboxMsg { id: number; name: string; email: string; subject: string; body: string; time: string; read: boolean; }

// ─── design tokens ────────────────────────────────────────────────────────────
export const BG = '#09090B';
export const SURFACE = '#0C0C0F';
export const BORDER = 'rgba(255,255,255,0.07)';
export const ACCENT = '#FF6B6B';
export const MUTED = '#6E6E78';
export const TEXT = '#EDEDEF';
export const TEXT2 = '#A1A1AA';

export const mono = 'var(--font-jetbrains-mono), monospace';
export const heading = 'var(--font-space-grotesk), sans-serif';
export const body = 'var(--font-sora), system-ui, sans-serif';

/** Bordered dark form field — the default look for the admin edit forms. */
export const formField =
  'rounded-[10px] border-border bg-[#131317] text-[13.5px] shadow-none ' +
  'placeholder:text-[#3F3F46] focus-visible:border-[#FF6B6B]/55 focus-visible:ring-0';

/** Small accent-outlined "+ add" action used across the resume/about editors. */
export const addButton =
  'h-auto rounded-[8px] border-[#FF6B6B]/[0.27] bg-[#FF6B6B]/10 px-3 py-[5px] ' +
  'font-mono text-[11px] font-normal text-[#FF6B6B] hover:bg-[#FF6B6B]/20 hover:text-[#FF6B6B]';

/** Primary accent save button shared by the About / resume / settings tabs. */
export const saveButton =
  'h-auto self-start rounded-[12px] px-6 py-[10px] font-mono text-[13px] font-medium text-[#111]';

/** Dashboard panel: Card stripped of its default airy padding to keep density. */
export const dashCard =
  'flex h-full flex-col gap-0 rounded-[16px] border-border bg-[#111115] p-5 shadow-none';

/** Editor/resume sub-panel card. */
export const panelCard =
  'flex flex-col gap-3 rounded-[14px] border-border bg-[#111115] p-4 shadow-none';

/** Accent-outlined "+ New …" button above the project/post tables. */
export const newButton =
  'h-auto rounded-[10px] border-[#FF6B6B]/[0.27] bg-[#FF6B6B]/10 px-4 py-2 ' +
  'font-mono text-[12px] font-normal text-[#FF6B6B] hover:bg-[#FF6B6B]/20 hover:text-[#FF6B6B]';

/** Table header cell. */
export const tableHead =
  'h-auto px-5 py-3 font-mono text-[10.5px] font-normal uppercase tracking-[0.12em] text-[#6E6E78]';

/** Small in-row action button. */
export const rowButton =
  'h-auto rounded-[8px] border-border bg-transparent px-3 py-1 font-mono text-[11px] font-normal text-[#A1A1AA] hover:text-[#EDEDEF]';

/** Field label inside the resume/skills entry cards. */
export const resumeLabel = 'mb-1 block font-mono text-[10.5px] font-normal text-[#6E6E78]';

/** Destructive twin of {@link rowButton}. */
export const rowDangerButton =
  'h-auto rounded-[8px] border-destructive/30 bg-destructive/10 px-3 py-1 font-mono text-[11px] font-normal text-destructive hover:bg-destructive/20 hover:text-destructive';

/** Destructive action guarded by a confirmation dialog. */
export function ConfirmDelete({
  title,
  description,
  onConfirm,
  disabled,
  className,
}: {
  title: string;
  description: string;
  onConfirm: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" variant="outline" size="xs" disabled={disabled} className={cn(rowDangerButton, 'px-2', className)}>
          <Trash2 size={13} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ─── Status badge ────────────────────────────────────────────────────────────
export function StatusBadge({ status }: { status: string }) {
  const isLive = status === 'live' || status === 'published';
  return (
    <Badge
      variant="outline"
      className={cn(
        'px-[9px] py-[3px] font-mono text-[10.5px] font-normal',
        isLive
          ? 'border-[#10B981]/25 bg-[#10B981]/10 text-[#10B981]'
          : 'border-border bg-white/[0.04] text-[#6E6E78]',
      )}
    >
      {status}
    </Badge>
  );
}

// ─── Inline status selector ───────────────────────────────────────────────────
export function StatusSelect({
  status,
  options,
  onValueChange,
  disabled,
}: {
  status: string;
  options: string[];
  onValueChange: (val: string) => void;
  disabled?: boolean;
}) {
  const isLive = status === 'live' || status === 'published';
  return (
    <Select value={status} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger
        className={cn(
          'h-auto px-[9px] py-[3px] font-mono text-[10.5px] font-normal border rounded-full gap-[5px] w-auto shadow-none ring-0 focus:ring-0 focus:ring-offset-0 cursor-pointer',
          isLive
            ? 'border-[#10B981]/25 bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/[0.15]'
            : 'border-border bg-white/[0.04] text-[#6E6E78] hover:bg-white/[0.07]',
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o} value={o} className="font-mono text-[12px]">{o}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// ─── Section heading ─────────────────────────────────────────────────────────
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="text-[10.5px] uppercase tracking-[0.14em] mb-4"
      style={{ fontFamily: mono, color: MUTED }}
    >
      {children}
    </div>
  );
}

// ─── Shared resume row save/diff ──────────────────────────────────────────────
export async function saveResumeRows(
  section: ResumeSection,
  rows: { id?: string; title: string; period?: string; organization?: string; location?: string; body?: string }[],
  originalIds: string[],
  extra: (row: (typeof rows)[number]) => Partial<CreateResumeItemPayload>,
  ops: {
    create: (p: CreateResumeItemPayload) => Promise<unknown>;
    update: (p: UpdateResumeItemPayload & { id: string }) => Promise<unknown>;
    del: (id: string) => Promise<unknown>;
  },
) {
  const currentIds = new Set(rows.filter((r) => r.id).map((r) => r.id!));
  const toDelete = originalIds.filter((id) => !currentIds.has(id));
  await Promise.all([
    ...toDelete.map((id) => ops.del(id)),
    ...rows.map((row, i) => {
      const payload = {
        title: row.title,
        organization: row.organization || undefined,
        period: row.period || undefined,
        location: row.location || undefined,
        order: i,
        ...extra(row),
      };
      return row.id ? ops.update({ id: row.id, ...payload }) : ops.create({ section, ...payload });
    }),
  ]);
}

// ─── Shared contact-link row save/diff ─────────────────────────────────────────
export async function saveContactLinks(
  rows: ContactLinkRow[],
  originalIds: string[],
  ops: {
    create: (p: CreateContactLinkPayload) => Promise<unknown>;
    update: (p: UpdateContactLinkPayload & { id: string }) => Promise<unknown>;
    del: (id: string) => Promise<unknown>;
  },
) {
  const currentIds = new Set(rows.filter((r) => r.id).map((r) => r.id!));
  const toDelete = originalIds.filter((id) => !currentIds.has(id));
  await Promise.all([
    ...toDelete.map((id) => ops.del(id)),
    ...rows.map((row, i) => {
      const payload = { label: row.label, value: row.value, href: row.href, order: i };
      return row.id ? ops.update({ id: row.id, ...payload }) : ops.create(payload);
    }),
  ]);
}

// ─── Shared resume row editor ─────────────────────────────────────────────────
export function ResumeRowEditor<T extends ResumeRow>({
  rows,
  setRows,
  addLabel,
}: {
  rows: T[];
  setRows: React.Dispatch<React.SetStateAction<T[]>>;
  addLabel: string;
}) {
  return (
    <>
      <div className="flex justify-end mb-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setRows((prev) => [...prev, { title: '', period: '', organization: '', location: '', body: '' } as T])}
          className={addButton}
        >
          {addLabel}
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        {rows.map((row, i) => (
          <Card key={i} className={panelCard}>
            <div className="flex items-center justify-between">
              <div className="text-[11px]" style={{ fontFamily: mono, color: MUTED }}>entry {i + 1}</div>
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={() => setRows((prev) => prev.filter((_, j) => j !== i))}
                className={cn(rowDangerButton, 'rounded-[7px] py-[4px] text-[10.5px]')}
              >
                remove
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {(['title', 'organization'] as const).map((f) => (
                <div key={f}>
                  <Label className={resumeLabel}>{f}</Label>
                  <Input
                    value={row[f]}
                    onChange={(e) => setRows((prev) => prev.map((r, j) => j === i ? { ...r, [f]: e.target.value } : r))}
                    className={cn(formField, 'h-auto rounded-[9px] px-3 py-[8px] text-[13px] md:text-[13px]')}
                  />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className={resumeLabel}>period</Label>
                <Input
                  value={row.period}
                  onChange={(e) => setRows((prev) => prev.map((r, j) => j === i ? { ...r, period: e.target.value } : r))}
                  placeholder="e.g. 2023 — present"
                  className={cn(formField, 'h-auto rounded-[9px] px-3 py-[8px] text-[13px] md:text-[13px]')}
                />
              </div>
              <div>
                <Label className={resumeLabel}>location</Label>
                <Input
                  value={row.location ?? ''}
                  onChange={(e) => setRows((prev) => prev.map((r, j) => j === i ? { ...r, location: e.target.value } : r))}
                  placeholder="e.g. Remote, Kathmandu"
                  className={cn(formField, 'h-auto rounded-[9px] px-3 py-[8px] text-[13px] md:text-[13px]')}
                />
              </div>
            </div>
            <div>
              <Label className={resumeLabel}>body</Label>
              <Textarea
                value={row.body}
                onChange={(e) => setRows((prev) => prev.map((r, j) => j === i ? { ...r, body: e.target.value } : r))}
                rows={2}
                className={cn(formField, 'resize-none rounded-[9px] px-3 py-[8px] text-[13px] leading-relaxed md:text-[13px]')}
              />
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

export function AdminPagination({
  page,
  total,
  size,
  onPageChange,
}: {
  page: number;
  total: number;
  size: number;
  onPageChange: (p: number) => void;
}) {
  const totalPages = Math.ceil(total / size);
  if (totalPages <= 1) return null;
  const from = (page - 1) * size + 1;
  const to = Math.min(page * size, total);
  return (
    <div className="flex items-center justify-between pt-4 px-1">
      <span className="text-[12px]" style={{ fontFamily: mono, color: MUTED }}>
        {from}–{to} of {total}
      </span>
      <div className="flex gap-1">
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="px-3 py-[5px] rounded-[7px] text-[11px] border transition-colors duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ fontFamily: mono, borderColor: BORDER, color: MUTED }}
        >
          Prev
        </button>
        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="px-3 py-[5px] rounded-[7px] text-[11px] border transition-colors duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ fontFamily: mono, borderColor: BORDER, color: MUTED }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
