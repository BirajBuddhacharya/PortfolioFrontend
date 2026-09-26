'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { use } from 'react';
import { Navbar } from '../../../components/layout/Navbar';
import { Footer } from '../../../components/layout/Footer';
import { Prose } from '../../../components/Prose';
import { Toc } from '../../../components/Toc';
import { useBlogPostDetail } from '../../../services/blogService';

export default function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: post, isLoading, isError } = useBlogPostDetail(id);

  return (
    <div style={{ background: '#09090B', color: '#EDEDEF', minHeight: '100vh', overflowX: 'hidden' }}>
      <Navbar />
      <main className="relative z-10 max-w-[1060px] mx-auto px-7 pt-[150px]">
        {isLoading && (
          <div className="text-[14px]" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: '#6E6E78' }}>
            Loading…
          </div>
        )}

        {isError && (
          <div>
            <p style={{ color: '#8A8A93' }}>Post not found.</p>
            <Link href="/blog" style={{ color: '#FF6B6B', fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: 13 }}>← all posts</Link>
          </div>
        )}

        {post && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid gap-12 lg:grid-cols-[200px_minmax(0,720px)] lg:justify-center"
          >
            <Toc content={post.body ?? ''} className="order-1 hidden lg:block" />
            <div className="order-2 min-w-0">
            <Link
              href="/blog"
              className="text-[12.5px] transition-colors duration-200"
              style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: '#8A8A93' }}
              onMouseEnter={(e) => { (e.target as HTMLElement).style.color = '#FF6B6B'; }}
              onMouseLeave={(e) => { (e.target as HTMLElement).style.color = '#8A8A93'; }}
            >
              ← all posts
            </Link>

            <div
              className="flex gap-[14px] text-[12px] mt-[26px] mb-[14px]"
              style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: '#6E6E78' }}
            >
              <span>{post.date}</span>
              <span>·</span>
              <span>{post.readTime}</span>
              <span>·</span>
              <span style={{ color: '#FF6B6B' }}>{post.tags.join(', ')}</span>
            </div>

            <h1
              className="mb-[28px]"
              style={{
                fontFamily: 'var(--font-space-grotesk), sans-serif',
                fontSize: 'clamp(32px, 5.2vw, 52px)',
                lineHeight: 1.08,
                letterSpacing: '-0.035em',
                fontWeight: 600,
                color: '#EDEDEF',
                margin: '0 0 28px',
              }}
            >
              {post.title}
            </h1>

            {post.coverImage && (
              <div
                className="h-[300px] rounded-[18px] border border-white/[0.09] flex items-center justify-center mb-[44px] overflow-hidden"
                style={{ background: 'linear-gradient(135deg,#141418,#0C0C0F)' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.coverImage}
                  alt={post.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            )}

            {post.body && <Prose>{post.body}</Prose>}

            <div className="border-t border-white/[0.08] mt-9 pt-8 pb-5 flex items-center gap-4">
              <div
                className="w-[46px] h-[46px] rounded-full flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#FF6B6B,#7C3AED)' }}
              />
              <div>
                <div
                  className="text-[16px] font-semibold"
                  style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', color: '#EDEDEF' }}
                >
                  Biraj Buddhacharya
                </div>
                <div
                  className="text-[12px] mt-1"
                  style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: '#8A8A93' }}
                >
                  ML &amp; backend engineer, Kathmandu
                </div>
              </div>
            </div>
            </div>
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  );
}
