'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import type { Profile } from '../../types/profile';
import type { ContactLink } from '../../types/contact';

export interface BlogListItem {
  id: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  tags: string[];
  date: string;
  readTime: string;
}

export function BlogView({
  posts,
  profile,
  contactLinks,
}: {
  posts: BlogListItem[];
  profile?: Profile | null;
  contactLinks?: ContactLink[];
}) {
  const [featured, ...rest] = posts;

  return (
    <div style={{ background: '#09090B', color: '#EDEDEF', minHeight: '100vh', overflowX: 'hidden' }}>
      <Navbar profile={profile} />
      <main className="relative z-10 max-w-[1180px] mx-auto px-7 pt-[160px]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div
            className="text-[12px] uppercase tracking-[0.14em] mb-4"
            style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: '#FF6B6B' }}
          >
            blog
          </div>
          <h1
            className="mb-[40px]"
            style={{
              fontFamily: 'var(--font-space-grotesk), sans-serif',
              fontSize: 'clamp(38px, 6.4vw, 78px)',
              lineHeight: 1,
              letterSpacing: '-0.04em',
              fontWeight: 600,
              color: '#EDEDEF',
              margin: '0 0 40px',
            }}
          >
            Notes from the build<span style={{ color: '#FF6B6B' }}>.</span>
          </h1>
        </motion.div>

        {featured && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Link
              href={`/blog/${featured.id}`}
              className="grid border border-white/[0.09] rounded-[20px] overflow-hidden mb-[56px] transition-colors duration-300"
              style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', color: 'inherit' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,107,107,0.45)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.09)'; }}
            >
              {featured.coverImage && (
                <div
                  className="min-h-[280px] flex items-center justify-center overflow-hidden"
                  style={{ background: 'linear-gradient(135deg,#17171C,#0C0C0F)' }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={featured.coverImage}
                    alt={featured.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              )}
              <div
                className="p-[40px] flex flex-col justify-center"
                style={{ background: '#0C0C0F' }}
              >
                <span
                  className="text-[11px] uppercase tracking-[0.12em] mb-4"
                  style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: '#FF6B6B' }}
                >
                  latest
                </span>
                <h2
                  className="mb-[14px]"
                  style={{
                    fontFamily: 'var(--font-space-grotesk), sans-serif',
                    fontSize: 32,
                    lineHeight: 1.15,
                    letterSpacing: '-0.03em',
                    fontWeight: 600,
                    color: '#EDEDEF',
                    margin: '0 0 14px',
                  }}
                >
                  {featured.title}
                </h2>
                <p className="mb-5 text-[15.5px] leading-[1.7]" style={{ color: '#8A8A93', margin: '0 0 20px' }}>
                  {featured.excerpt}
                </p>
                <div
                  className="flex gap-[14px] text-[12px]"
                  style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: '#6E6E78' }}
                >
                  <span>{featured.date}</span>
                  <span>·</span>
                  <span>{featured.readTime}</span>
                  <span>·</span>
                  <span>{featured.tags.join(', ')}</span>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        <div className="border-t border-white/[0.08] pb-5">
          {rest.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <Link
                href={`/blog/${p.id}`}
                className="grid items-center gap-6 py-6 px-3 border-b border-white/[0.08] transition-colors duration-200"
                style={{ gridTemplateColumns: '110px 1fr minmax(130px, auto) auto', color: 'inherit' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <span
                  className="text-[12px]"
                  style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: '#6E6E78' }}
                >
                  {p.date}
                </span>
                <span
                  className="text-[19px] font-medium"
                  style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', letterSpacing: '-0.02em', color: '#EDEDEF' }}
                >
                  {p.title}
                </span>
                <span className="flex flex-wrap gap-[6px] justify-self-start">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] border border-[rgba(255,107,107,0.25)] px-[10px] py-1 rounded-full"
                      style={{
                        fontFamily: 'var(--font-jetbrains-mono), monospace',
                        color: '#FF6B6B',
                        background: 'rgba(255,107,107,0.08)',
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </span>
                <span
                  className="text-[11.5px]"
                  style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: '#6E6E78' }}
                >
                  {p.readTime}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
      <Footer profile={profile} contactLinks={contactLinks} />
    </div>
  );
}
