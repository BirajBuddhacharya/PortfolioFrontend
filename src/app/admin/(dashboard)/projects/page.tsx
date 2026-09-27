'use client';

import { useState } from 'react';
import { Pencil } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/components/ui/button';
import { Input } from '@/components/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/components/ui/table';
import { useAdminProjects } from '../../../../services/adminService';
import { useDeleteProject, useUpdateProject } from '../../../../services/projectsService';
import { BORDER, TEXT, TEXT2, MUTED, mono, formField, newButton, tableHead, rowButton, SectionLabel, StatusSelect, ConfirmDelete } from '../../../../components/admin/adminUi';
import { cn } from '@/components/lib/utils';

const PROJECT_STATUSES = ['live', 'archived'];

export default function AdminProjectsPage() {
  const { data: projects = [] } = useAdminProjects();
  const deleteProject = useDeleteProject();
  const updateProject = useUpdateProject();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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
              <TableRow key={p.id}>
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
                <TableCell className="px-5 py-[14px]">
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="xs" className={cn(rowButton, 'px-2')}>
                      <Link href={`/admin/projects/${p.id}/edit`}><Pencil size={13} /></Link>
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
    </div>
  );
}
