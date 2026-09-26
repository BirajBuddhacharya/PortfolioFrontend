'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PostForm } from '../../../../../components/admin/PostForm';
import { useAdminPostDetail, useUpdatePost } from '../../../../../services/adminService';

const mono = 'var(--font-jetbrains-mono), monospace';

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: post, isLoading, isError } = useAdminPostDetail(id);
  const updatePost = useUpdatePost();

  const notFound = isError || (!isLoading && !post);

  return (
    <div style={{ background: '#09090B', color: '#EDEDEF', minHeight: '100vh' }}>
      <main className="mx-auto max-w-[1080px] px-7 pb-12">
        {isLoading && (
          <div className="pt-12 text-[13px]" style={{ fontFamily: mono, color: '#6E6E78' }}>Loading…</div>
        )}

        {notFound && (
          <div className="flex flex-col gap-3 pt-12">
            <p style={{ color: '#8A8A93' }}>Post not found.</p>
            <Link href="/admin?tab=posts" style={{ color: '#FF6B6B', fontFamily: mono, fontSize: 13 }}>
              ← back to posts
            </Link>
          </div>
        )}

        {post && (
          <PostForm
            post={post}
            saving={updatePost.isPending}
            onSave={(data) =>
              updatePost.mutate(
                { id, ...data },
                { onSuccess: () => router.push('/admin?tab=posts') },
              )
            }
          />
        )}
      </main>
    </div>
  );
}
