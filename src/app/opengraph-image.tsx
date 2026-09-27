import { OG_SIZE, OG_CONTENT_TYPE, buildOgImage } from '../lib/og';
import { getProfile } from '../lib/serverApi';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OgImage() {
  const profile = await getProfile();
  return buildOgImage({
    title: profile?.name ?? 'Biraj Buddhacharya',
    description:
      profile?.headline ??
      'ML Engineer & Full-stack Developer. Building backends that think.',
  });
}
