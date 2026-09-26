'use client';

import { motion } from 'framer-motion';

export function StatsSection({ stats }: { stats: { value: string; label: string }[] }) {
  return (
    <section className="max-w-[1180px] mx-auto px-7 pt-[80px]">
      <motion.div
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
        className="grid gap-[1px] border border-white/[0.08] rounded-[18px] overflow-hidden"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
          background: 'rgba(255,255,255,0.08)',
        }}
      >
        {stats.map((s, i) => (
          <div
            key={i}
            className="px-[26px] py-[30px] transition-colors duration-200"
            style={{ background: '#0C0C0F' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#131317'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#0C0C0F'; }}
          >
            <div
              className="text-[40px] font-semibold leading-none"
              style={{
                fontFamily: 'var(--font-space-grotesk), sans-serif',
                letterSpacing: '-0.04em',
                color: '#FF6B6B',
              }}
            >
              {s.value}
            </div>
            <div
              className="text-[11.5px] mt-2 tracking-[0.04em] uppercase"
              style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: '#8A8A93' }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
