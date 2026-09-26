'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  PenLine,
  Mail,
  Settings,
  LogOut,
  Plus,
  Search,
  X,
  type LucideIcon,
} from 'lucide-react';
import {
  useAdminOverview,
  useAdminChart,
  useAdminTopPages,
  useAdminActivity,
  useAdminInbox,
  useMarkMessageRead,
  useDeleteMessage,
  useAdminProjects,
  useAdminPosts,
  useDeletePost,
  useAdminAbout,
  useUpdateProfile,
  useAdminResume,
  useCreateResumeItem,
  useUpdateResumeItem,
  useDeleteResumeItem,
  useUpdateMe,
} from '../../services/adminService';
import { useAboutEducation } from '../../services/aboutService';
import { useAdminLogout, useAdminMe } from '../../services/authService';
import { useDeleteProject } from '../../services/projectsService';
import { api } from '../../lib/apiClient';
import { Button } from '@/components/components/ui/button';
import { Input } from '@/components/components/ui/input';
import { Textarea } from '@/components/components/ui/textarea';
import { Badge } from '@/components/components/ui/badge';
import { Label } from '@/components/components/ui/label';
import { Switch } from '@/components/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/components/ui/alert-dialog';
import { cn } from '@/components/lib/utils';
import type { ResumeSection, CreateResumeItemPayload, UpdateResumeItemPayload } from '../../types/resume';

// ─── types ───────────────────────────────────────────────────────────────────
type Tab = 'dashboard' | 'projects' | 'posts' | 'about' | 'experience' | 'education-certs' | 'skills' | 'editor' | 'inbox' | 'settings';
interface InboxMsg { id: number; name: string; email: string; subject: string; body: string; time: string; read: boolean; }
type ResumeRow = { id?: string; title: string; period: string; organization: string; body: string };
type SkillRow = { id?: string; title: string; body: string };

// ─── design tokens ────────────────────────────────────────────────────────────
const BG = '#09090B';
const SURFACE = '#0C0C0F';
const BORDER = 'rgba(255,255,255,0.07)';
const ACCENT = '#FF6B6B';
const MUTED = '#6E6E78';
const TEXT = '#EDEDEF';
const TEXT2 = '#A1A1AA';

const mono = 'var(--font-jetbrains-mono), monospace';
const heading = 'var(--font-space-grotesk), sans-serif';
const body = 'var(--font-sora), system-ui, sans-serif';

// ─── Nav item ────────────────────────────────────────────────────────────────
const navItems: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'posts', label: 'Posts', icon: FileText },
  { id: 'about', label: 'About', icon: User },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'education-certs', label: 'Education & Certs', icon: GraduationCap },
  { id: 'skills', label: 'Skills', icon: Wrench },
  { id: 'editor', label: 'Editor', icon: PenLine },
  { id: 'inbox', label: 'Inbox', icon: Mail },
  { id: 'settings', label: 'Settings', icon: Settings },
];

/** Bordered dark form field — the default look for the admin edit forms. */
const formField =
  'rounded-[10px] border-border bg-[#131317] text-[13.5px] shadow-none ' +
  'placeholder:text-[#3F3F46] focus-visible:border-[#FF6B6B]/55 focus-visible:ring-0';

/** Small accent-outlined "+ add" action used across the resume/about editors. */
const addButton =
  'h-auto rounded-[8px] border-[#FF6B6B]/[0.27] bg-[#FF6B6B]/10 px-3 py-[5px] ' +
  'font-mono text-[11px] font-normal text-[#FF6B6B] hover:bg-[#FF6B6B]/20 hover:text-[#FF6B6B]';

/** Primary accent save button shared by the About / resume / settings tabs. */
const saveButton =
  'h-auto self-start rounded-[12px] px-6 py-[10px] font-mono text-[13px] font-medium text-[#111]';

/** Dashboard panel: Card stripped of its default airy padding to keep density. */
const dashCard =
  'flex h-full flex-col gap-0 rounded-[16px] border-border bg-[#111115] p-5 shadow-none';

/** Editor/resume sub-panel card. */
const panelCard =
  'flex flex-col gap-3 rounded-[14px] border-border bg-[#111115] p-4 shadow-none';

/** Accent-outlined "+ New …" button above the project/post tables. */
const newButton =
  'h-auto rounded-[10px] border-[#FF6B6B]/[0.27] bg-[#FF6B6B]/10 px-4 py-2 ' +
  'font-mono text-[12px] font-normal text-[#FF6B6B] hover:bg-[#FF6B6B]/20 hover:text-[#FF6B6B]';

/** Table header cell. */
const tableHead =
  'h-auto px-5 py-3 font-mono text-[10.5px] font-normal uppercase tracking-[0.12em] text-[#6E6E78]';

/** Small in-row action button. */
const rowButton =
  'h-auto rounded-[8px] border-border bg-transparent px-3 py-1 font-mono text-[11px] font-normal text-[#A1A1AA] hover:text-[#EDEDEF]';

/** Field label inside the resume/skills entry cards. */
const resumeLabel = 'mb-1 block font-mono text-[10.5px] font-normal text-[#6E6E78]';

/** Destructive twin of {@link rowButton}. */
const rowDangerButton =
  'h-auto rounded-[8px] border-destructive/30 bg-destructive/10 px-3 py-1 font-mono text-[11px] font-normal text-destructive hover:bg-destructive/20 hover:text-destructive';

