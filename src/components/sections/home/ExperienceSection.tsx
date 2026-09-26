'use client';

import { motion } from 'framer-motion';

interface ExperienceItem {
  period: string;
  location: string;
  role: string;
  company: string;
  points: string[];
}

export function ExperienceSection({ items: experience }: { items: ExperienceItem[] }) {
  return (
    <section className="max-w-[1180px] mx-auto px-7 pt-[96px]">
      <motion.div
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <div
          className="text-[12px] uppercase tracking-[0.14em] mb-[14px]"
          style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: '#FF6B6B' }}
        >
          02 / experience
        </div>
        <h2
          className="mb-[38px]"
          style={{
            fontFamily: 'var(--font-space-grotesk), sans-serif',
            fontSize: 'clamp(30px, 4.4vw, 46px)',
            letterSpacing: '-0.035em',
            fontWeight: 600,
            color: '#EDEDEF',
            margin: '0 0 38px',
          }}
        >
          Where I&apos;ve worked
        </h2>

        <div className="flex flex-col">
          {experience.map((e, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.2, 0.8, 0.2, 1] }}
              className="grid gap-8 py-[30px] border-t border-white/[0.08] transition-colors duration-200"
              style={{
                gridTemplateColumns: 'minmax(140px, 200px) 1fr',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.015)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <div>
                <div
                  className="text-[12px] tracking-[0.02em]"
                  style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: '#6E6E78' }}
                >
                  {e.period}
                </div>
                <div
                  className="text-[11px] mt-2"
                  style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: '#FF6B6B' }}
                >
                  {e.location}
                </div>
              </div>

              <div>
                <h3
                  className="m-0 text-[22px] font-semibold"
                  style={{
                    fontFamily: 'var(--font-space-grotesk), sans-serif',
                    letterSpacing: '-0.02em',
                    color: '#EDEDEF',
                  }}
                >
                  {e.role}{' '}
                  <span style={{ color: '#6E6E78', fontWeight: 400 }}>/ {e.company}</span>
                </h3>
                <ul className="mt-[14px] pl-[18px] text-[14.5px] leading-[1.75]" style={{ color: '#8A8A93' }}>
                  {e.points.map((pt, j) => (
                    <li key={j} className="mb-[6px]">{pt}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
