'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card } from '@/components/components/ui/card';
import { Button } from '@/components/components/ui/button';
import { cn } from '@/components/lib/utils';
import {
  useAdminOverview,
  useAdminChart,
  useAdminContentCounts,
  useAdminActivity,
  useAdminInbox,
} from '../../../services/adminService';
import {
  ACCENT,
  MUTED,
  TEXT,
  TEXT2,
  mono,
  heading,
  dashCard,
  SectionLabel,
} from '../../../components/admin/adminUi';
import {
  ChartSkeleton,
  StatCardSkeleton,
} from '../../../components/admin/analyticsSkeleton';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay },
});

export default function AdminDashboardPage() {
  const { data: stats = [], isLoading: statsLoading } = useAdminOverview();
  const { data: bars = [], isLoading: chartLoading } = useAdminChart();
  const { data: contentCounts = [] } = useAdminContentCounts();
  const { data: activity = [] } = useAdminActivity();
  const { data: msgs = [] } = useAdminInbox();

  const maxBar = Math.max(...bars, 1);
  const unread = msgs.filter((m) => !m.read);

  return (
    <div className="flex w-full max-w-[1280px] flex-col gap-4">
      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {statsLoading &&
          [0, 1, 2].map((i) => <StatCardSkeleton key={i} />)}
        {stats.map((s, i) => (
          <motion.div key={s.label} {...fade(i * 0.05)} className="min-w-0">
            <Card
              className={cn(
                dashCard,
                'h-auto min-h-[112px] justify-between gap-3 p-5',
              )}
            >
              <div
                className="text-[11px]"
                style={{ fontFamily: mono, color: MUTED }}
              >
                {s.label}
              </div>
              <div>
                <div
                  className="text-[32px] font-semibold leading-none mb-1"
                  style={{ fontFamily: heading, color: TEXT }}
                >
                  {s.value}
                </div>
                <div
                  className="text-[11px]"
                  style={{ fontFamily: mono, color: MUTED }}
                >
                  {s.delta}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Content chart + quick actions */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <motion.div {...fade(0.12)} className="min-w-0 lg:col-span-2">
          <Card className={cn(dashCard, 'h-auto min-h-[260px] p-5')}>
            <SectionLabel>content created — last 14 days</SectionLabel>
            {chartLoading ? (
              <ChartSkeleton variant="bars" height={180} />
            ) : (
              <div className="flex h-[180px] items-end gap-[6px]">
                {bars.map((value, i) => (
                  <div
                    key={i}
                    className="flex h-full flex-1 flex-col justify-end"
                  >
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{
                        duration: 0.5,
                        delay: i * 0.04,
                        ease: [0.2, 0.8, 0.2, 1],
                      }}
                      style={{
                        height: `${(value / maxBar) * 100}%`,
                        background:
                          i === bars.length - 1 ? ACCENT : `${ACCENT}55`,
                        borderRadius: 4,
                        transformOrigin: 'bottom',
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        <motion.div {...fade(0.18)} className="min-w-0">
          <Card
            className={cn(
              dashCard,
              'h-full gap-3 border-[#FF6B6B]/[0.21] bg-[#FF6B6B]/[0.07] p-5',
            )}
            style={{ boxShadow: `0 0 0 1px ${ACCENT}18 inset` }}
          >
            <div
              className="text-[10.5px] uppercase tracking-[0.14em]"
              style={{ fontFamily: mono, color: ACCENT }}
            >
              Quick Actions
            </div>
            <div className="flex flex-1 flex-col gap-2">
              {[
                { label: '+ New blog', href: '/studio-7f3c9a/blogs/new' },
                { label: '+ New project', href: '/studio-7f3c9a/projects/new' },
              ].map((action) => (
                <Button
                  key={action.label}
                  asChild
                  variant="outline"
                  className="h-auto w-full justify-start rounded-[10px] border-white/[0.08] bg-black/35 px-4 py-[10px] font-mono text-[13px] font-normal text-[#EDEDEF] hover:border-[#FF6B6B]/50 hover:bg-black/35 hover:text-[#FF6B6B]"
                >
                  <Link href={action.href}>{action.label}</Link>
                </Button>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Breakdown, activity and inbox */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <motion.div {...fade(0.24)} className="min-w-0">
          <Card className={cn(dashCard, 'h-auto p-5')}>
            <SectionLabel>content breakdown</SectionLabel>
            <div className="flex flex-col gap-[10px]">
              {contentCounts.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span
                    className="w-[80px] shrink-0 text-[12px]"
                    style={{ fontFamily: mono, color: TEXT2 }}
                  >
                    {item.label}
                  </span>
                  <div
                    className="h-[4px] flex-1 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.06)' }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${item.pct}%`,
                        background: `${ACCENT}88`,
                      }}
                    />
                  </div>
                  <span
                    className="w-[50px] shrink-0 text-right text-[11px]"
                    style={{ fontFamily: mono, color: MUTED }}
                  >
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div {...fade(0.3)} className="min-w-0">
          <Card className={cn(dashCard, 'h-auto p-5')}>
            <SectionLabel>recent activity</SectionLabel>
            {activity.length === 0 ? (
              <EmptyNote label="No activity yet" />
            ) : (
              <div className="flex flex-col gap-4">
                {activity.slice(0, 5).map((item, i) => (
                  <div key={i} className="flex min-w-0 gap-3">
                    <div
                      className="mt-[7px] h-[6px] w-[6px] shrink-0 rounded-full"
                      style={{ background: ACCENT }}
                    />
                    <div className="min-w-0">
                      <div
                        className="break-words text-[13px] leading-snug"
                        style={{ color: TEXT2 }}
                      >
                        {item.text}
                      </div>
                      <div
                        className="mt-1 text-[11px]"
                        style={{ fontFamily: mono, color: MUTED }}
                      >
                        {item.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        <motion.div
          {...fade(0.36)}
          className="min-w-0 lg:col-span-2 xl:col-span-1"
        >
          <Card className={cn(dashCard, 'h-auto p-5')}>
            <SectionLabel>unread messages</SectionLabel>
            {unread.length === 0 ? (
              <EmptyNote label="No unread messages" />
            ) : (
              <div className="flex flex-col gap-3">
                {unread.slice(0, 3).map((msg) => (
                  <Card
                    key={msg.id}
                    className="gap-0 rounded-[12px] border-border bg-white/[0.02] p-3 shadow-none"
                  >
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <span
                        className="truncate text-[13px] font-medium"
                        style={{ color: TEXT }}
                      >
                        {msg.name}
                      </span>
                      <span
                        className="shrink-0 text-[10.5px]"
                        style={{ fontFamily: mono, color: MUTED }}
                      >
                        {msg.time}
                      </span>
                    </div>
                    <div
                      className="mb-1 truncate text-[12px]"
                      style={{ color: TEXT2 }}
                    >
                      {msg.subject}
                    </div>
                    <div
                      className="overflow-hidden text-[11.5px] leading-snug"
                      style={{
                        color: MUTED,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {msg.body}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function EmptyNote({ label }: { label: string }) {
  return (
    <div
      className="py-6 text-[12px]"
      style={{ fontFamily: mono, color: MUTED }}
    >
      {label}
    </div>
  );
}
