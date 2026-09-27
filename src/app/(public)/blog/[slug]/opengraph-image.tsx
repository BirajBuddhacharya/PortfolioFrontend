import { OG_SIZE, OG_CONTENT_TYPE, buildOgImage } from '../../../../lib/og';
import { getBlog } from '../../../../lib/serverApi';
import { toDescription } from '../../../../lib/seo';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlog(slug);
  return buildOgImage({
    label: 'Blog Post',
    title: post?.title ?? 'Blog Post',
    description: toDescription(post?.excerpt ?? post?.content),
    tags: post?.tags,
  });
}
