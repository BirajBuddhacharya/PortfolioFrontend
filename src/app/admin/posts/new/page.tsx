'use client';

import { useRouter } from 'next/navigation';
import { PostForm } from '../../../../components/admin/PostForm';
import { useCreatePost } from '../../../../services/adminService';

export default function NewPostPage() {
  const router = useRouter();
  const createPost = useCreatePost();

  return (
    <div style={{ background: '#09090B', color: '#EDEDEF', minHeight: '100vh' }}>
      <main className="mx-auto max-w-[1080px] px-7 pb-12">
        <PostForm
          saving={createPost.isPending}
          onSave={(data) =>
            createPost.mutate(data, {
              onSuccess: () => router.push('/admin?tab=posts'),
            })
          }
        />
      </main>
    </div>
  );
}
