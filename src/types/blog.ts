import type { Tag } from './tag';
import { BlogStatus } from '../common/enums/blog-status.enum';

export { BlogStatus };
export type { Tag };

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  tags: Tag[];
  status: BlogStatus;
  coverImage: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  readTime: number;
}

export interface CreateBlogPostPayload {
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  tagIds?: string[];
  status?: BlogStatus;
  coverImage?: string;
  publishedAt?: string;
}

export type UpdateBlogPostPayload = Partial<CreateBlogPostPayload>;
