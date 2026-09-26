import { getPosts, getProfile, getContactLinks } from '../../lib/serverApi';
import { pageMetadata } from '../../lib/seo';
import { BlogView } from './BlogView';

export const revalidate = 60;

export const metadata = pageMetadata({
  title: 'Blog | Biraj Buddhacharya',
  description: 'Notes from the build — systems, ML, and the occasional postmortem.',
  path: '/blog',
});

const formatDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

export default async function BlogPage() {
  const [posts, profile, contactLinks] = await Promise.all([
    getPosts(),
    getProfile(),
    getContactLinks(),
  ]);

  const items = posts.map((p) => ({
    id: p.id,
    title: p.title,
    excerpt: p.excerpt,
    coverImage: p.coverImage,
    tags: p.tags,
    date: formatDate(p.publishedAt ?? p.createdAt),
    readTime: `${p.readTime} min`,
  }));

  return <BlogView posts={items} profile={profile} contactLinks={contactLinks} />;
}
