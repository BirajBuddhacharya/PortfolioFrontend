'use client';

import { useEffect, useState } from 'react';
import { Pencil, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/components/ui/button';
import { Badge } from '@/components/components/ui/badge';
import { Input } from '@/components/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/components/ui/table';
import { Dialog, DialogContent, DialogTitle } from '@/components/components/ui/dialog';
import { Prose } from '../../../../components/Prose';
import { Toc } from '../../../../components/Toc';
import { useAdminPosts, useDeletePost, useUpdatePost } from '../../../../services/adminService';
import { BORDER, TEXT, MUTED, ACCENT, mono, heading, formField, newButton, tableHead, rowButton, SectionLabel, StatusSelect, ConfirmDelete, AdminPagination } from '../../../../components/admin/adminUi';
import { cn } from '@/components/lib/utils';
import type { BlogPost } from '../../../../types/blog';

const BLOG_STATUSES = ['draft', 'published'];
const SIZE = 10;

export default function AdminPostsPage() {
  const deletePost = useDeletePost();
  const updatePost = useUpdatePost();

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [preview, setPreview] = useState<BlogPost | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => { setPage(1); }, [debouncedSearch, statusFilter]);

  const { data } = useAdminPosts({ search: debouncedSearch, status: statusFilter, page, size: SIZE });
  const posts = data?.result ?? [];
  const total = data?.total ?? 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <SectionLabel>all blogs</SectionLabel>
        <Button asChild variant="outline" size="sm" className={newButton}>
          <Link href="/admin/blogs/new">+ New blogs</Link>
        </Button>
      </div>

      {/* Search + filter */}
      <div className="flex gap-3 mb-4 items-center flex-wrap">
        <Input
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={cn(formField, 'h-auto px-3 py-[7px] text-[13px] max-w-[220px]')}
        />
        <div className="flex gap-1">
          {['all', ...BLOG_STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className="px-3 py-[5px] rounded-[7px] text-[11px] border transition-colors duration-150 cursor-pointer"
              style={{
                fontFamily: mono,
                background: statusFilter === s ? 'rgba(255,107,107,0.12)' : 'transparent',
                borderColor: statusFilter === s ? 'rgba(255,107,107,0.4)' : BORDER,
                color: statusFilter === s ? '#FF6B6B' : MUTED,
              }}
            >
              {s}
            </button>
          ))}
        </div>
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
            {posts.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-16">
                  <div className="flex flex-col items-center gap-3">
                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                      <rect x="3" y="3" width="30" height="30" rx="6" stroke="#26262B" strokeWidth="1.5"/>
                      <path d="M10 13h16M10 18h16M10 23h10" stroke="#3F3F46" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span className="text-[12px]" style={{ fontFamily: mono, color: MUTED }}>
                      {search || statusFilter !== 'all' ? 'no matching posts' : 'no posts yet — add one above'}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {posts.map((p) => (
              <TableRow
                key={p.id}
                className="cursor-pointer"
                onClick={() => setPreview(p)}
              >
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
                <TableCell className="px-5 py-[14px] text-[12px]" style={{ fontFamily: mono, color: MUTED }}>{p.publishedAt ? new Date(p.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</TableCell>
                <TableCell className="px-5 py-[14px]">
                  <StatusSelect
                    status={p.status}
                    options={BLOG_STATUSES}
                    disabled={updatePost.isPending}
                    onValueChange={(val) =>
                      updatePost.mutate({ id: p.id, status: val, ...(val === 'published' ? { publishedAt: new Date().toISOString() } : {}) })
                    }
                  />
                </TableCell>
                <TableCell className="px-5 py-[14px]" onClick={(e) => e.stopPropagation()}>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="xs" className={cn(rowButton, 'px-2')}>
                      <Link href={`/admin/blogs/${p.slug}/edit`}><Pencil size={13} /></Link>
                    </Button>
                    <ConfirmDelete
                      title="Delete this post?"
                      description={`"${p.title}" will be permanently removed. This can't be undone.`}
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

      <AdminPagination page={page} total={total} size={SIZE} onPageChange={setPage} />

      {/* Preview modal — full public view */}
      <Dialog open={!!preview} onOpenChange={(open) => !open && setPreview(null)}>
        <DialogContent className="h-[90vh] bg-[#09090B] border-white/[0.08] p-0 overflow-hidden rounded-[20px] flex flex-col" style={{ maxWidth: '1400px', width: '95vw' }}>
          {preview && (
            <>
              {/* Top bar */}
              <div className="flex items-center justify-between px-7 py-3 border-b shrink-0" style={{ borderColor: BORDER, background: '#0C0C0F' }}>
                <div className="flex items-center gap-3">
                  <DialogTitle className="text-[13px] font-medium" style={{ fontFamily: mono, color: MUTED }}>preview</DialogTitle>
                  <span
                    className="text-[10px] px-[8px] py-[2px] rounded-full border"
                    style={{
                      fontFamily: mono,
                      background: preview.status === 'published' ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.04)',
                      borderColor: preview.status === 'published' ? 'rgba(16,185,129,0.25)' : BORDER,
                      color: preview.status === 'published' ? '#10B981' : MUTED,
                    }}
                  >
                    {preview.status}
                  </span>
                </div>
                <Button asChild variant="outline" size="sm" className={cn(rowButton, 'gap-1.5')}>
                  <Link href={`/blog/${preview.slug}`} target="_blank"><ExternalLink size={12} /> Open public page</Link>
                </Button>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto" style={{ color: '#EDEDEF' }}>
                {preview.coverImage && (
                  <div className="h-[240px] w-full overflow-hidden">
                    <img src={preview.coverImage} alt={preview.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="max-w-[1220px] mx-auto px-8 pt-12 pb-16">
                  <div className="grid gap-12 lg:grid-cols-[200px_minmax(0,1fr)]">
                    <Toc content={preview.content ?? ''} className="hidden lg:block" />
                    <div className="min-w-0">
                      <h1 className="mb-[14px]" style={{ fontFamily: heading, fontSize: 'clamp(28px, 4vw, 52px)', lineHeight: 1.08, letterSpacing: '-0.035em', fontWeight: 600, color: '#EDEDEF', margin: '0 0 14px' }}>
                        {preview.title}
                      </h1>

                      <div className="flex flex-wrap items-center gap-3 mb-5 text-[12px]" style={{ fontFamily: mono, color: MUTED }}>
                        {preview.publishedAt && <span>{new Date(preview.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>}
                        {preview.readTime > 0 && <span>{preview.readTime} min read</span>}
                      </div>

                      {preview.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {preview.tags.map((t) => (
                            <Badge key={t} variant="outline" className="border-border bg-white/[0.04] px-[9px] py-[3px] font-mono text-[10.5px] font-normal text-[#A1A1AA]">{t}</Badge>
                          ))}
                        </div>
                      )}

                      {preview.excerpt && (
                        <p className="text-[17px] leading-[1.7] mb-[28px]" style={{ color: '#A1A1AA' }}>{preview.excerpt}</p>
                      )}

                      {preview.content && <Prose>{preview.content}</Prose>}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
