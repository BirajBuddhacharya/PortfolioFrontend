'use client';

import Link from 'next/link';
import { Button } from '@/components/components/ui/button';
import { Badge } from '@/components/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/components/ui/table';
import { useAdminPosts, useDeletePost } from '../../../../services/adminService';
import { BORDER, TEXT, MUTED, mono, newButton, tableHead, rowButton, SectionLabel, StatusBadge, ConfirmDelete } from '../../../../components/admin/adminUi';

export default function AdminPostsPage() {
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
