import { getProfile, getContactLinks, REVALIDATE } from "../../lib/serverApi";
import { pageMetadata } from "../../lib/seo";
import { ContactView } from "./ContactView";

export const revalidate = REVALIDATE;

export const metadata = pageMetadata({
  title: "Contact | Biraj Buddhacharya",
  description:
    "Freelance work, full-time roles, or just a good ML problem to chew on — my inbox is open.",
  path: "/contact",
});

export default async function ContactPage() {
  const [profile, links] = await Promise.all([getProfile(), getContactLinks()]);
  return <ContactView links={links} profile={profile} />;
}
