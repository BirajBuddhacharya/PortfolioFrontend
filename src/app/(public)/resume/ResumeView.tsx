'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export interface ResumeRow {
  title: string;
  meta: string;
  body: string;
}

export interface ResumeBlock {
  label: string;
  rows: ResumeRow[];
}

const PDF_PROXY_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/resume/pdf`;

export function ResumeView({ blocks, pdfUrl }: { blocks: ResumeBlock[]; pdfUrl?: string | null }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!pdfUrl) { window.location.href = '/resume.pdf'; return; }
    setDownloading(true);
    try {
      const res = await fetch(PDF_PROXY_URL);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resume.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div style={{ background: '#09090B', color: '#EDEDEF', minHeight: '100vh', overflowX: 'hidden' }}>
      <main className="relative z-10 max-w-[900px] mx-auto px-4 sm:px-7 pt-[120px] sm:pt-[160px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between gap-5 flex-wrap mb-[44px]"
        >
          <div>
            <div
              className="text-[12px] uppercase tracking-[0.14em] mb-4"
              style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: '#FF6B6B' }}
            >
              résumé
            </div>
            <h1
              className="m-0"
              style={{
                fontFamily: 'var(--font-space-grotesk), sans-serif',
                fontSize: 'clamp(36px, 5.6vw, 62px)',
                lineHeight: 1,
                letterSpacing: '-0.04em',
                fontWeight: 600,
                color: '#EDEDEF',
              }}
            >
              The short version<span style={{ color: '#FF6B6B' }}>.</span>
            </h1>
          </div>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="px-[22px] py-[13px] rounded-[11px] border border-white/[0.14] text-[12.5px] transition-colors duration-200 cursor-pointer disabled:opacity-60"
            style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: '#EDEDEF', background: 'transparent' }}
            onMouseEnter={(e) => { const el = e.currentTarget; el.style.borderColor = '#FF6B6B'; el.style.color = '#FF6B6B'; }}
            onMouseLeave={(e) => { const el = e.currentTarget; el.style.borderColor = 'rgba(255,255,255,0.14)'; el.style.color = '#EDEDEF'; }}
          >
            {downloading ? 'Downloading…' : 'Download PDF ↓'}
          </button>
        </motion.div>

        {blocks.map((rb, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
            className="border-t border-white/[0.08] py-[34px]"
          >
            <div
              className="grid gap-4 sm:gap-[30px] items-start grid-cols-1 sm:grid-cols-[minmax(130px,190px)_1fr]"
            >
              <div
                className="text-[12px] uppercase tracking-[0.1em] pt-1"
                style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: '#FF6B6B' }}
              >
                {rb.label}
              </div>
              <div className="flex flex-col gap-5">
                {rb.rows.map((r, j) => (
                  <div key={j}>
                    <div className="flex justify-between gap-4 flex-wrap">
                      <div
                        className="text-[18px] font-semibold"
                        style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', letterSpacing: '-0.02em', color: '#EDEDEF' }}
                      >
                        {r.title}
                      </div>
                      {r.meta && (
                        <div
                          className="text-[11.5px]"
                          style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: '#6E6E78' }}
                        >
                          {r.meta}
                        </div>
                      )}
                    </div>
                    <div className="text-[14.5px] leading-[1.7] mt-[7px]" style={{ color: '#8A8A93', textWrap: 'pretty' } as React.CSSProperties}>
                      {r.body}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}

        <div className="h-5" />
      </main>
    </div>
  );
}
