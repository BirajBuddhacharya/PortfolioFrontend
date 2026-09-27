'use client';

import { useState } from 'react';
import { Pencil } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/components/ui/button';
import { Badge } from '@/components/components/ui/badge';
import { Input } from '@/components/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/components/ui/table';
import { useAdminPosts, useDeletePost, useUpdatePost } from '../../../../services/adminService';
import { BORDER, TEXT, MUTED, mono, formField, newButton, tableHead, rowButton, SectionLabel, StatusSelect, ConfirmDelete } from '../../../../components/admin/adminUi';
import { cn } from '@/components/lib/utils';

const BLOG_STATUSES = ['draft', 'published'];

export default function AdminPostsPage() {
  const { data: posts = [] } = useAdminPosts();
  const deletePost = useDeletePost();
  const updatePost = useUpdatePost();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = posts.filter((p) => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

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
            {filtered.length === 0 && (
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
            {filtered.map((p) => (
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
                <TableCell className="px-5 py-[14px]">
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="xs" className={cn(rowButton, 'px-2')}>
                      <Link href={`/admin/blogs/${p.id}/edit`}><Pencil size={13} /></Link>
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
    </div>
  );
}
