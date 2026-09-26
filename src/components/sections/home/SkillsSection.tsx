'use client';

import { motion } from 'framer-motion';

interface SkillGroup {
  name: string;
  items: string[];
}

export function SkillsSection({ groups }: { groups: SkillGroup[] }) {
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
          03 / capabilities
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
          The toolkit
        </h2>

        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          {groups.map((g, i) => (
            <motion.div
              key={g.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
              className="p-6 rounded-[16px] border border-white/[0.08] transition-colors duration-300"
              style={{ background: '#0C0C0F' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,107,107,0.35)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'; }}
            >
              <div
                className="text-[11.5px] uppercase tracking-[0.1em] mb-4"
                style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: '#FF6B6B' }}
              >
                {g.name}
              </div>
              <div className="flex flex-wrap gap-2">
                {g.items.map((item) => (
                  <span
                    key={item}
                    className="text-[12.5px]"
                    style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: '#C7C7CE' }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
