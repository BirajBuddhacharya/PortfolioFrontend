import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';
import {
  clearToken,
  getRefreshToken,
  getToken,
  setTokens,
} from './authToken';

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

/**
 * The single axios instance for every HTTP call in the app — never use
 * `axios.get`/`fetch` directly. It attaches the bearer token, refreshes an
 * expired session once, toasts failures and bounces rejected sessions back to
 * the login page.
 */
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token available');

  const { data } = await axios.post<
    ApiResponse<{ accessToken: string; refreshToken: string }>
  >(`${api.defaults.baseURL}/auth/refresh`, { refreshToken });

  setTokens(data.data);
  return data.data.accessToken;
}

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const original = error.config as RetryConfig | undefined;
    const isAuthEndpoint =
      original?.url?.includes('/auth/login') ||
      original?.url?.includes('/auth/refresh');

    if (status === 401 && original && !original._retry && !isAuthEndpoint) {
      original._retry = true;
      try {
        refreshPromise ??= refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
        const token = await refreshPromise;
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      } catch {
        // fall through, clear the dead session and redirect below
      }
    }

    // backend rejected the token — drop it so the middleware keeps /admin gated
    if (status === 401 || status === 403) {
      clearToken();
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }

    toast.error(apiErrorMessage(error));
    return Promise.reject(error);
  },
);

/** Backend errors come back as `{ message }` — surface that, fall back to a generic line. */
export function apiErrorMessage(error: unknown): string {
  const message = (error as AxiosError<{ message?: string | string[] }>)?.response?.data?.message;
  if (Array.isArray(message)) return message.join(', ');
  if (message) return message;
  return (error as AxiosError)?.response ? 'Something went wrong' : 'Cannot reach the server';
}

/** Backend wraps every payload as `{ data, message }`. */
export type ApiResponse<T> = { data: T; message?: string };
