'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiUrls } from '../lib/apiUrls';
import { QueryKeys } from '../lib/queryKeys';
import { api, type ApiResponse } from '../lib/apiClient';

export interface GalleryEntry {
  id: string;
  publicId: string;
  url: string;
  format: string;
  type: string;
  alt?: string | null;
  folder?: string | null;
  bytes?: number | null;
  width?: number | null;
  height?: number | null;
  createdAt: string;
}

export const useUploadImage = () =>
  useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData();
      form.append('file', file);
      const { data } = await api.post<ApiResponse<GalleryEntry>>(ApiUrls.UPLOAD_IMAGE, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.data;
    },
  });

export const useUploadPdf = () =>
  useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData();
      form.append('file', file);
      const { data } = await api.post<ApiResponse<GalleryEntry>>(ApiUrls.UPLOAD_PDF, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.data;
    },
  });

export const useGallery = (type?: string) =>
  useQuery({
    queryKey: [QueryKeys.GALLERY, type],
    queryFn: async () => {
      const url = type ? `${ApiUrls.GALLERY}?type=${type}` : ApiUrls.GALLERY;
      const { data } = await api.get<ApiResponse<GalleryEntry[]>>(url);
      return data.data;
    },
  });

export const useDeleteGalleryItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(ApiUrls.GALLERY_ITEM.replace(':id', id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.GALLERY] });
    },
  });
};
