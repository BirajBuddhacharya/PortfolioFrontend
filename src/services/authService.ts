'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, type ApiResponse } from '../lib/apiClient';
import { ApiUrls } from '../lib/apiUrls';
import { QueryKeys } from '../lib/queryKeys';
import {
  clearToken,
  getRefreshToken,
  getToken,
  setTokens,
} from '../lib/authToken';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AdminUser {
  id: number;
  email: string;
  name?: string;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export const useAdminLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await api.post<ApiResponse<TokenPair & { user: AdminUser }>>(
        ApiUrls.AUTH_LOGIN,
        credentials,
      );
      setTokens(data.data);
      return data.data;
    },
    onSuccess: (result) => {
      queryClient.setQueryData([QueryKeys.AUTH_ME], result.user);
    },
  });
};

export const useAdminMe = () =>
  useQuery({
    queryKey: [QueryKeys.AUTH_ME],
    enabled: !!getToken() || !!getRefreshToken(),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<AdminUser>>(ApiUrls.AUTH_ME);
      return data.data;
    },
  });

export const useAdminLogout = () => {
  const queryClient = useQueryClient();
  return async () => {
    try {
      // Bumps the user's tokenVersion server-side; clearing the cookie alone
      // leaves the JWT valid until it expires.
      await api.post(ApiUrls.AUTH_LOGOUT);
    } catch {
      // The local session must still be cleared if the network call fails.
    } finally {
      clearToken();
      queryClient.clear();
    }
  };
};
