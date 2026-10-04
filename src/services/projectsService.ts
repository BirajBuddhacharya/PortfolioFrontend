"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "../lib/queryKeys";
import { ApiUrls } from "../lib/apiUrls";
import { api, type ApiResponse } from "../lib/apiClient";
import type {
  Project,
  CreateProjectPayload,
  UpdateProjectPayload,
} from "../types/project";

export const usePublicProjects = () =>
  useQuery({
    queryKey: [QueryKeys.PUBLIC_PROJECTS_LIST],
    queryFn: async () => {
      const { data } = await api.get<
        ApiResponse<{ result: Project[]; total: number }>
      >(ApiUrls.PUBLIC_PROJECTS_LIST);
      return data.data.result;
    },
  });

export const usePublicProjectsByTag = (tagId: string | null) =>
  useQuery({
    queryKey: [QueryKeys.PUBLIC_PROJECTS_LIST, { tagId }],
    queryFn: async () => {
      const { data } = await api.get<
        ApiResponse<{ result: Project[]; total: number }>
      >(`${ApiUrls.PUBLIC_PROJECTS_LIST}?tagId=${tagId}`);
      return data.data.result;
    },
    enabled: !!tagId,
  });

export const usePublicProjectDetail = (id: string) =>
  useQuery({
    queryKey: [QueryKeys.PUBLIC_PROJECT_DETAIL, id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Project>>(
        ApiUrls.PUBLIC_PROJECT_DETAIL.replace(":id", id),
      );
      return data.data;
    },
    enabled: !!id,
  });

interface AdminProjectsParams {
  search?: string;
  status?: string;
  page?: number;
  size?: number;
}

export const useProjects = (params: AdminProjectsParams = {}) => {
  const { search = '', status = 'all', page = 1, size = 10 } = params;
  return useQuery({
    queryKey: [QueryKeys.PROJECTS_LIST, { search, status, page, size }],
    queryFn: async () => {
      const q = new URLSearchParams({ pagination: 'true', page: String(page), size: String(size) });
      if (search) q.set('search', search);
      if (status && status !== 'all') q.set('status', status);
      const { data } = await api.get<ApiResponse<{ result: Project[]; total: number }>>(
        `${ApiUrls.PROJECTS_LIST}?${q}`,
      );
      return data.data;
    },
  });
};

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
      const { data } = await api.post<ApiResponse<Project>>(
        ApiUrls.PROJECTS_LIST,
        payload,
      );
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
    mutationFn: async ({
      id,
      ...payload
    }: UpdateProjectPayload & { id: string }) => {
      const { data } = await api.patch<ApiResponse<Project>>(
        ApiUrls.PROJECT_DETAIL.replace(":id", id),
        payload,
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PROJECTS_LIST] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PROJECT_DETAIL] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(ApiUrls.PROJECT_DETAIL.replace(":id", id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PROJECTS_LIST] });
    },
  });
};
