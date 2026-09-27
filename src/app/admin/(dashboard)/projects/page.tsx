'use client';

import { useState } from 'react';
import { Pencil, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/components/ui/button';
import { Badge } from '@/components/components/ui/badge';
import { Input } from '@/components/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/components/ui/dialog';
import { useAdminProjects } from '../../../../services/adminService';
import { useDeleteProject, useUpdateProject } from '../../../../services/projectsService';
import { BORDER, TEXT, TEXT2, MUTED, ACCENT, mono, heading, formField, newButton, tableHead, rowButton, SectionLabel, StatusSelect, ConfirmDelete } from '../../../../components/admin/adminUi';
import { cn } from '@/components/lib/utils';
import type { Project } from '../../../../types/project';

const PROJECT_STATUSES = ['live', 'archived'];

export default function AdminProjectsPage() {
  const { data: projects = [] } = useAdminProjects();
  const deleteProject = useDeleteProject();
  const updateProject = useUpdateProject();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [preview, setPreview] = useState<Project | null>(null);

  const filtered = projects.filter((p) => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <SectionLabel>all projects</SectionLabel>
        <Button asChild variant="outline" size="sm" className={newButton}>
          <Link href="/admin/projects/new">+ New project</Link>
        </Button>
      </div>

      {/* Search + filter */}
      <div className="flex gap-3 mb-4 items-center flex-wrap">
        <Input
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={cn(formField, 'h-auto px-3 py-[7px] text-[13px] max-w-[220px]')}
        />
        <div className="flex gap-1">
          {['all', ...PROJECT_STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className="px-3 py-[5px] rounded-[7px] text-[11px] border transition-colors duration-150 cursor-pointer"
              style={{
                fontFamily: mono,
                background: statusFilter === s ? 'rgba(255,107,107,0.12)' : 'transparent',
                borderColor: statusFilter === s ? 'rgba(255,107,107,0.4)' : BORDER,
                color: statusFilter === s ? '#FF6B6B' : MUTED,
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-[16px] border overflow-hidden" style={{ borderColor: BORDER }}>
        <Table>
          <TableHeader>
            <TableRow className="bg-white/[0.02] hover:bg-white/[0.02]">
              {['Project', 'Type', 'Year', 'Status', 'Actions'].map((h) => (
                <TableHead key={h} className={tableHead}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-16">
                  <div className="flex flex-col items-center gap-3">
                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                      <rect x="3" y="3" width="30" height="30" rx="6" stroke="#26262B" strokeWidth="1.5"/>
                      <path d="M10 13h16M10 18h16M10 23h10" stroke="#3F3F46" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span className="text-[12px]" style={{ fontFamily: mono, color: MUTED }}>
                      {search || statusFilter !== 'all' ? 'no matching projects' : 'no projects yet — add one above'}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {filtered.map((p) => (
              <TableRow
                key={p.id}
                className="cursor-pointer"
                onClick={() => setPreview(p)}
              >
                <TableCell className="px-5 py-[14px] text-[13.5px] font-medium" style={{ color: TEXT }}>{p.title}</TableCell>
                <TableCell className="px-5 py-[14px] text-[12.5px]" style={{ fontFamily: mono, color: TEXT2 }}>{p.kind ?? '—'}</TableCell>
                <TableCell className="px-5 py-[14px] text-[12.5px]" style={{ fontFamily: mono, color: MUTED }}>{p.year ?? '—'}</TableCell>
                <TableCell className="px-5 py-[14px]">
                  <StatusSelect
                    status={p.status}
                    options={PROJECT_STATUSES}
                    disabled={updateProject.isPending}
                    onValueChange={(val) => updateProject.mutate({ id: p.id, status: val })}
                  />
                </TableCell>
                <TableCell className="px-5 py-[14px]" onClick={(e) => e.stopPropagation()}>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="xs" className={cn(rowButton, 'px-2')}>
                      <Link href={`/admin/projects/${p.slug}/edit`}><Pencil size={13} /></Link>
                    </Button>
                    <ConfirmDelete
                      title="Delete this project?"
                      description={`"${p.title}" will be removed from your portfolio. This can't be undone.`}
                      disabled={deleteProject.isPending}
                      onConfirm={() => deleteProject.mutate(p.id)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Preview modal */}
      <Dialog open={!!preview} onOpenChange={(open) => !open && setPreview(null)}>
        <DialogContent className="max-w-[520px] bg-[#0C0C0F] border-white/[0.08] p-0 overflow-hidden rounded-[20px]">
          {preview && (
            <>
              {/* Accent bar */}
              <div
                className="h-[6px] w-full"
                style={{ background: preview.coverAccent || ACCENT }}
              />
              <div className="p-6">
                <DialogHeader className="mb-4">
                  <div className="flex items-start justify-between gap-3">
                    <DialogTitle
                      className="text-[20px] font-semibold leading-[1.25]"
                      style={{ fontFamily: heading, color: TEXT }}
                    >
                      {preview.title}
                    </DialogTitle>
                    <span
                      className="shrink-0 text-[10px] px-[9px] py-[3px] rounded-full border mt-[3px]"
                      style={{
                        fontFamily: mono,
                        background: preview.status === 'live' ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.04)',
                        borderColor: preview.status === 'live' ? 'rgba(16,185,129,0.25)' : BORDER,
                        color: preview.status === 'live' ? '#10B981' : MUTED,
                      }}
                    >
                      {preview.status}
                    </span>
                  </div>
                  {(preview.kind || preview.year) && (
                    <div className="text-[12px] mt-1" style={{ fontFamily: mono, color: MUTED }}>
                      {[preview.kind, preview.year].filter(Boolean).join(' · ')}
                    </div>
                  )}
                </DialogHeader>

                {preview.blurb && (
                  <p className="text-[14px] leading-[1.65] mb-4" style={{ color: TEXT2 }}>
                    {preview.blurb}
                  </p>
                )}

                {preview.stack?.length > 0 && (
                  <div className="flex flex-wrap gap-[6px] mb-5">
                    {preview.stack.map((s) => (
                      <Badge
                        key={s}
                        variant="outline"
                        className="border-border bg-white/[0.04] px-[9px] py-[3px] font-mono text-[10.5px] font-normal text-[#A1A1AA]"
                      >
                        {s}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 pt-2 border-t" style={{ borderColor: BORDER }}>
                  <Button asChild variant="outline" size="sm" className={cn(rowButton, 'gap-1.5')}>
                    <Link href={`/projects/${preview.slug}`} target="_blank">
                      <ExternalLink size={12} /> View public page
                    </Link>
                  </Button>
                  {preview.live && (
                    <Button asChild variant="outline" size="sm" className={cn(rowButton, 'gap-1.5')}>
                      <a href={preview.live} target="_blank" rel="noopener noreferrer">
                        <ExternalLink size={12} /> Live
                      </a>
                    </Button>
                  )}
                  {preview.repo && (
                    <Button asChild variant="outline" size="sm" className={cn(rowButton, 'gap-1.5')}>
                      <a href={preview.repo} target="_blank" rel="noopener noreferrer">
                        <ExternalLink size={12} /> Repo
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
