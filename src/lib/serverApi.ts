import 'server-only';

import type { Project } from '../types/project';
import type { BlogPost } from '../types/blog';
import type { Profile } from '../types/profile';
import type { ResumeGrouped } from '../types/resume';
import type { ContactLink } from '../types/contact';

/**
 * Server-side data access for public pages.
 *
 * Deliberately uses `fetch` rather than `src/lib/apiClient.ts` — that axios
 * instance is browser-only (it reads the auth cookie and hard-redirects to
 * /admin/login on 401), none of which can run during a server render.
 *
 * `API_BASE_URL` lets deployments point server renders at an internal address
 * while the browser keeps using the public one.
 */
const BASE = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

/** How long a public page may serve cached backend data, in seconds. */
export const REVALIDATE = 60;

type Envelope<T> = { data: T; message?: string };
type Paginated<T> = { result: T[]; total: number };

async function get<T>(path: string): Promise<T | null> {
  if (!BASE) return null;
  try {
    const res = await fetch(`${BASE}${path}`, { next: { revalidate: REVALIDATE } });
    if (!res.ok) return null;
    const json = (await res.json()) as Envelope<T>;
    return json.data ?? null;
  } catch {
    // Backend unreachable — let the page render its empty state rather than
    // failing the whole request.
    return null;
  }
}

const list = async <T>(path: string): Promise<T[]> =>
  (await get<Paginated<T>>(path))?.result ?? [];

export const getProjects = () => list<Project>('/projects');
export const getProject = (id: string) => get<Project>(`/projects/${id}`);

export const getPosts = () => list<BlogPost>('/blog');
export const getPost = (id: string) => get<BlogPost>(`/blog/${id}`);
export const getBlogTags = async () => (await get<string[]>('/blog/tags')) ?? [];

export const getProfile = () => get<Profile>('/profile');
export const getResume = () => get<ResumeGrouped>('/resume');
export const getContactLinks = async () => (await get<ContactLink[]>('/contact/links')) ?? [];
