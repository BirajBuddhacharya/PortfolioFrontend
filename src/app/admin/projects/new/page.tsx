'use client';

import { useRouter } from 'next/navigation';
import { ProjectForm } from '../../../../components/admin/ProjectForm';
import { useCreateProject } from '../../../../services/projectsService';

export default function NewProjectPage() {
  const router = useRouter();
  const createProject = useCreateProject();

  return (
    <div style={{ background: '#09090B', color: '#EDEDEF', minHeight: '100vh' }}>
      <main className="max-w-[820px] mx-auto px-7 pb-12">
        <ProjectForm
          saving={createProject.isPending}
          onSave={(data) =>
            createProject.mutate(data, {
              onSuccess: () => router.push('/admin?tab=projects'),
            })
          }
        />
      </main>
    </div>
  );
}
