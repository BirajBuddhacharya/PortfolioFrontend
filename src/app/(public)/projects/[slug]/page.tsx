import { notFound } from 'next/navigation';
import { getProject } from '../../../../lib/serverApi';
import { pageMetadata, toDescription, SITE_URL } from '../../../../lib/seo';
import { ProjectDetailView } from './ProjectDetailView';
import type { Metadata } from 'next';

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: 'Project not found' };

  return pageMetadata({
    title: `${project.title} | Biraj Buddhacharya`,
    description: toDescription(project.summary || project.blurb || project.content),
    path: `/projects/${slug}`,
    type: 'article',
  });
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: toDescription(project.summary || project.blurb || project.content),
    url: `${SITE_URL}/projects/${slug}`,
    ...(project.updatedAt ? { dateModified: project.updatedAt } : {}),
    ...(project.tags?.length ? { keywords: project.tags.map((t) => t.name).join(', ') } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
      <ProjectDetailView project={project} />
    </>
  );
}
