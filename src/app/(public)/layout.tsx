import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { getProfile, getContactLinks } from '../../lib/serverApi';

export const revalidate = 60;

/**
 * Shared chrome for every public page — fetched once here instead of by
 * each page individually. `/admin/**` is a sibling route outside this
 * group, so it never gets this Navbar/Footer.
 */
export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [profile, contactLinks] = await Promise.all([getProfile(), getContactLinks()]);

  return (
    <>
      <Navbar profile={profile} />
      {children}
      <Footer profile={profile} contactLinks={contactLinks} />
    </>
  );
}
