import { OG_SIZE, OG_CONTENT_TYPE, buildOgImage } from '../../../lib/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OgImage() {
  return buildOgImage({
    label: 'Projects',
    title: 'Things I\'ve built',
    description:
      'Client work, product builds, and ML experiments that made it past the notebook.',
  });
}
