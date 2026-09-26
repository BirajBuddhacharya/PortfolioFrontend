'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface BlogPreviewItem {
  id: string;
  title: string;
  date: string;
  readTime: string;
}

export function BlogPreviewSection({ posts }: { posts: BlogPreviewItem[] }) {
  return (
    <section className="max-w-[1180px] mx-auto px-7 pt-[96px]">
      <motion.div
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <div className="flex items-end justify-between gap-6 flex-wrap mb-[30px]">
          <div>
            <div
              className="text-[12px] uppercase tracking-[0.14em] mb-[14px]"
              style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: '#FF6B6B' }}
            >
              04 / writing
            </div>
            <h2
              className="m-0"
              style={{
                fontFamily: 'var(--font-space-grotesk), sans-serif',
                fontSize: 'clamp(30px, 4.4vw, 46px)',
                letterSpacing: '-0.035em',
                fontWeight: 600,
                color: '#EDEDEF',
              }}
            >
              Notes from the build
            </h2>
          </div>
          <Link
            href="/blog"
            className="text-[13px] border-b border-[rgba(255,107,107,0.4)] pb-[3px]"
            style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: '#FF6B6B' }}
          >
            read the blog →
          </Link>
        </div>

        <div className="border-t border-white/[0.08]">
          {posts.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <Link
                href={`/blog/${p.id}`}
                className="grid items-center gap-6 py-[22px] px-3 border-b border-white/[0.08] transition-colors duration-200"
                style={{
                  gridTemplateColumns: '110px 1fr auto',
                  color: 'inherit',
                  display: 'grid',
                }}
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
                  className="text-[18px] font-medium"
                  style={{
                    fontFamily: 'var(--font-space-grotesk), sans-serif',
                    letterSpacing: '-0.015em',
                    color: '#EDEDEF',
                  }}
                >
                  {p.title}
                </span>
                <span
                  className="text-[11.5px]"
                  style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: '#FF6B6B' }}
                >
                  {p.readTime}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
