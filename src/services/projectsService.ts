'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '../lib/queryKeys';
import { ApiUrls } from '../lib/apiUrls';
import { api, type ApiResponse } from '../lib/apiClient';
import type { Project, CreateProjectPayload, UpdateProjectPayload } from '../types/project';

export const useProjects = () =>
  useQuery({
    queryKey: [QueryKeys.PROJECTS_LIST],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<{ result: Project[]; total: number }>>(ApiUrls.PROJECTS_LIST);
      return data.data.result;
    },
  });

export const useProjectDetail = (id: string) =>
  useQuery({
    queryKey: [QueryKeys.PROJECT_DETAIL, id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Project>>(
        ApiUrls.PROJECT_DETAIL.replace(':id', id),
      );
      return data.data;
    },
    enabled: !!id,
  });

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateProjectPayload) => {
      const { data } = await api.post<ApiResponse<Project>>(ApiUrls.PROJECTS_LIST, payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PROJECTS_LIST] });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdateProjectPayload & { id: string }) => {
      const { data } = await api.patch<ApiResponse<Project>>(
        ApiUrls.PROJECT_DETAIL.replace(':id', id),
        payload,
      );
      return data.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PROJECTS_LIST] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PROJECT_DETAIL, id] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(ApiUrls.PROJECT_DETAIL.replace(':id', id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PROJECTS_LIST] });
    },
  });
};
