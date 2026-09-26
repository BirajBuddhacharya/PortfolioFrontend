'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge } from '@/components/components/ui/badge';
import { Card } from '@/components/components/ui/card';
import { Button } from '@/components/components/ui/button';
import { cn } from '@/components/lib/utils';
import { useAdminOverview, useAdminChart, useAdminTopPages, useAdminActivity, useAdminInbox } from '../../../services/adminService';
import { ACCENT, MUTED, TEXT, TEXT2, mono, heading, dashCard, SectionLabel } from '../../../components/admin/adminUi';

export default function AdminDashboardPage() {
  const { data: stats = [] } = useAdminOverview();
  const { data: bars = [] } = useAdminChart();
  const { data: topPages = [] } = useAdminTopPages();
  const { data: activity = [] } = useAdminActivity();
  const { data: msgs = [] } = useAdminInbox();

  const maxBar = Math.max(...bars, 1);

  return (
    <div className="grid grid-cols-4 gap-4 auto-rows-[120px]">

      {/* Visitor chart — 2 cols × 2 rows */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="col-span-2 row-span-2"
      >
        <Card className={dashCard}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <SectionLabel>visitors — last 14 days</SectionLabel>
            </div>
            <Badge
              variant="outline"
              className="border-[#10B981]/25 bg-[#10B981]/10 px-3 py-1 font-mono text-[11px] font-normal text-[#10B981]"
            >
              +18.4%
            </Badge>
          </div>
          <div className="flex-1 flex items-end gap-[5px]">
            {bars.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end" style={{ height: '100%' }}>
                <motion.div
                  initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.04, ease: [0.2, 0.8, 0.2, 1] }}
                  style={{
                    height: `${(h / maxBar) * 100}%`,
                    background: i === bars.length - 1 ? ACCENT : `${ACCENT}55`,
                    borderRadius: 4,
                    transformOrigin: 'bottom',
                  }}
                />
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Stat cards — first 2 stacked in col 3 */}
      {stats.slice(0, 2).map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
        >
          <Card className={cn(dashCard, 'justify-between')}>
            <div className="text-[11px]" style={{ fontFamily: mono, color: MUTED }}>{s.label}</div>
            <div>
              <div
                className="text-[32px] font-semibold leading-none mb-1"
                style={{ fontFamily: heading, color: TEXT }}
              >
                {s.value}
              </div>
              <div className="text-[11px]" style={{ fontFamily: mono, color: MUTED }}>{s.delta}</div>
            </div>
          </Card>
        </motion.div>
      ))}

      {/* Quick actions — col 4, row-span-2 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.28 }}
        className="row-span-2"
      >
        <Card
          className={cn(dashCard, 'gap-3 border-[#FF6B6B]/[0.21] bg-[#FF6B6B]/[0.07]')}
          style={{ boxShadow: `0 0 0 1px ${ACCENT}18 inset` }}
        >
          <div
            className="text-[10.5px] uppercase tracking-[0.14em]"
            style={{ fontFamily: mono, color: ACCENT }}
          >
            Quick Actions
          </div>
          <div className="flex flex-col gap-2 flex-1">
            {[
              { label: '+ New blog', href: '/admin/blogs/new' },
              { label: '+ New project', href: '/admin/projects/new' },
            ].map((a) => (
              <Button
                key={a.label}
                asChild
                variant="outline"
                className="h-auto w-full justify-start rounded-[10px] border-white/[0.08] bg-black/35 px-4 py-[10px] font-mono text-[13px] font-normal text-[#EDEDEF] hover:border-[#FF6B6B]/50 hover:bg-black/35 hover:text-[#FF6B6B]"
              >
                <Link href={a.href}>{a.label}</Link>
              </Button>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Top pages — 2 cols × 1 row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.32 }}
        className="col-span-2"
      >
        <Card className={dashCard}>
          <SectionLabel>top pages</SectionLabel>
          <div className="flex flex-col gap-[6px]">
            {topPages.slice(0, 3).map((pg) => (
              <div key={pg.path} className="flex items-center gap-3">
                <span className="text-[12px] w-[80px] shrink-0" style={{ fontFamily: mono, color: TEXT2 }}>{pg.path}</span>
                <div className="flex-1 h-[4px] rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pg.pct}%`, background: `${ACCENT}88` }}
                  />
                </div>
                <span className="text-[11px] w-[50px] text-right" style={{ fontFamily: mono, color: MUTED }}>{pg.views}</span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Recent activity — 2 cols × 2 rows */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.36 }}
        className="col-span-2 row-span-2"
      >
        <Card className={dashCard}>
          <SectionLabel>recent activity</SectionLabel>
          <div className="flex flex-col gap-4 flex-1 overflow-auto">
            {activity.map((a, i) => (
              <div key={i} className="flex gap-3">
                <div
                  className="w-[6px] h-[6px] rounded-full mt-[7px] shrink-0"
                  style={{ background: ACCENT }}
                />
                <div>
                  <div className="text-[13px] leading-snug" style={{ color: TEXT2 }}>{a.text}</div>
                  <div className="text-[11px] mt-1" style={{ fontFamily: mono, color: MUTED }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Unread messages — 2 cols × 2 rows */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="col-span-2 row-span-2"
      >
        <Card className={dashCard}>
          <SectionLabel>unread messages</SectionLabel>
          <div className="flex flex-col gap-3 flex-1 overflow-auto">
            {msgs.filter(m => !m.read).slice(0, 3).map((m) => (
              <Card
                key={m.id}
                className="gap-0 rounded-[12px] border-border bg-white/[0.02] p-3 shadow-none"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[13px] font-medium" style={{ color: TEXT }}>{m.name}</span>
                  <span className="text-[10.5px]" style={{ fontFamily: mono, color: MUTED }}>{m.time}</span>
                </div>
                <div className="text-[12px] mb-1" style={{ color: TEXT2 }}>{m.subject}</div>
                <div
                  className="text-[11.5px] leading-snug overflow-hidden"
                  style={{ color: MUTED, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
                >
                  {m.body}
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </motion.div>

    </div>
  );
}
