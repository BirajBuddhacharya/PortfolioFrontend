'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '../lib/queryKeys';
import { ApiUrls } from '../lib/apiUrls';
import { api, type ApiResponse } from '../lib/apiClient';
import type { Project } from '../types/project';
import type { BlogPost, CreateBlogPostPayload, UpdateBlogPostPayload } from '../types/blog';
import type { Profile, UpdateProfilePayload } from '../types/profile';
import type { ContactMessage, ContactLink, CreateContactLinkPayload, UpdateContactLinkPayload } from '../types/contact';
import { useProfile } from './aboutService';
import { useResume } from './resumeService';

export {
  useCreateResumeItem,
  useUpdateResumeItem,
  useDeleteResumeItem,
} from './resumeService';

// ── Resume (grouped, same query as the public /resume page — items carry ids) ─

export const useAdminResume = () => useResume();

// ── Dashboard ──────────────────────────────────────────────────────────────

interface DashboardOverview {
  totalPosts: number;
  publishedPosts: number;
  totalProjects: number;
  liveProjects: number;
  totalMessages: number;
  unreadMessages: number;
}

interface DashboardSnapshot {
  chartBars: number[];
  topPages: { path: string; views: number; pct: number }[];
  activity: { text: string; time: string }[];
}

const fetchSnapshot = async () => {
  const { data } = await api.get<ApiResponse<DashboardSnapshot>>(ApiUrls.DASHBOARD_SNAPSHOT);
  return data.data;
};

export const useAdminOverview = () =>
  useQuery({
    queryKey: [QueryKeys.DASHBOARD_OVERVIEW],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<DashboardOverview>>(ApiUrls.DASHBOARD_OVERVIEW);
      return data.data;
    },
    select: (o: DashboardOverview) => [
      { label: 'Total posts', value: String(o.totalPosts), delta: `${o.publishedPosts} published` },
      { label: 'Projects', value: String(o.totalProjects), delta: `${o.liveProjects} live` },
      { label: 'Messages', value: String(o.totalMessages), delta: `${o.unreadMessages} unread` },
    ],
  });

export const useAdminChart = () =>
  useQuery({
    queryKey: [QueryKeys.DASHBOARD_SNAPSHOT],
    queryFn: fetchSnapshot,
    select: (s: DashboardSnapshot) => s.chartBars,
  });

export const useAdminTopPages = () =>
  useQuery({
    queryKey: [QueryKeys.DASHBOARD_SNAPSHOT],
    queryFn: fetchSnapshot,
    select: (s: DashboardSnapshot) => s.topPages,
  });

export const useAdminActivity = () =>
  useQuery({
    queryKey: [QueryKeys.DASHBOARD_SNAPSHOT],
    queryFn: fetchSnapshot,
    select: (s: DashboardSnapshot) => s.activity,
  });

// ── Inbox (Contact messages) ────────────────────────────────────────────────

const relativeTime = (iso: string) => {
  const min = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  return `${Math.floor(hr / 24)}d ago`;
};

const toInboxMsg = (m: ContactMessage) => ({
  id: m.id,
  name: m.name,
  email: m.email,
  subject: m.subject,
  body: m.message,
  time: relativeTime(m.createdAt),
  read: m.status === 'READ',
});

export const useAdminInbox = () =>
  useQuery({
    queryKey: [QueryKeys.CONTACT_INBOX],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ result: ContactMessage[]; total: number }>>(ApiUrls.CONTACT_INBOX);
      return data.data.result.map(toInboxMsg);
    },
  });

export const useMarkMessageRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.patch(ApiUrls.CONTACT_MESSAGE_DETAIL.replace(':id', String(id)), { status: 'READ' });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QueryKeys.CONTACT_INBOX] }),
  });
};

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(ApiUrls.CONTACT_MESSAGE_DETAIL.replace(':id', String(id)));
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QueryKeys.CONTACT_INBOX] }),
  });
};

// ── Projects (already real — untouched) ─────────────────────────────────────

export const useAdminProjects = () =>
  useQuery({
    queryKey: [QueryKeys.PROJECTS_LIST],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ result: Project[]; total: number }>>(ApiUrls.PROJECTS_LIST);
      return data.data.result;
    },
  });

// ── Posts (Blog) ─────────────────────────────────────────────────────────────

/** Every admin post, drafts included. Shared cache — callers narrow it with `select`. */
const fetchAdminPosts = async () => {
  const { data } = await api.get<ApiResponse<{ result: BlogPost[]; total: number }>>(ApiUrls.BLOG_ADMIN);
  return data.data.result;
};

export const useAdminPosts = () =>
  useQuery({
    queryKey: [QueryKeys.BLOG_ADMIN],
    queryFn: fetchAdminPosts,
    select: (posts: BlogPost[]) =>
      posts.map((p) => ({
        id: p.id,
        title: p.title,
        excerpt: p.excerpt,
        content: p.content,
        tags: p.tags,
        date: p.publishedAt ?? p.createdAt,
        status: p.status,
        coverImage: p.coverImage,
      })),
  });

/**
 * Single post for the admin editor. Reads from the admin list rather than
 * `GET /blog/:id`, which 404s on drafts.
 */
export const useAdminPostDetail = (id: string) =>
  useQuery({
    queryKey: [QueryKeys.BLOG_ADMIN],
    queryFn: fetchAdminPosts,
    enabled: !!id,
    select: (posts: BlogPost[]) => posts.find((p) => p.id === id),
  });

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateBlogPostPayload) => {
      const { data } = await api.post<ApiResponse<BlogPost>>(ApiUrls.BLOG_POSTS, payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.BLOG_POSTS] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.BLOG_ADMIN] });
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdateBlogPostPayload & { id: string }) => {
      const { data } = await api.patch<ApiResponse<BlogPost>>(ApiUrls.BLOG_POST_DETAIL.replace(':id', id), payload);
      return data.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.BLOG_POSTS] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.BLOG_ADMIN] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.BLOG_POST_DETAIL, id] });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(ApiUrls.BLOG_POST_DETAIL.replace(':id', id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.BLOG_POSTS] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.BLOG_ADMIN] });
    },
  });
};

// ── About (Profile) ──────────────────────────────────────────────────────────

export const useAdminAbout = () => useProfile();

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateProfilePayload) => {
      const { data } = await api.patch<ApiResponse<Profile>>(ApiUrls.PROFILE, payload);
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QueryKeys.PROFILE] }),
  });
};

// ── Users (self) ─────────────────────────────────────────────────────────────

export const useUpdateMe = () =>
  useMutation({
    mutationFn: async (payload: { name?: string }) => {
      const { data } = await api.patch<ApiResponse<unknown>>(ApiUrls.USERS_ME, payload);
      return data.data;
    },
  });

// ── Contact links (no admin UI wired yet — hooks exported for when it is) ────

export const useCreateContactLink = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateContactLinkPayload) => {
      const { data } = await api.post<ApiResponse<ContactLink>>(ApiUrls.CONTACT_LINKS, payload);
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QueryKeys.CONTACT_LINKS] }),
  });
};

export const useUpdateContactLink = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdateContactLinkPayload & { id: string }) => {
      const { data } = await api.patch<ApiResponse<ContactLink>>(
        ApiUrls.CONTACT_LINK_DETAIL.replace(':id', id),
        payload,
      );
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QueryKeys.CONTACT_LINKS] }),
  });
};

export const useDeleteContactLink = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(ApiUrls.CONTACT_LINK_DETAIL.replace(':id', id));
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QueryKeys.CONTACT_LINKS] }),
  });
};
