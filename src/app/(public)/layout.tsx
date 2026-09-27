import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { MouseGlow } from '../../components/MouseGlow';
import { getProfile, getContactLinks } from '../../lib/serverApi';

export const revalidate = 60;

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [profile, contactLinks] = await Promise.all([getProfile(), getContactLinks()]);

  return (
    <>
      <MouseGlow />
      <Navbar profile={profile} />
      {children}
      <Footer profile={profile} contactLinks={contactLinks} />
    </>
  );
}
