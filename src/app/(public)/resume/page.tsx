import { getResume, getProfile } from '../../../lib/serverApi';
import { pageMetadata } from '../../../lib/seo';
import { ResumeView, type ResumeRow } from './ResumeView';
import type { ResumeItem } from '../../../types/resume';

export const revalidate = 60;

export const metadata = pageMetadata({
  title: 'Résumé | Biraj Buddhacharya',
  description: 'Experience, education, certifications and skills.',
  path: '/resume',
});

const toRow = (e: Pick<ResumeItem, 'title' | 'period' | 'organization' | 'body'>): ResumeRow => ({
  title: e.title,
  meta: [e.organization, e.period].filter(Boolean).join(' · '),
  body: e.body ?? '',
});

export default async function ResumePage() {
  const [resume, profile] = await Promise.all([getResume(), getProfile()]);

  const blocks = [
    { label: 'Experience', rows: (resume?.experiences ?? []).map(toRow) },
    { label: 'Education', rows: (resume?.education ?? []).map(toRow) },
    { label: 'Certifications', rows: (resume?.certifications ?? []).map(toRow) },
    {
      label: 'Skills',
      rows: (resume?.skills ?? []).map((s) => ({ title: s.title, meta: '', body: s.body ?? '' })),
    },
  ].filter((b) => b.rows.length > 0);

  return <ResumeView blocks={blocks} pdfUrl={profile?.resumePdfUrl} />;
}
