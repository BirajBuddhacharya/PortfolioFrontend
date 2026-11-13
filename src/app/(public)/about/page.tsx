import { getProfile, getResume } from "../../../lib/serverApi";
import { pageMetadata, toDescription, SITE_URL } from "../../../lib/seo";
import { AboutView } from "./AboutView";

export const revalidate = 60;

const ABOUT_IMAGE = `${SITE_URL}/heroSection.png`;

export default async function AboutPage() {
  const [profile, resume] = await Promise.all([getProfile(), getResume()]);

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
      paragraphs={profile?.paragraphs ?? []}
      education={education}
      facts={profile?.facts ?? []}
    />
  );
}

export async function generateMetadata() {
  const profile = await getProfile();
  const base = pageMetadata({
    title: "About | Biraj Buddhacharya",
    description:
      toDescription(profile?.paragraphs?.[0]) ||
      "Machine learning engineer and full-stack developer.",
    path: "/about",
  });

  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      images: [
        {
          url: ABOUT_IMAGE,
          width: 1024,
          height: 680,
          alt: profile?.name ?? "Biraj Buddhacharya",
        },
      ],
    },
    twitter: {
      ...base.twitter,
      images: [ABOUT_IMAGE],
    },
  };
}
