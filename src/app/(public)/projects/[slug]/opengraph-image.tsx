import { OG_SIZE, OG_CONTENT_TYPE, buildOgImage } from '../../../../lib/og';
import { getProject } from '../../../../lib/serverApi';
import { toDescription } from '../../../../lib/seo';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  return buildOgImage({
    label: 'Project',
    title: project?.title ?? 'Project',
    description: toDescription(project?.summary ?? project?.blurb ?? project?.content),
    tags: project?.stack,
  });
}
