import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { MouseGlow } from '../components/MouseGlow';
import { HeroSection } from '../components/sections/home/HeroSection';
import { TickerSection } from '../components/sections/home/TickerSection';
import { StatsSection } from '../components/sections/home/StatsSection';
import { FeaturedProjectsSection } from '../components/sections/home/FeaturedProjectsSection';
import { ExperienceSection } from '../components/sections/home/ExperienceSection';
import { SkillsSection } from '../components/sections/home/SkillsSection';
import { BlogPreviewSection } from '../components/sections/home/BlogPreviewSection';
import { CTASection } from '../components/sections/home/CTASection';
import { getProfile, getResume, getProjects, getPosts, getContactLinks, REVALIDATE } from '../lib/serverApi';
import { pageMetadata } from '../lib/seo';

export const revalidate = REVALIDATE;

export const metadata = pageMetadata({
  title: 'Biraj Buddhacharya | ML Engineer & Full-stack Developer',
  description:
    'Machine learning engineer and full-stack developer. I build backends that think — RAG chatbots, recommendation engines and analytics systems — and the interfaces that make them usable.',
  path: '/',
});

export default async function HomePage() {
  const [profile, resume, projects, posts, contactLinks] = await Promise.all([
    getProfile(),
    getResume(),
    getProjects(),
    getPosts(),
    getContactLinks(),
  ]);

  const featuredProjects = projects.filter((p) => p.status === 'live').slice(0, 3);

  const experience = (resume?.experiences ?? []).map((e) => ({
    period: e.period ?? '',
    location: e.location ?? '',
    role: e.title,
    company: e.organization ?? '',
    points: e.points,
  }));

  const skills = (resume?.skills ?? []).map((s) => ({
    name: s.title,
    items: (s.body ?? '').split(',').map((x) => x.trim()).filter(Boolean),
  }));

  const blogPreview = posts.slice(0, 3).map((p) => ({
    id: p.id,
    title: p.title,
    date: p.publishedAt
      ? new Date(p.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : '',
    readTime: `${p.readTime} min`,
  }));

  return (
    <div style={{ background: '#09090B', color: '#EDEDEF', minHeight: '100vh', overflowX: 'hidden', position: 'relative' }}>
      <MouseGlow />
      <Navbar profile={profile} />
      <main className="relative z-10">
        <HeroSection />
        <TickerSection items={profile?.ticker ?? []} />
        <StatsSection stats={profile?.stats ?? []} />
        <FeaturedProjectsSection projects={featuredProjects} />
        <ExperienceSection items={experience} />
        <SkillsSection groups={skills} />
        <BlogPreviewSection posts={blogPreview} />
        <CTASection />
      </main>
      <Footer profile={profile} contactLinks={contactLinks} />
    </div>
  );
}
