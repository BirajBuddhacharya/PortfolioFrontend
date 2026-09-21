import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "../../components/components/ui/sonner";
import "./globals.css";
import Head from "next/head";
import { GoogleTagManager } from "@next/third-parties/google";
import { Env } from "src/utils/Env";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Biraj Buddhacharya | Software & AI Engineer",
  description:
    "I'm Biraj Buddhacharya, a Software and AI Engineer passionate about solving real-world problems with Python and machine learning. Explore my projects and contact me.",
  keywords:
    "Biraj Buddhacharya, Software Engineer, AI Engineer, Machine Learning, Deep Learning, PyTorch, Python, Portfolio",
  authors: [{ name: "Biraj Buddhacharya" }],
  robots: "index, follow",
  metadataBase: new URL("https://birajbuddhacharya.com.np"),
  verification: {
    google: "MfMgvrHxXGqKqKNEvhpvELHqDe7tx5nX-T6quHavP2Q",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Biraj Buddhacharya",
    url: "https://birajbuddhacharya.com.np",
    sameAs: [
      "https://www.linkedin.com/in/biraj-buddhacharya",
      "https://github.com/birajbuddhacharya",
    ],
    jobTitle: "Software and AI Engineer",
    image: "https://birajbuddhacharya.com.np/img/logo.png",
    description:
      "Biraj Buddhacharya is a Software and AI Engineer passionate about solving real-world problems with Python and machine learning.",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
        <GoogleTagManager gtmId={Env.GOOGLE_ANALYTICS_ID} />
      </body>
    </html>
  );
}
