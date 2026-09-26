export interface BlogPost {
  id: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  tags: string[];
  status: string; // draft | published
  coverImage: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  readTime: number;
}

export interface CreateBlogPostPayload {
  title: string;
  excerpt?: string;
  content?: string;
  tags?: string[];
  status?: 'draft' | 'published';
  coverImage?: string;
  publishedAt?: string;
}

export type UpdateBlogPostPayload = Partial<CreateBlogPostPayload>;
