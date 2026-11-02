import type { Metadata } from 'next';
import { getProfile } from '../../../lib/serverApi';
import { CvDownloadRedirect } from './CvDownloadRedirect';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Download CV',
  robots: { index: false, follow: false },
};

const FALLBACK_PDF = '/resume.pdf';

export default async function CvDownloadPage() {
  const profile = await getProfile();
  return <CvDownloadRedirect url={profile?.resumePdfUrl || FALLBACK_PDF} />;
}
