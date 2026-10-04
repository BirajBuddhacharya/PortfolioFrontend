import type { Tag } from './tag';
import { ProjectStatus } from '../services/common/enum/ProjectStatus';

export { ProjectStatus };
export type { Tag };

export interface Project {
  id: string;
  slug: string;
  title: string;
  blurb?: string | null;
  summary?: string | null;
  /** Markdown body rendered on the detail page. */
  content?: string | null;
  year?: string | null;
  status: ProjectStatus;
  tags: Tag[];
  gallery: string[];
  metrics: { value: string; label: string }[];
  live?: string | null;
  repo?: string | null;
  coverImage?: string | null;
  coverHeight: number;
  coverAccent: string;
  coverColor: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateProjectPayload = {
  title: string;
  slug: string;
  blurb?: string;
  summary?: string;
  content?: string;
  year?: string;
  status?: ProjectStatus;
  tagIds?: string[];
  gallery?: string[];
  metrics?: { value: string; label: string }[];
  live?: string;
  repo?: string;
  coverImage?: string;
  coverHeight?: number;
  coverAccent?: string;
  coverColor?: string;
};

export type UpdateProjectPayload = Partial<CreateProjectPayload>;
