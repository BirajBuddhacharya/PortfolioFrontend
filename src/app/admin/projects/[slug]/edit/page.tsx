'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProjectForm } from '../../../../../components/admin/ProjectForm';
import { ProjectFormSkeleton } from '../../../../../components/admin/ProjectFormSkeleton';
import { useProjectDetail, useUpdateProject } from '../../../../../services/projectsService';

const mono = 'var(--font-jetbrains-mono), monospace';

export default function EditProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const { data: project, isLoading, isError } = useProjectDetail(slug);
  const updateProject = useUpdateProject();

  return (
    <div style={{ background: '#09090B', color: '#EDEDEF', minHeight: '100vh' }}>
      <main className="max-w-[820px] mx-auto px-7 pb-12">
        {isLoading && <ProjectFormSkeleton />}

        {isError && (
          <div className="pt-12 flex flex-col gap-3">
            <p style={{ color: '#8A8A93' }}>Project not found.</p>
            <Link href="/admin/projects" style={{ color: '#FF6B6B', fontFamily: mono, fontSize: 13 }}>
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
                { id: project.id, ...data },
                { onSuccess: () => router.push('/admin/projects') },
              )
            }
          />
        )}
      </main>
    </div>
  );
}
