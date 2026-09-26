import { notFound } from 'next/navigation';
import { getPost, getProfile, getContactLinks } from '../../../lib/serverApi';
import { pageMetadata, toDescription, SITE_URL, SITE_NAME } from '../../../lib/seo';
import { PostView } from './PostView';
import type { Metadata } from 'next';

export const revalidate = 60;

const formatDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) return { title: 'Post not found' };

  return pageMetadata({
    title: `${post.title} | Biraj Buddhacharya`,
    description: toDescription(post.excerpt || post.content),
    path: `/blog/${id}`,
    type: 'article',
    image: post.coverImage,
    publishedTime: post.publishedAt,
    tags: post.tags,
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, profile, contactLinks] = await Promise.all([
    getPost(id),
    getProfile(),
    getContactLinks(),
  ]);
  if (!post) notFound();

  const description = toDescription(post.excerpt || post.content);
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description,
    datePublished: post.publishedAt ?? post.createdAt,
    dateModified: post.updatedAt,
    author: { '@type': 'Person', name: SITE_NAME },
    ...(post.coverImage ? { image: post.coverImage } : {}),
    mainEntityOfPage: `${SITE_URL}/blog/${id}`,
  };

  const view = {
    id: post.id,
    title: post.title,
    content: post.content,
    coverImage: post.coverImage,
    tags: post.tags,
    date: formatDate(post.publishedAt ?? post.createdAt),
    readTime: `${post.readTime} min`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
      <PostView post={view} profile={profile} contactLinks={contactLinks} />
    </>
  );
}
