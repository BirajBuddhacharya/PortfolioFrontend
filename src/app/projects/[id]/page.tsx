import { notFound } from 'next/navigation';
import { getProject, getProfile, getContactLinks } from '../../../lib/serverApi';
import { pageMetadata, toDescription, SITE_URL } from '../../../lib/seo';
import { ProjectDetailView } from './ProjectDetailView';
import type { Metadata } from 'next';

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) return { title: 'Project not found' };

  return pageMetadata({
    title: `${project.title} | Biraj Buddhacharya`,
    description: toDescription(project.summary || project.blurb || project.content),
    path: `/projects/${id}`,
    type: 'article',
  });
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [project, profile, contactLinks] = await Promise.all([
    getProject(id),
    getProfile(),
    getContactLinks(),
  ]);
  if (!project) notFound();

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: toDescription(project.summary || project.blurb || project.content),
    url: `${SITE_URL}/projects/${id}`,
    ...(project.updatedAt ? { dateModified: project.updatedAt } : {}),
    ...(project.stack.length ? { keywords: project.stack.join(', ') } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
      <ProjectDetailView project={project} profile={profile} contactLinks={contactLinks} />
    </>
  );
}
