import { OG_SIZE, OG_CONTENT_TYPE, buildOgImage } from '../../../lib/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OgImage() {
  return buildOgImage({
    label: 'Blog',
    title: 'Notes from the build',
    description: 'Systems, ML, and the occasional postmortem.',
  });
}
