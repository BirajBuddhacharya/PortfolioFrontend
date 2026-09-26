'use client';

import Link from 'next/link';
import { Button } from '@/components/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/components/ui/table';
import { useAdminProjects } from '../../../../services/adminService';
import { useDeleteProject } from '../../../../services/projectsService';
import { BORDER, TEXT, TEXT2, MUTED, mono, newButton, tableHead, rowButton, SectionLabel, StatusBadge, ConfirmDelete } from '../../../../components/admin/adminUi';

export default function AdminProjectsPage() {
  const { data: projects = [] } = useAdminProjects();
  const deleteProject = useDeleteProject();

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <SectionLabel>all projects</SectionLabel>
        <Button asChild variant="outline" size="sm" className={newButton}>
          <Link href="/admin/projects/new">+ New project</Link>
        </Button>
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
            {projects.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="px-5 py-[14px] text-[13.5px] font-medium" style={{ color: TEXT }}>{p.title}</TableCell>
                <TableCell className="px-5 py-[14px] text-[12.5px]" style={{ fontFamily: mono, color: TEXT2 }}>{p.kind ?? '—'}</TableCell>
                <TableCell className="px-5 py-[14px] text-[12.5px]" style={{ fontFamily: mono, color: MUTED }}>{p.year ?? '—'}</TableCell>
                <TableCell className="px-5 py-[14px]"><StatusBadge status={p.status} /></TableCell>
                <TableCell className="px-5 py-[14px]">
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="xs" className={rowButton}>
                      <Link href={`/admin/projects/${p.id}/edit`}>edit</Link>
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