/** Destructive action guarded by a confirmation dialog. */
function ConfirmDelete({
  title,
  description,
  onConfirm,
  disabled,
  label = 'del',
  className,
}: {
  title: string;
  description: string;
  onConfirm: () => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" variant="outline" size="xs" disabled={disabled} className={cn(rowDangerButton, className)}>
          {label}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ─── Status badge ────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const isLive = status === 'live' || status === 'published';
  return (
    <Badge
      variant="outline"
      className={cn(
        'px-[9px] py-[3px] font-mono text-[10.5px] font-normal',
        isLive
          ? 'border-[#10B981]/25 bg-[#10B981]/10 text-[#10B981]'
          : 'border-border bg-white/[0.04] text-[#6E6E78]',
      )}
    >
      {status}
    </Badge>
  );
}

// ─── Section heading ─────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="text-[10.5px] uppercase tracking-[0.14em] mb-4"
      style={{ fontFamily: mono, color: MUTED }}
    >
      {children}
    </div>
  );
}

// ─── Tag search combobox ─────────────────────────────────────────────────────
function TagSearch({
  selectedTags,
  onAdd,
}: {
  selectedTags: string[];
  onAdd: (tag: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [allTags, setAllTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    // local Next route, so bypass the backend baseURL
    api
      .get<{ tags: string[] }>('/api/tags', { baseURL: '' })
      .then(({ data }) => { setAllTags(data.tags); setLoading(false); })
      .catch(() => setLoading(false));
  }, [open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => {
    function onDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('keydown', onDown);
    document.addEventListener('mousedown', onClickOutside);
    return () => {
      document.removeEventListener('keydown', onDown);
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, []);

  const filtered = allTags.filter(
    (t) =>
      !selectedTags.includes(t) &&
      (query === '' || t.toLowerCase().includes(query.toLowerCase())),
  );

  return (
    <div ref={containerRef} className="relative">
      <Button
        type="button"
        variant="outline"
        size="icon-xs"
        onClick={() => { setOpen((p) => !p); setQuery(''); }}
        title="Add tag"
        className={cn(
          'size-[22px] rounded-[6px] bg-transparent',
          open
            ? 'border-[#FF6B6B]/55 bg-[#FF6B6B]/20 text-[#FF6B6B]'
            : 'border-border text-[#6E6E78] hover:text-[#FF6B6B]',
        )}
      >
        <Plus size={12} strokeWidth={2.2} />
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
            className="absolute right-0 top-[calc(100%+6px)] z-50 w-[260px] rounded-[14px] border overflow-hidden"
            style={{ background: '#0F0F12', borderColor: `${ACCENT}30`, boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px ${ACCENT}18` }}
          >
            {/* Search input */}
            <div
              className="flex items-center gap-2 px-3 py-[10px] border-b"
              style={{ borderColor: BORDER }}
            >
              <Search size={13} style={{ color: MUTED, flexShrink: 0 }} />
              <Input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tags..."
                className="h-auto flex-1 border-none bg-transparent p-0 font-mono text-[13px] shadow-none placeholder:text-[#3F3F46] focus-visible:ring-0 md:text-[13px]"
              />
              {query && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="text-[#6E6E78] hover:bg-transparent hover:text-[#FF6B6B]"
                >
                  <X size={12} />
                </Button>
              )}
            </div>

            {/* Results */}
            <div className="max-h-[200px] overflow-y-auto py-1">
              {loading ? (
                <div className="px-4 py-3 text-[12px]" style={{ fontFamily: mono, color: MUTED }}>
                  Loading...
                </div>
              ) : filtered.length === 0 ? (
                <div className="px-4 py-3 text-[12px]" style={{ fontFamily: mono, color: MUTED }}>
                  {query ? 'No matches' : 'All tags added'}
                </div>
              ) : (
                filtered.map((tag) => (
                  <Button
                    key={tag}
                    type="button"
                    variant="ghost"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onAdd(tag);
                      setQuery('');
                      setOpen(false);
                    }}
                    className="h-auto w-full justify-start gap-2 rounded-none px-3 py-[8px] font-mono text-[13px] font-normal text-[#A1A1AA] hover:bg-[#FF6B6B]/10 hover:text-[#EDEDEF]"
                  >
                    <span
                      className="w-[6px] h-[6px] rounded-full shrink-0"
                      style={{ background: `${ACCENT}80` }}
                    />
                    {tag}
                  </Button>
                ))
              )}
            </div>

            {/* Footer hint */}
            <div
              className="px-3 py-[7px] border-t text-[10.5px]"
              style={{ borderColor: BORDER, fontFamily: mono, color: MUTED }}
            >
              ↵ to select · esc to close
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Dashboard tab ───────────────────────────────────────────────────────────
function DashboardTab() {
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
              { label: '+ New post', href: '/admin/posts/new' },
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

function ProjectsTab() {
  const { data: projects = [] } = useAdminProjects();
  const deleteProject = useDeleteProject();

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <SectionLabel>all projects</SectionLabel>
        <Button asChild variant="outline" size="sm" className={newButton}>
          <Link href="/admin/projects/new">+ New project</Link>
        </Button>
      </div>
      <div className="rounded-[16px] border overflow-hidden" style={{ borderColor: BORDER }}>
        <Table>
          <TableHeader>
            <TableRow className="bg-white/[0.02] hover:bg-white/[0.02]">
              {['Project', 'Type', 'Year', 'Status', 'Actions'].map((h) => (
                <TableHead key={h} className={tableHead}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="px-5 py-[14px] text-[13.5px] font-medium" style={{ color: TEXT }}>{p.title}</TableCell>
                <TableCell className="px-5 py-[14px] text-[12.5px]" style={{ fontFamily: mono, color: TEXT2 }}>{p.kind ?? '—'}</TableCell>
                <TableCell className="px-5 py-[14px] text-[12.5px]" style={{ fontFamily: mono, color: MUTED }}>{p.year ?? '—'}</TableCell>
                <TableCell className="px-5 py-[14px]"><StatusBadge status={p.status} /></TableCell>
                <TableCell className="px-5 py-[14px]">
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="xs" className={rowButton}>
                      <Link href={`/admin/projects/${p.id}/edit`}>edit</Link>
                    </Button>
                    <ConfirmDelete
                      title="Delete this project?"
                      description={`“${p.title}” will be removed from your portfolio. This can’t be undone.`}
                      disabled={deleteProject.isPending}
                      onConfirm={() => deleteProject.mutate(p.id)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

    </div>
  );
}

// ─── Posts tab ────────────────────────────────────────────────────────────────
function PostsTab() {
  const { data: posts = [] } = useAdminPosts();
  const deletePost = useDeletePost();

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <SectionLabel>all posts</SectionLabel>
        <Button asChild variant="outline" size="sm" className={newButton}>
          <Link href="/admin/posts/new">+ New post</Link>
        </Button>
      </div>
      <div className="rounded-[16px] border overflow-hidden" style={{ borderColor: BORDER }}>
        <Table>
          <TableHeader>
            <TableRow className="bg-white/[0.02] hover:bg-white/[0.02]">
              {['Title', 'Tags', 'Date', 'Status', 'Actions'].map((h) => (
                <TableHead key={h} className={tableHead}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="px-5 py-[14px] text-[13px] max-w-[360px] whitespace-normal" style={{ color: TEXT }}>{p.title}</TableCell>
                <TableCell className="px-5 py-[14px]">
                  <div className="flex flex-wrap gap-[5px]">
                    {p.tags.map((t) => (
                      <Badge
                        key={t}
                        variant="outline"
                        className="border-border bg-white/[0.04] px-[9px] py-[3px] font-mono text-[10.5px] font-normal text-[#A1A1AA]"
                      >
                        {t}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="px-5 py-[14px] text-[12px]" style={{ fontFamily: mono, color: MUTED }}>{p.date}</TableCell>
                <TableCell className="px-5 py-[14px]"><StatusBadge status={p.status} /></TableCell>
                <TableCell className="px-5 py-[14px]">
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="xs" className={rowButton}>
                      <Link href={`/admin/posts/${p.id}/edit`}>edit</Link>
                    </Button>
                    <ConfirmDelete
                      title="Delete this post?"
                      description={`“${p.title}” will be permanently removed. This can’t be undone.`}
                      disabled={deletePost.isPending}
                      onConfirm={() => deletePost.mutate(p.id)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

    </div>
  );
}

// ─── Editor tab ───────────────────────────────────────────────────────────────
function EditorTab() {
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const addTag = (t: string) => setSelectedTags((prev) => prev.includes(t) ? prev : [...prev, t]);
  const removeTag = (t: string) => setSelectedTags((prev) => prev.filter((x) => x !== t));

  return (
    <div className="flex gap-5">

      {/* Main editor area */}
      <div className="flex-1 flex flex-col gap-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title..."
          className={cn(formField, 'h-auto px-5 py-3 text-[20px] font-semibold tracking-[-0.02em] md:text-[20px]')}
          style={{ fontFamily: heading }}
        />
        <Textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          placeholder="Excerpt — the summary shown on the blog list..."
          className={cn(formField, 'resize-none px-5 py-3 text-[14px] leading-relaxed md:text-[14px]')}
        />
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your markdown here..."
          className={cn(formField, 'min-h-[460px] flex-1 resize-none px-5 py-4 font-mono text-[13px] leading-relaxed md:text-[13px]')}
        />
      </div>

      {/* Sidebar */}
      <div className="w-[220px] shrink-0 flex flex-col gap-4">

        {/* Status card */}
        <Card className={panelCard}>
          <SectionLabel>publish</SectionLabel>
          <div className="flex flex-col gap-2 mb-4">
            {[
              { label: 'Status', value: 'Draft' },
              { label: 'Visibility', value: 'Private' },
              { label: 'Read time', value: content ? `${Math.max(1, Math.ceil(content.split(' ').length / 200))} min` : '—' },
            ].map((r) => (
              <div key={r.label} className="flex items-center justify-between text-[12px]">
                <span style={{ fontFamily: mono, color: MUTED }}>{r.label}</span>
                <span style={{ color: TEXT2 }}>{r.value}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-auto w-full rounded-[10px] border-border bg-white/[0.04] py-[9px] font-mono text-[12px] font-medium text-[#A1A1AA] hover:text-[#EDEDEF]"
            >
              Save draft
            </Button>
            <Button
              type="button"
              className="h-auto w-full rounded-[10px] py-[9px] font-mono text-[12px] font-medium text-[#111]"
            >
              Publish
            </Button>
          </div>
        </Card>

        {/* Cover image */}
        <Card className={panelCard}>
          <SectionLabel>cover image</SectionLabel>
          <div
            className="rounded-[10px] border border-dashed flex items-center justify-center py-6 text-[11.5px] cursor-pointer transition-colors duration-150"
            style={{ fontFamily: mono, color: MUTED, borderColor: 'rgba(255,255,255,0.12)' }}
          >
            drop image here
          </div>
        </Card>

        {/* Tags */}
        <Card className={panelCard}>
          <div className="flex items-center justify-between mb-3">
            <div
              className="text-[10.5px] uppercase tracking-[0.14em]"
              style={{ fontFamily: mono, color: MUTED }}
            >
              Tags
            </div>
            <TagSearch selectedTags={selectedTags} onAdd={addTag} />
          </div>

          {selectedTags.length === 0 ? (
            <div
              className="text-[11.5px] py-2"
              style={{ fontFamily: mono, color: MUTED }}
            >
              No tags — click + to add
            </div>
          ) : (
            <div className="flex flex-wrap gap-[6px]">
              {selectedTags.map((t) => (
                <Badge
                  key={t}
                  variant="outline"
                  className="gap-1 border-[#FF6B6B]/[0.27] bg-[#FF6B6B]/10 py-[4px] pl-[9px] pr-1 font-mono text-[11px] font-normal text-[#FF6B6B]"
                >
                  {t}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => removeTag(t)}
                    aria-label={`Remove ${t}`}
                    className="size-4 rounded-sm text-[#FF6B6B]/60 hover:bg-transparent hover:text-[#FF6B6B]"
                  >
                    <X size={10} strokeWidth={2.5} />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </Card>

      </div>
    </div>
  );
}

// ─── Inbox tab ────────────────────────────────────────────────────────────────
function InboxTab() {
  const { data: msgs = [] } = useAdminInbox();
  const [selected, setSelected] = useState<InboxMsg | null>(null);
  const markRead = useMarkMessageRead();
  const deleteMessage = useDeleteMessage();

  useEffect(() => {
    if (!selected && msgs.length > 0) setSelected(msgs[0]);
  }, [msgs, selected]);

  const unreadCount = msgs.filter((m) => !m.read).length;

  return (
    <div className="flex gap-4 h-[580px]">

      {/* List panel */}
      <Card className="w-[280px] shrink-0 flex flex-col gap-0 overflow-hidden rounded-[16px] border-border bg-[#111115] p-0 shadow-none">
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: BORDER }}>
          <span className="text-[12px] font-medium" style={{ color: TEXT }}>Inbox</span>
          {unreadCount > 0 && (
            <Badge className="px-2 py-[2px] font-mono text-[10px] font-normal text-[#111]">
              {unreadCount}
            </Badge>
          )}
        </div>
        <div className="flex-1 overflow-auto">
          {msgs.map((m) => (
            <Button
              key={m.id}
              type="button"
              variant="ghost"
              onClick={() => setSelected(m)}
              className={cn(
                'h-auto w-full flex-col items-stretch gap-1 rounded-none border-b border-border px-4 py-3 text-left font-normal',
                selected?.id === m.id ? 'bg-[#FF6B6B]/[0.06] hover:bg-[#FF6B6B]/[0.06]' : 'hover:bg-white/[0.03]',
              )}
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-[13px] font-medium truncate"
                  style={{ color: m.read ? TEXT2 : TEXT }}
                >
                  {!m.read && <span className="inline-block w-[6px] h-[6px] rounded-full mr-2 align-middle" style={{ background: ACCENT }} />}
                  {m.name}
                </span>
                <span className="text-[10px] shrink-0 ml-2" style={{ fontFamily: mono, color: MUTED }}>{m.time}</span>
              </div>
              <div className="text-[12px] truncate text-left" style={{ color: MUTED }}>{m.subject}</div>
            </Button>
          ))}
        </div>
      </Card>

      {/* Detail panel */}
      <AnimatePresence mode="wait">
        {selected ? (
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.25 }}
            className="flex-1 min-w-0"
          >
            <Card className="flex h-full flex-col gap-0 overflow-hidden rounded-[16px] border-border bg-[#111115] p-0 shadow-none">
              <div className="px-6 py-5 border-b" style={{ borderColor: BORDER }}>
                <div className="text-[17px] font-semibold mb-1" style={{ fontFamily: heading, color: TEXT }}>{selected.subject}</div>
                <div className="flex items-center gap-2 text-[12px]" style={{ fontFamily: mono, color: MUTED }}>
                  <span>{selected.name}</span>
                  <span>·</span>
                  <span>{selected.email}</span>
                  <span>·</span>
                  <span>{selected.time}</span>
                </div>
              </div>
              <div className="flex-1 px-6 py-5 overflow-auto text-[14px] leading-relaxed" style={{ color: TEXT2 }}>
                {selected.body}
              </div>
              <div className="px-6 py-4 border-t flex gap-2" style={{ borderColor: BORDER }}>
                <Button
                  type="button"
                  onClick={() => selected && !selected.read && markRead.mutate(selected.id)}
                  disabled={selected?.read || markRead.isPending}
                  className="h-auto rounded-[10px] px-4 py-2 font-mono text-[12px] font-normal text-[#111]"
                >
                  {selected?.read ? 'Read' : 'Mark read'}
                </Button>
                <ConfirmDelete
                  label="Delete"
                  title="Delete this message?"
                  description={`The message from ${selected.name} will be permanently removed. This can’t be undone.`}
                  disabled={deleteMessage.isPending}
                  className="px-4 py-2 text-[12px]"
                  onConfirm={() => {
                    if (!selected) return;
                    const id = selected.id;
                    setSelected(msgs.find((m) => m.id !== id) ?? null);
                    deleteMessage.mutate(id);
                  }}
                />
              </div>
            </Card>
          </motion.div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-[13px]" style={{ fontFamily: mono, color: MUTED }}>
            select a message
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── About tab ────────────────────────────────────────────────────────────────
function AboutTab() {
  const { data: about } = useAdminAbout();
  const updateProfile = useUpdateProfile();

  const [headline, setHeadline] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [facts, setFacts] = useState<{ k: string; v: string }[]>([]);
  const hydrated = useRef(false);

  useEffect(() => {
    if (about && !hydrated.current) {
      hydrated.current = true;
      setHeadline(about.headline ?? '');
      setCoverImage(about.coverImage ?? '');
      setParagraphs(about.paragraphs ?? []);
      setFacts(about.facts ?? []);
    }
  }, [about]);

  const handleSave = () => {
    updateProfile.mutate(
      { headline, coverImage: coverImage || undefined, paragraphs, facts },
      { onSuccess: () => toast.success('Saved') },
    );
  };

  const { data: educationEntries = [] } = useAboutEducation();

  return (
    <div className="max-w-[860px] flex flex-col gap-10">

      {/* ── Headline ── */}
      <div>
        <SectionLabel>page headline</SectionLabel>
        <Input
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          placeholder="e.g. ML engineer with a full-stack habit"
          className={cn(formField, 'h-auto px-4 py-[10px] text-[15px] font-semibold tracking-[-0.02em] md:text-[15px]')}
          style={{ fontFamily: heading }}
        />
        <div className="text-[11px] mt-2" style={{ fontFamily: mono, color: MUTED }}>
          The accent dot (.) is appended automatically on the public page.
        </div>
      </div>

      {/* ── Cover image ── */}
      <div>
        <SectionLabel>cover image</SectionLabel>
        <Input
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          placeholder="https://example.com/portrait.jpg  (or leave blank for placeholder)"
          className={cn(formField, 'h-auto px-4 py-[10px]')}
        />
        {coverImage && (
          <div
            className="mt-3 rounded-[12px] border overflow-hidden"
            style={{ borderColor: BORDER, maxWidth: 160, aspectRatio: '4/5' }}
          >
            <img
              src={coverImage}
              alt="cover preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}
      </div>

      {/* ── Bio paragraphs ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <SectionLabel>bio paragraphs</SectionLabel>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setParagraphs((prev) => [...prev, ''])}
            className={addButton}
          >
            + add paragraph
          </Button>
        </div>
        <div className="flex flex-col gap-3">
          {paragraphs.map((p, i) => (
            <div key={i} className="flex gap-2 items-start">
              <Textarea
                value={p}
                onChange={(e) => setParagraphs((prev) => prev.map((x, j) => j === i ? e.target.value : x))}
                rows={3}
                className={cn(formField, 'flex-1 resize-none px-4 py-3 leading-relaxed')}
              />
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={() => setParagraphs((prev) => prev.filter((_, j) => j !== i))}
                className={cn(rowDangerButton, 'mt-[1px] shrink-0 py-[7px]')}
              >
                del
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* ── Education & certifications (view-only) ── */}
      <div>
        <SectionLabel>education &amp; certifications</SectionLabel>
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}
        >
          {educationEntries.map((e, i) => (
            <Card
              key={i}
              className="gap-0 rounded-[16px] border-white/[0.08] bg-[#0C0C0F] p-6 shadow-none"
            >
              <div
                className="text-[11.5px] mb-3"
                style={{ fontFamily: mono, color: ACCENT }}
              >
                {e.period}
              </div>
              <div
                className="text-[18px] font-semibold mb-[6px]"
                style={{ fontFamily: heading, letterSpacing: '-0.02em', color: TEXT }}
              >
                {e.title}
              </div>
              <div className="text-[14px] leading-[1.6]" style={{ color: '#8A8A93' }}>
                {e.place}
              </div>
            </Card>
          ))}
        </div>
        <div className="text-[11px] mt-3" style={{ fontFamily: mono, color: MUTED }}>
          Manage education entries in the Resume tab.
        </div>
      </div>

      {/* ── Beyond the keyboard (facts) ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <SectionLabel>beyond the keyboard</SectionLabel>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setFacts((prev) => [...prev, { k: '', v: '' }])}
            className={addButton}
          >
            + add fact
          </Button>
        </div>
        <div className="flex flex-col gap-3">
          {facts.map((f, i) => (
            <div key={i} className="flex gap-3 items-center">
              <Input
                value={f.k}
                onChange={(e) => setFacts((prev) => prev.map((row, j) => j === i ? { ...row, k: e.target.value } : row))}
                placeholder="label"
                className={cn(formField, 'h-auto w-[180px] shrink-0 rounded-[9px] px-3 py-[8px] font-mono text-[12px] md:text-[12px]')}
              />
              <Input
                value={f.v}
                onChange={(e) => setFacts((prev) => prev.map((row, j) => j === i ? { ...row, v: e.target.value } : row))}
                placeholder="value"
                className={cn(formField, 'h-auto flex-1 rounded-[9px] px-3 py-[8px]')}
              />
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={() => setFacts((prev) => prev.filter((_, j) => j !== i))}
                className={cn(rowDangerButton, 'shrink-0 py-[7px]')}
              >
                del
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* ── Save ── */}
      <Button
        type="button"
        onClick={handleSave}
        disabled={updateProfile.isPending}
        className={saveButton}
      >
        {updateProfile.isPending ? 'Saving…' : 'Save changes'}
      </Button>

    </div>
  );
}

// ─── Shared resume row save/diff ──────────────────────────────────────────────
async function saveResumeRows(
  section: ResumeSection,
  rows: { id?: string; title: string; period?: string; organization?: string; body?: string }[],
  originalIds: string[],
  extra: (row: (typeof rows)[number]) => Partial<CreateResumeItemPayload>,
  ops: {
    create: (p: CreateResumeItemPayload) => Promise<unknown>;
    update: (p: UpdateResumeItemPayload & { id: string }) => Promise<unknown>;
    del: (id: string) => Promise<unknown>;
  },
) {
  const currentIds = new Set(rows.filter((r) => r.id).map((r) => r.id!));
  const toDelete = originalIds.filter((id) => !currentIds.has(id));
  await Promise.all([
    ...toDelete.map((id) => ops.del(id)),
    ...rows.map((row, i) => {
      const payload = {
        title: row.title,
        organization: row.organization || undefined,
        period: row.period || undefined,
        order: i,
        ...extra(row),
      };
      return row.id ? ops.update({ id: row.id, ...payload }) : ops.create({ section, ...payload });
    }),
  ]);
}

// ─── Shared resume row editor ─────────────────────────────────────────────────
function ResumeRowEditor<T extends ResumeRow>({
  rows,
  setRows,
  addLabel,
}: {
  rows: T[];
  setRows: React.Dispatch<React.SetStateAction<T[]>>;
  addLabel: string;
}) {
  return (
    <>
      <div className="flex justify-end mb-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setRows((prev) => [...prev, { title: '', period: '', organization: '', body: '' } as T])}
          className={addButton}
        >
          {addLabel}
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        {rows.map((row, i) => (
          <Card key={i} className={panelCard}>
            <div className="flex items-center justify-between">
              <div className="text-[11px]" style={{ fontFamily: mono, color: MUTED }}>entry {i + 1}</div>
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={() => setRows((prev) => prev.filter((_, j) => j !== i))}
                className={cn(rowDangerButton, 'rounded-[7px] py-[4px] text-[10.5px]')}
              >
                remove
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {(['title', 'organization'] as const).map((f) => (
                <div key={f}>
                  <Label className={resumeLabel}>{f}</Label>
                  <Input
                    value={row[f]}
                    onChange={(e) => setRows((prev) => prev.map((r, j) => j === i ? { ...r, [f]: e.target.value } : r))}
                    className={cn(formField, 'h-auto rounded-[9px] px-3 py-[8px] text-[13px] md:text-[13px]')}
                  />
                </div>
              ))}
            </div>
            <div>
              <Label className={resumeLabel}>period</Label>
              <Input
                value={row.period}
                onChange={(e) => setRows((prev) => prev.map((r, j) => j === i ? { ...r, period: e.target.value } : r))}
                placeholder="e.g. 2023 — present"
                className={cn(formField, 'h-auto rounded-[9px] px-3 py-[8px] text-[13px] md:text-[13px]')}
              />
            </div>
            <div>
              <Label className={resumeLabel}>body</Label>
              <Textarea
                value={row.body}
                onChange={(e) => setRows((prev) => prev.map((r, j) => j === i ? { ...r, body: e.target.value } : r))}
                rows={2}
                className={cn(formField, 'resize-none rounded-[9px] px-3 py-[8px] text-[13px] leading-relaxed md:text-[13px]')}
              />
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

// ─── Experience tab ───────────────────────────────────────────────────────────
function ExperienceTab() {
  const { data: resumeAdmin } = useAdminResume();
  const [experiences, setExperiences] = useState<ResumeRow[]>([]);
  const hydrated = useRef(false);
  const originalIds = useRef<string[]>([]);
  const [saving, setSaving] = useState(false);
  const createItem = useCreateResumeItem();
  const updateItem = useUpdateResumeItem();
  const deleteItem = useDeleteResumeItem();

  useEffect(() => {
    if (resumeAdmin && !hydrated.current) {
      hydrated.current = true;
      const rows = resumeAdmin.experiences.map((e) => ({
        id: e.id,
        title: e.title,
        period: e.period ?? '',
        organization: e.organization ?? '',
        body: e.points.length ? e.points.join('\n') : (e.body ?? ''),
      }));
      setExperiences(rows);
      originalIds.current = rows.filter((r) => r.id).map((r) => r.id!);
    }
  }, [resumeAdmin]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveResumeRows(
        'EXPERIENCE',
        experiences,
        originalIds.current,
        (row) => ({ points: row.body ? row.body.split('\n').map((s) => s.trim()).filter(Boolean) : [] }),
        { create: (p) => createItem.mutateAsync(p), update: (p) => updateItem.mutateAsync(p), del: (id) => deleteItem.mutateAsync(id) },
      );
      toast.success('Saved');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-[860px] flex flex-col gap-6">
      <SectionLabel>experience</SectionLabel>
      <ResumeRowEditor rows={experiences} setRows={setExperiences} addLabel="+ add experience" />
      <Button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className={saveButton}
      >
        {saving ? 'Saving…' : 'Save changes'}
      </Button>
    </div>
  );
}

// ─── Education & Certs tab ────────────────────────────────────────────────────
function EducationCertsTab() {
  const { data: resumeAdmin } = useAdminResume();
  const [educationEntries, setEducationEntries] = useState<ResumeRow[]>([]);
  const [certs, setCerts] = useState<ResumeRow[]>([]);
  const hydrated = useRef(false);
  const originalEduIds = useRef<string[]>([]);
  const originalCertIds = useRef<string[]>([]);
  const [saving, setSaving] = useState(false);
  const createItem = useCreateResumeItem();
  const updateItem = useUpdateResumeItem();
  const deleteItem = useDeleteResumeItem();

  useEffect(() => {
    if (resumeAdmin && !hydrated.current) {
      hydrated.current = true;
      const toRow = (e: { id: string; title: string; period: string | null; organization: string | null; body: string | null }) => ({
        id: e.id, title: e.title, period: e.period ?? '', organization: e.organization ?? '', body: e.body ?? '',
      });
      const eduRows = resumeAdmin.education.map(toRow);
      const certRows = resumeAdmin.certifications.map(toRow);
      setEducationEntries(eduRows);
      setCerts(certRows);
      originalEduIds.current = eduRows.filter((r) => r.id).map((r) => r.id!);
      originalCertIds.current = certRows.filter((r) => r.id).map((r) => r.id!);
    }
  }, [resumeAdmin]);

  const handleSave = async () => {
    setSaving(true);
    const bodyExtra = (row: { body?: string }) => ({ body: row.body || undefined });
    const ops = { create: (p: CreateResumeItemPayload) => createItem.mutateAsync(p), update: (p: UpdateResumeItemPayload & { id: string }) => updateItem.mutateAsync(p), del: (id: string) => deleteItem.mutateAsync(id) };
    try {
      await Promise.all([
        saveResumeRows('EDUCATION', educationEntries, originalEduIds.current, bodyExtra, ops),
        saveResumeRows('CERTIFICATION', certs, originalCertIds.current, bodyExtra, ops),
      ]);
      toast.success('Saved');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-[860px] flex flex-col gap-10">
      <div>
        <SectionLabel>education</SectionLabel>
        <ResumeRowEditor rows={educationEntries} setRows={setEducationEntries} addLabel="+ add education" />
      </div>
      <div>
        <SectionLabel>certifications</SectionLabel>
        <ResumeRowEditor rows={certs} setRows={setCerts} addLabel="+ add certification" />
      </div>
      <Button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className={saveButton}
      >
        {saving ? 'Saving…' : 'Save changes'}
      </Button>
    </div>
  );
}

// ─── Skills tab ───────────────────────────────────────────────────────────────
function SkillsTab() {
  const { data: resumeAdmin } = useAdminResume();
  const [skills, setSkills] = useState<SkillRow[]>([]);
  const hydrated = useRef(false);
  const originalIds = useRef<string[]>([]);
  const [saving, setSaving] = useState(false);
  const createItem = useCreateResumeItem();
  const updateItem = useUpdateResumeItem();
  const deleteItem = useDeleteResumeItem();

  useEffect(() => {
    if (resumeAdmin && !hydrated.current) {
      hydrated.current = true;
      const rows = resumeAdmin.skills.map((s) => ({ id: s.id, title: s.title, body: s.body ?? '' }));
      setSkills(rows);
      originalIds.current = rows.filter((r) => r.id).map((r) => r.id!);
    }
  }, [resumeAdmin]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveResumeRows(
        'SKILL',
        skills,
        originalIds.current,
        (row) => ({ body: row.body || undefined }),
        { create: (p) => createItem.mutateAsync(p), update: (p) => updateItem.mutateAsync(p), del: (id) => deleteItem.mutateAsync(id) },
      );
      toast.success('Saved');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-[860px] flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <SectionLabel>skills</SectionLabel>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setSkills((prev) => [...prev, { title: '', body: '' }])}
          className={addButton}
        >
          + add category
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        {skills.map((skill, i) => (
          <Card key={i} className={panelCard}>
            <div className="flex items-center justify-between">
              <div className="text-[11px]" style={{ fontFamily: mono, color: MUTED }}>category {i + 1}</div>
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={() => setSkills((prev) => prev.filter((_, j) => j !== i))}
                className={cn(rowDangerButton, 'rounded-[7px] py-[4px] text-[10.5px]')}
              >
                remove
              </Button>
            </div>
            <div>
              <Label className={resumeLabel}>category name</Label>
              <Input
                value={skill.title}
                onChange={(e) => setSkills((prev) => prev.map((r, j) => j === i ? { ...r, title: e.target.value } : r))}
                className={cn(formField, 'h-auto rounded-[9px] px-3 py-[8px] text-[13px] md:text-[13px]')}
              />
            </div>
            <div>
              <Label className={resumeLabel}>items (comma-separated)</Label>
              <Textarea
                value={skill.body}
                onChange={(e) => setSkills((prev) => prev.map((r, j) => j === i ? { ...r, body: e.target.value } : r))}
                rows={2}
                className={cn(formField, 'resize-none rounded-[9px] px-3 py-[8px] text-[13px] leading-relaxed md:text-[13px]')}
              />
            </div>
          </Card>
        ))}
      </div>
      <Button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className={saveButton}
      >
        {saving ? 'Saving…' : 'Save changes'}
      </Button>
    </div>
  );
}

// ─── Settings tab ─────────────────────────────────────────────────────────────
const SETTINGS_FIELDS = ['Display name', 'Email', 'Tagline', 'Location'];

function SettingsTab() {
  const { data: me } = useAdminMe();
  const updateMe = useUpdateMe();
  const [vals, setVals] = useState<Record<string, string>>(
    Object.fromEntries(SETTINGS_FIELDS.map((f) => [f, '']))
  );
  const hydrated = useRef(false);

  useEffect(() => {
    if (me && !hydrated.current) {
      hydrated.current = true;
      setVals((prev) => ({ ...prev, 'Display name': me.name ?? '', Email: me.email ?? '' }));
    }
  }, [me]);

  const handleSave = () => {
    updateMe.mutate({ name: vals['Display name'] }, { onSuccess: () => toast.success('Saved') });
  };

  const [notifEmail, setNotifEmail] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [analytics, setAnalytics] = useState(false);

  return (
    <div className="max-w-[680px] flex flex-col gap-8">

      {/* Profile fields */}
      <div>
        <SectionLabel>profile</SectionLabel>
        <div className="grid grid-cols-2 gap-4">
          {SETTINGS_FIELDS.map((label) => (
            <div key={label}>
              <Label htmlFor={`settings-${label}`} className="mb-2 block font-mono text-[11px] font-normal text-[#6E6E78]">
                {label}
              </Label>
              <Input
                id={`settings-${label}`}
                value={vals[label]}
                disabled={label === 'Email'}
                onChange={(e) => setVals((prev) => ({ ...prev, [label]: e.target.value }))}
                className={cn(formField, 'h-auto px-4 py-[10px]')}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Preferences toggles */}
      <div>
        <SectionLabel>preferences</SectionLabel>
        <div className="flex flex-col gap-3">
          {[
            { label: 'Email notifications', desc: 'Get notified about new messages', val: notifEmail, set: setNotifEmail },
            { label: 'Dark mode', desc: 'Use the dark theme everywhere', val: darkMode, set: setDarkMode },
            { label: 'Analytics', desc: 'Share anonymous usage data', val: analytics, set: setAnalytics },
          ].map((pref) => {
            const id = `pref-${pref.label.replace(/\s+/g, '-').toLowerCase()}`;
            return (
              <Card
                key={pref.label}
                className="flex-row items-center justify-between gap-4 rounded-[12px] border-border bg-[#111115] px-4 py-3 shadow-none"
              >
                <div>
                  <Label htmlFor={id} className="text-[13.5px] font-medium" style={{ color: TEXT }}>
                    {pref.label}
                  </Label>
                  <div className="text-[12px]" style={{ color: MUTED }}>{pref.desc}</div>
                </div>
                <Switch id={id} checked={pref.val} onCheckedChange={pref.set} />
              </Card>
            );
          })}
        </div>
      </div>

      {/* Save button */}
      <Button
        type="button"
        onClick={handleSave}
        disabled={updateMe.isPending}
        className={saveButton}
      >
        {updateMe.isPending ? 'Saving…' : 'Save changes'}
      </Button>

    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const logout = useAdminLogout();
  const tabParam = searchParams?.get('tab') as Tab | null | undefined;
  const [activeTab, setActiveTab] = useState<Tab>(tabParam ?? 'dashboard');
  const { data: inboxMsgs = [] } = useAdminInbox();
  const unread = inboxMsgs.filter((m) => !m.read).length;

  const tabContent: Record<Tab, React.ReactNode> = {
    dashboard: <DashboardTab />,
    projects: <ProjectsTab />,
    posts: <PostsTab />,
    about: <AboutTab />,
    experience: <ExperienceTab />,
    'education-certs': <EducationCertsTab />,
    skills: <SkillsTab />,
    editor: <EditorTab />,
    inbox: <InboxTab />,
    settings: <SettingsTab />,
  };

  return (
    <div
      className="flex min-h-screen"
      style={{ background: BG, color: TEXT, fontFamily: body }}
    >

      {/* ── Sidebar ── */}
      <aside
        className="w-[220px] shrink-0 flex flex-col border-r sticky top-0 h-screen"
        style={{ background: SURFACE, borderColor: BORDER }}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b" style={{ borderColor: BORDER }}>
          <div
            className="text-[18px] font-bold mb-[2px]"
            style={{ fontFamily: heading, letterSpacing: '-0.03em', color: TEXT }}
          >
            BB
          </div>
          <div className="text-[11px]" style={{ fontFamily: mono, color: MUTED }}>
            biraj / admin
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <Button
                key={item.id}
                type="button"
                variant="ghost"
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  'h-auto w-full justify-start gap-3 rounded-[10px] px-3 py-[9px] font-mono text-[13px] font-normal',
                  isActive
                    ? 'bg-[#FF6B6B]/[0.06] text-[#FF6B6B] hover:bg-[#FF6B6B]/[0.06] hover:text-[#FF6B6B]'
                    : 'text-[#6E6E78] hover:bg-white/[0.04] hover:text-[#A1A1AA]',
                )}
              >
                <item.icon size={15} strokeWidth={1.6} />
                {item.label}
                {item.id === 'inbox' && unread > 0 && (
                  <Badge className="ml-auto px-[7px] py-[2px] text-[9.5px] font-normal text-[#111]">
                    {unread}
                  </Badge>
                )}
              </Button>
            );
          })}
        </nav>

        {/* Bottom: avatar + back to site */}
        <div className="px-3 py-4 border-t" style={{ borderColor: BORDER }}>
          <div className="flex items-center gap-3 px-3 py-2 mb-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0"
              style={{ background: `${ACCENT}22`, color: ACCENT }}
            >
              B
            </div>
            <div>
              <div className="text-[12.5px] font-medium" style={{ color: TEXT }}>Biraj</div>
              <div className="text-[10.5px]" style={{ fontFamily: mono, color: MUTED }}>admin</div>
            </div>
          </div>
          <Button
            asChild
            variant="ghost"
            className="h-auto w-full justify-start gap-2 rounded-[10px] px-3 py-[8px] font-mono text-[12px] font-normal text-[#6E6E78] hover:bg-transparent hover:text-[#A1A1AA]"
          >
            <Link href="/">← back to site</Link>
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              logout();
              router.replace('/admin/login');
              router.refresh();
            }}
            className="h-auto w-full justify-start gap-2 rounded-[10px] px-3 py-[8px] font-mono text-[12px] font-normal text-[#6E6E78] hover:bg-transparent hover:text-destructive"
          >
            <LogOut size={13} strokeWidth={1.7} />
            sign out
          </Button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <main className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <div
          className="flex items-center justify-between px-8 py-4 border-b sticky top-0 z-10"
          style={{ background: SURFACE, borderColor: BORDER }}
        >
          <div>
            <div
              className="text-[19px] font-semibold leading-tight"
              style={{ fontFamily: heading, letterSpacing: '-0.025em', color: TEXT }}
            >
              {navItems.find((n) => n.id === activeTab)?.label}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-auto rounded-[10px] border-border bg-transparent px-4 py-[7px] font-mono text-[12px] font-normal text-[#A1A1AA] hover:text-[#EDEDEF]"
            >
              <Link href="/">View site ↗</Link>
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
            >
              {tabContent[activeTab]}
            </motion.div>
          </AnimatePresence>
        </div>

      </main>
    </div>
  );
}
