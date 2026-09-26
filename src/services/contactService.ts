'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { QueryKeys } from '../lib/queryKeys';
import { ApiUrls } from '../lib/apiUrls';
import { api, type ApiResponse } from '../lib/apiClient';
import type { ContactLink } from '../types/contact';

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const useContactLinks = () =>
  useQuery({
    queryKey: [QueryKeys.CONTACT_LINKS],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<ContactLink[]>>(ApiUrls.CONTACT_LINKS);
      return data.data;
    },
  });

export const useSubmitContact = () =>
  useMutation({
    mutationFn: async (form: ContactFormData) => {
      const { data } = await api.post<ApiResponse<unknown>>(ApiUrls.CONTACT_SUBMIT, form);
      return data;
    },
  });
