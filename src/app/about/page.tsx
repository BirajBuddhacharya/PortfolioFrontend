import {
  getProfile,
  getResume,
  getContactLinks,
  REVALIDATE,
} from "../../lib/serverApi";
import { pageMetadata, toDescription } from "../../lib/seo";
import { AboutView } from "./AboutView";

export const revalidate = REVALIDATE;

export default async function AboutPage() {
  const [profile, resume, contactLinks] = await Promise.all([
    getProfile(),
    getResume(),
    getContactLinks(),
  ]);

  const education = [
    ...(resume?.education ?? []),
    ...(resume?.certifications ?? []),
  ].map((e) => ({
    period: e.period ?? "",
    title: e.title,
    place: e.organization ?? "",
  }));

  return (
    <AboutView
      headline={profile?.headline ?? ""}
      coverImage={profile?.coverImage ?? null}
      paragraphs={profile?.paragraphs ?? []}
      education={education}
      facts={profile?.facts ?? []}
      profile={profile}
      contactLinks={contactLinks}
    />
  );
}

export async function generateMetadata() {
  const profile = await getProfile();
  return pageMetadata({
    title: "About | Biraj Buddhacharya",
    description:
      toDescription(profile?.paragraphs?.[0]) ||
      "Machine learning engineer and full-stack developer.",
    path: "/about",
  });
}
