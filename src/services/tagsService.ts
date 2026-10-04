'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '../lib/queryKeys';
import { ApiUrls } from '../lib/apiUrls';
import { api, type ApiResponse } from '../lib/apiClient';
import type { Tag } from '../types/tag';

export const useTags = () =>
  useQuery({
    queryKey: [QueryKeys.TAGS],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Tag[]>>(ApiUrls.TAGS);
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
  });

export const useCreateTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { name: string; color?: string }) => {
      const { data } = await api.post<ApiResponse<Tag>>(ApiUrls.TAGS, payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.TAGS] });
    },
  });
};

export const useDeleteTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(ApiUrls.TAG_DETAIL.replace(':id', id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.TAGS] });
    },
  });
};
