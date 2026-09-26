'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProjectForm } from '../../../../../components/admin/ProjectForm';
import { useProjectDetail, useUpdateProject } from '../../../../../services/projectsService';

const mono = 'var(--font-jetbrains-mono), monospace';

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: project, isLoading, isError } = useProjectDetail(id);
  const updateProject = useUpdateProject();

  return (
    <div style={{ background: '#09090B', color: '#EDEDEF', minHeight: '100vh' }}>
      <main className="max-w-[820px] mx-auto px-7 pb-12">
        {isLoading && (
          <div className="pt-12 text-[13px]" style={{ fontFamily: mono, color: '#6E6E78' }}>Loading…</div>
        )}

        {isError && (
          <div className="pt-12 flex flex-col gap-3">
            <p style={{ color: '#8A8A93' }}>Project not found.</p>
            <Link href="/admin?tab=projects" style={{ color: '#FF6B6B', fontFamily: mono, fontSize: 13 }}>
              ← back to projects
            </Link>
          </div>
        )}

        {project && (
          <ProjectForm
            project={project}
            saving={updateProject.isPending}
            onSave={(data) =>
              updateProject.mutate(
                { id, ...data },
                { onSuccess: () => router.push('/admin?tab=projects') },
              )
            }
          />
        )}
      </main>
    </div>
  );
}
