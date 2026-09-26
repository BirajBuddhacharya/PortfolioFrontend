'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '../lib/queryKeys';
import { ApiUrls } from '../lib/apiUrls';
import { api, type ApiResponse } from '../lib/apiClient';
import type {
  ResumeGrouped,
  ResumeItemFull,
  CreateResumeItemPayload,
  UpdateResumeItemPayload,
} from '../types/resume';

export const useResume = () =>
  useQuery({
    queryKey: [QueryKeys.RESUME],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<ResumeGrouped>>(ApiUrls.RESUME);
      return data.data;
    },
  });

const toRow = (e: { title: string; period: string | null; organization: string | null; body: string | null }) => ({
  title: e.title,
  meta: [e.organization, e.period].filter(Boolean).join(' · '),
  body: e.body ?? '',
});

// Page-shaped view for /resume — grouped blocks with a flat "meta" string.
export const useResumeView = () =>
  useQuery({
    queryKey: [QueryKeys.RESUME],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<ResumeGrouped>>(ApiUrls.RESUME);
      return data.data;
    },
    select: (r: ResumeGrouped) => [
      { label: 'Experience', rows: r.experiences.map(toRow) },
      { label: 'Education', rows: r.education.map(toRow) },
      { label: 'Certifications', rows: r.certifications.map(toRow) },
      { label: 'Skills', rows: r.skills.map((s) => ({ title: s.title, meta: '', body: s.body ?? '' })) },
    ],
  });

// Admin: flat list of resume items (includes section, for the row editors).
export const useAdminResumeItems = () =>
  useQuery({
    queryKey: [QueryKeys.RESUME_ITEMS],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ result: ResumeItemFull[]; total: number }>>(
        ApiUrls.RESUME_ITEMS,
      );
      return data.data.result;
    },
  });

export const useCreateResumeItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateResumeItemPayload) => {
      const { data } = await api.post<ApiResponse<ResumeItemFull>>(ApiUrls.RESUME_ITEMS, payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.RESUME_ITEMS] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.RESUME] });
    },
  });
};

export const useUpdateResumeItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdateResumeItemPayload & { id: string }) => {
      const { data } = await api.patch<ApiResponse<ResumeItemFull>>(
        ApiUrls.RESUME_ITEM_DETAIL.replace(':id', id),
        payload,
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.RESUME_ITEMS] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.RESUME] });
    },
  });
};

export const useDeleteResumeItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(ApiUrls.RESUME_ITEM_DETAIL.replace(':id', id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.RESUME_ITEMS] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.RESUME] });
    },
  });
};
