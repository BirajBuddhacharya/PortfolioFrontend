import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono, Sora } from "next/font/google";
import { Toaster } from "../../components/components/ui/sonner";
import { QueryProvider } from "../providers/QueryProvider";
import { getProfile, getContactLinks } from "../lib/serverApi";
import { SITE_URL } from "../lib/seo";
import "./globals.css";
import Head from "next/head";
import { GoogleTagManager } from "@next/third-parties/google";
import { Env } from "src/utils/Env";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Biraj Buddhacharya | ML Engineer & Full-stack Developer",
  description:
    "Machine learning engineer and full-stack developer. I build backends that think — RAG chatbots, recommendation engines, and analytics systems — and the interfaces that make them usable.",
  keywords:
    "Biraj Buddhacharya, ML Engineer, Full-stack Developer, Machine Learning, FastAPI, React, PyTorch, LangChain, Portfolio",
  authors: [{ name: "Biraj Buddhacharya" }],
  robots: "index, follow",
  metadataBase: new URL("https://birajbuddhacharya.com.np"),
  verification: {
    google: "MfMgvrHxXGqKqKNEvhpvELHqDe7tx5nX-T6quHavP2Q",
  },
  openGraph: {
    title: "Biraj Buddhacharya | ML Engineer & Full-stack Developer",
    description:
      "Machine learning engineer and full-stack developer building backends that think.",
    url: "https://birajbuddhacharya.com.np",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [profile, contactLinks] = await Promise.all([getProfile(), getContactLinks()]);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile?.name || "Biraj Buddhacharya",
    url: SITE_URL,
    sameAs: contactLinks
      .filter((l) => l.label.toLowerCase() !== "email")
      .map((l) => l.href),
    jobTitle: profile?.headline || "ML Engineer & Full-stack Developer",
    image: profile?.avatarImage || `${SITE_URL}/img/logo.png`,
    description:
      profile?.paragraphs?.[0] ||
      "Machine learning engineer and full-stack developer based in Kathmandu, Nepal.",
  };

  return (
    <html lang="en">
      <Head>
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
        <title>Biraj Buddhacharya | Software & AI Engineer</title>
        <meta
          name="description"
          content="Portfolio of Biraj Buddhacharya, a Software and AI Engineer."
        />
        <meta
          name="keywords"
          content="software engineer, AI, Python, portfolio"
        />
        <meta
          property="og:title"
          content="Biraj Buddhacharya | Software & AI Engineer"
        />
        <meta
          property="og:description"
          content="Explore the portfolio of Biraj Buddhacharya, a Software and AI Engineer specializing in Python and machine learning."
        />
        <meta
          property="og:image"
          content="https://birajbuddhacharya.com.np/img/logo.png"
        />
        <meta property="og:url" content="https://birajbuddhacharya.com.np" />
        <meta property="og:type" content="website" />
      </Head>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${sora.variable}`}
        style={{ fontFamily: "var(--font-sora), system-ui, sans-serif" }}
      >
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
        <GoogleTagManager gtmId={Env.GOOGLE_ANALYTICS_ID} />
      </body>
    </html>
  );
}
