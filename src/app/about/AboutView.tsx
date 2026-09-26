'use client';

import { motion, type Transition } from 'framer-motion';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import type { Profile } from '../../types/profile';
import type { ContactLink } from '../../types/contact';

const reveal = {
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] } as Transition,
};

interface EducationRow {
  period: string;
  title: string;
  place: string;
}

interface Fact {
  k: string;
  v: string;
}

export function AboutView({
  headline,
  coverImage,
  paragraphs,
  education,
  facts,
  profile,
  contactLinks,
}: {
  headline: string;
  coverImage: string | null;
  paragraphs: string[];
  education: EducationRow[];
  facts: Fact[];
  profile?: Profile | null;
  contactLinks?: ContactLink[];
}) {
  return (
    <div style={{ background: '#09090B', color: '#EDEDEF', minHeight: '100vh', overflowX: 'hidden' }}>
      <Navbar profile={profile} />
      <main className="relative z-10 max-w-[1180px] mx-auto px-7 pt-[160px]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div
            className="text-[12px] uppercase tracking-[0.14em] mb-4"
            style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: '#FF6B6B' }}
          >
            about
          </div>
          <h1
            className="mb-[46px] max-w-[18ch]"
            style={{
              fontFamily: 'var(--font-space-grotesk), sans-serif',
              fontSize: 'clamp(38px, 6.4vw, 78px)',
              lineHeight: 1,
              letterSpacing: '-0.04em',
              fontWeight: 600,
              color: '#EDEDEF',
              margin: '0 0 46px',
            }}
          >
            {headline}<span style={{ color: '#FF6B6B' }}>.</span>
          </h1>
        </motion.div>

        <div className="grid gap-12 items-start" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <motion.div {...reveal}>
            {paragraphs.map((p, i) => (
              <p
                key={i}
                className="text-[17px] leading-[1.75] mb-5"
                style={{ color: '#A1A1AA', textWrap: 'pretty' } as React.CSSProperties}
              >
                {p}
              </p>
            ))}
          </motion.div>

          <motion.div
            {...reveal}
            transition={{ ...reveal.transition, delay: 0.15 }}
            className="relative"
            style={{ aspectRatio: '4/5', borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)', background: 'linear-gradient(135deg,#141418,#0C0C0F)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
          >
            {coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={coverImage}
                alt="Portrait"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span
                className="text-[11px] uppercase tracking-[0.16em]"
                style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: '#3F3F46' }}
              >
                portrait
              </span>
            )}
            <span
              className="absolute"
              style={{ inset: '14px -14px -14px 14px', border: '1px solid rgba(255,107,107,0.5)', borderRadius: 20, zIndex: -1 }}
            />
          </motion.div>
        </div>

        <motion.div {...reveal} className="mt-[96px]">
          <h2
            className="mb-[26px]"
            style={{
              fontFamily: 'var(--font-space-grotesk), sans-serif',
              fontSize: 30,
              letterSpacing: '-0.03em',
              fontWeight: 600,
              color: '#EDEDEF',
              margin: '0 0 26px',
            }}
          >
            Education &amp; certifications
          </h2>
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {education.map((e, i) => (
              <div
                key={i}
                className="p-6 rounded-[16px] border border-white/[0.08]"
                style={{ background: '#0C0C0F' }}
              >
                <div
                  className="text-[11.5px] mb-3"
                  style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: '#FF6B6B' }}
                >
                  {e.period}
                </div>
                <div
                  className="text-[18px] font-semibold mb-[6px]"
                  style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', letterSpacing: '-0.02em', color: '#EDEDEF' }}
                >
                  {e.title}
                </div>
                <div className="text-[14px] leading-[1.6]" style={{ color: '#8A8A93' }}>
                  {e.place}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div {...reveal} className="mt-[96px] mb-0 pb-0">
          <h2
            className="mb-[26px]"
            style={{
              fontFamily: 'var(--font-space-grotesk), sans-serif',
              fontSize: 30,
              letterSpacing: '-0.03em',
              fontWeight: 600,
              color: '#EDEDEF',
              margin: '0 0 26px',
            }}
          >
            Beyond the keyboard
          </h2>
          <div
            className="grid gap-[1px] border border-white/[0.08] rounded-[18px] overflow-hidden"
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              background: 'rgba(255,255,255,0.08)',
            }}
          >
            {facts.map((f, i) => (
              <div key={i} className="p-[26px]" style={{ background: '#0C0C0F' }}>
                <div
                  className="text-[11px] uppercase tracking-[0.1em] mb-[10px]"
                  style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: '#6E6E78' }}
                >
                  {f.k}
                </div>
                <div className="text-[15.5px] leading-[1.55]" style={{ color: '#C7C7CE' }}>
                  {f.v}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
      <Footer profile={profile} contactLinks={contactLinks} />
    </div>
  );
}
