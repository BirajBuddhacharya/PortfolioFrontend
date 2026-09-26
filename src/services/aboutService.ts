'use client';

import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from '../lib/queryKeys';
import { ApiUrls } from '../lib/apiUrls';
import { api, type ApiResponse } from '../lib/apiClient';
import type { Profile } from '../types/profile';
import type { ResumeGrouped } from '../types/resume';

const fetchProfile = async () => {
  const { data } = await api.get<ApiResponse<Profile>>(ApiUrls.PROFILE);
  return data.data;
};

const fetchResume = async () => {
  const { data } = await api.get<ApiResponse<ResumeGrouped>>(ApiUrls.RESUME);
  return data.data;
};

export const useProfile = () =>
  useQuery({ queryKey: [QueryKeys.PROFILE], queryFn: fetchProfile });

export const useAboutProfile = () =>
  useQuery({
    queryKey: [QueryKeys.PROFILE],
    queryFn: fetchProfile,
    select: (p: Profile) => ({ headline: p.headline, coverImage: p.coverImage }),
  });

export const useAbout = () =>
  useQuery({
    queryKey: [QueryKeys.PROFILE],
    queryFn: fetchProfile,
    select: (p: Profile) => p.paragraphs,
  });

export const useAboutFacts = () =>
  useQuery({
    queryKey: [QueryKeys.PROFILE],
    queryFn: fetchProfile,
    select: (p: Profile) => p.facts,
  });

// education + certifications are edited in the admin Resume tab
export const useAboutEducation = () =>
  useQuery({
    queryKey: [QueryKeys.RESUME],
    queryFn: fetchResume,
    select: (r: ResumeGrouped) =>
      [...r.education, ...r.certifications].map((e) => ({
        period: e.period ?? '',
        title: e.title,
        place: e.organization ?? '',
      })),
  });
