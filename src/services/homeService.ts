'use client';

import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from '../lib/queryKeys';
import { ApiUrls } from '../lib/apiUrls';
import { api, type ApiResponse } from '../lib/apiClient';
import type { Profile } from '../types/profile';
import type { ResumeGrouped } from '../types/resume';
import type { BlogPost } from '../types/blog';
import { useProjects } from './projectsService';

const fetchProfile = async () => {
  const { data } = await api.get<ApiResponse<Profile>>(ApiUrls.PROFILE);
  return data.data;
};

const fetchResume = async () => {
  const { data } = await api.get<ApiResponse<ResumeGrouped>>(ApiUrls.RESUME);
  return data.data;
};

export const useHomeStats = () =>
  useQuery({
    queryKey: [QueryKeys.PROFILE],
    queryFn: fetchProfile,
    select: (p: Profile) => p.stats,
  });

export const useHomeTicker = () =>
  useQuery({
    queryKey: [QueryKeys.PROFILE],
    queryFn: fetchProfile,
    select: (p: Profile) => p.ticker,
  });

export const useHomeFeaturedProjects = () => {
  const query = useProjects();
  return {
    ...query,
    data: (query.data ?? []).filter((p) => p.status === 'live').slice(0, 3),
  };
};

export const useHomeExperience = () =>
  useQuery({
    queryKey: [QueryKeys.RESUME],
    queryFn: fetchResume,
    select: (r: ResumeGrouped) =>
      r.experiences.map((e) => ({
        period: e.period ?? '',
        location: e.location ?? '',
        role: e.title,
        company: e.organization ?? '',
        points: e.points,
      })),
  });

export const useHomeSkills = () =>
  useQuery({
    queryKey: [QueryKeys.RESUME],
    queryFn: fetchResume,
    select: (r: ResumeGrouped) =>
      r.skills.map((s) => ({ name: s.title, items: (s.body ?? '').split(',').map((x) => x.trim()).filter(Boolean) })),
  });

export const useHomeBlogPreview = () =>
  useQuery({
    queryKey: [QueryKeys.BLOG_POSTS],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ result: BlogPost[]; total: number }>>(ApiUrls.BLOG_POSTS);
      return data.data.result;
    },
    select: (posts: BlogPost[]) =>
      posts.slice(0, 3).map((p) => ({
        id: p.id,
        title: p.title,
        date: p.publishedAt
          ? new Date(p.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : '',
        readTime: `${p.readTime} min`,
      })),
  });
