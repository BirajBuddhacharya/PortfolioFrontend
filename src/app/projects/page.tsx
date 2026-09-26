import { getProjects, getProfile, getContactLinks } from '../../lib/serverApi';
import { pageMetadata } from '../../lib/seo';
import { ProjectsView } from './ProjectsView';

export const revalidate = 60;

export const metadata = pageMetadata({
  title: 'Projects | Biraj Buddhacharya',
  description:
    'Client freelance builds, product work, and machine-learning experiments that made it past the notebook.',
  path: '/projects',
});

export default async function ProjectsPage() {
  const [projects, profile, contactLinks] = await Promise.all([
    getProjects(),
    getProfile(),
    getContactLinks(),
  ]);
  return <ProjectsView projects={projects} profile={profile} contactLinks={contactLinks} />;
}
