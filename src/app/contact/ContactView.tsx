'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { useSubmitContact } from '../../services/contactService';
import type { ContactLink } from '../../types/contact';
import type { Profile } from '../../types/profile';

export function ContactView({ links, profile }: { links: ContactLink[]; profile?: Profile | null }) {
  const { mutate: submit, isPending } = useSubmitContact();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) return;
    submit(form, {
      onSuccess: () => {
        toast.success('Message sent! I\'ll get back to you soon.');
        setForm({ name: '', email: '', subject: '', message: '' });
      },
      onError: () => {
        toast.error('Something went wrong. Please try again.');
      },
    });
  };

  const inputStyle: React.CSSProperties = {
    background: '#131317',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: '13px 15px',
    color: '#EDEDEF',
    fontFamily: 'var(--font-sora), system-ui, sans-serif',
    fontSize: 15,
    outline: 'none',
    width: '100%',
    transition: 'border-color 0.2s',
  };

  return (
    <div style={{ background: '#09090B', color: '#EDEDEF', minHeight: '100vh', overflowX: 'hidden' }}>
      <Navbar profile={profile} />
      <main className="relative z-10 max-w-[1080px] mx-auto px-7 pt-[160px]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div
            className="text-[12px] uppercase tracking-[0.14em] mb-4"
            style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: '#FF6B6B' }}
          >
            contact
          </div>
          <h1
            className="mb-[44px]"
            style={{
              fontFamily: 'var(--font-space-grotesk), sans-serif',
              fontSize: 'clamp(38px, 6.4vw, 78px)',
              lineHeight: 1,
              letterSpacing: '-0.04em',
              fontWeight: 600,
              color: '#EDEDEF',
              margin: '0 0 44px',
            }}
          >
            Let&apos;s connect<span style={{ color: '#FF6B6B' }}>.</span>
          </h1>
        </motion.div>

        <div
          className="grid gap-[44px] items-start pb-5"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col gap-[14px]"
          >
            {links.map((c, i) => (
              <a
                key={i}
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-4 p-[20px] px-[22px] border border-white/[0.09] rounded-[14px] transition-all duration-200"
                style={{ background: '#0C0C0F', color: 'inherit' }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'rgba(255,107,107,0.45)';
                  el.style.background = '#111116';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'rgba(255,255,255,0.09)';
                  el.style.background = '#0C0C0F';
                }}
              >
                <div>
                  <div
                    className="text-[11px] uppercase tracking-[0.1em] mb-[7px]"
                    style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: '#6E6E78' }}
                  >
                    {c.label}
                  </div>
                  <div className="text-[15.5px]" style={{ color: '#EDEDEF' }}>
                    {c.value}
                  </div>
                </div>
                <span style={{ color: '#FF6B6B' }}>↗</span>
              </a>
            ))}
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-[18px] border border-white/[0.09] rounded-[18px] p-[30px]"
            style={{ background: '#0C0C0F' }}
          >
            <div className="flex flex-col gap-2">
              <label
                className="text-[11px] uppercase tracking-[0.1em]"
                style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: '#8A8A93' }}
              >
                Name
              </label>
              <input
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={inputStyle}
                onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = '#FF6B6B'; }}
                onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.1)'; }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                className="text-[11px] uppercase tracking-[0.1em]"
                style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: '#8A8A93' }}
              >
                Email
              </label>
              <input
                type="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={inputStyle}
                onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = '#FF6B6B'; }}
                onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.1)'; }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                className="text-[11px] uppercase tracking-[0.1em]"
                style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: '#8A8A93' }}
              >
                Subject
              </label>
              <input
                placeholder="What is this about?"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                style={inputStyle}
                onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = '#FF6B6B'; }}
                onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.1)'; }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                className="text-[11px] uppercase tracking-[0.1em]"
                style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: '#8A8A93' }}
              >
                Message
              </label>
              <textarea
                rows={5}
                placeholder="What are you building?"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                style={{ ...inputStyle, resize: 'vertical' }}
                onFocus={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = '#FF6B6B'; }}
                onBlur={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = 'rgba(255,255,255,0.1)'; }}
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="mt-1 py-[14px] border-none rounded-[11px] text-[13px] font-semibold cursor-pointer transition-colors duration-200 disabled:opacity-60"
              style={{
                background: '#FF6B6B',
                color: '#12080A',
                fontFamily: 'var(--font-jetbrains-mono), monospace',
              }}
              onMouseEnter={(e) => { if (!isPending) (e.target as HTMLElement).style.background = '#FF867F'; }}
              onMouseLeave={(e) => { (e.target as HTMLElement).style.background = '#FF6B6B'; }}
            >
              {isPending ? 'Sending…' : 'Send message'}
            </button>
          </motion.form>
        </div>
      </main>
      <Footer profile={profile} contactLinks={links} />
    </div>
  );
}
