import { getProjects } from '../../../lib/serverApi';
import { pageMetadata } from '../../../lib/seo';
import { ProjectsView } from './ProjectsView';

export const revalidate = 60;

export const metadata = pageMetadata({
  title: 'Projects | Biraj Buddhacharya',
  description:
    'Client freelance builds, product work, and machine-learning experiments that made it past the notebook.',
  path: '/projects',
});

export default async function ProjectsPage() {
  const projects = await getProjects();
  return <ProjectsView projects={projects} />;
}
