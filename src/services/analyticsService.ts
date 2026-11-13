'use client';

import { useQuery } from '@tanstack/react-query';
import { api, type ApiResponse } from '../lib/apiClient';
import { ApiUrls } from '../lib/apiUrls';
import { QueryKeys } from '../lib/queryKeys';
import type {
  GaPerformanceResponse,
  GaRange,
  GaRequestsResponse,
  GaVisitorsResponse,
} from '../types/analytics';

const queryString = (range: GaRange) =>
  new URLSearchParams({
    startDate: range.startDate,
    endDate: range.endDate,
    granularity: range.granularity,
  }).toString();

export const useGaRequests = (range: GaRange) =>
  useQuery({
    queryKey: [
      QueryKeys.GA_REQUESTS,
      range.startDate,
      range.endDate,
      range.granularity,
    ],
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<GaRequestsResponse>>(
        `${ApiUrls.GA_REQUESTS}?${queryString(range)}`,
      );
      return data.data;
    },
  });

export const useGaVisitors = (range: GaRange) =>
  useQuery({
    queryKey: [
      QueryKeys.GA_VISITORS,
      range.startDate,
      range.endDate,
      range.granularity,
    ],
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<GaVisitorsResponse>>(
        `${ApiUrls.GA_VISITORS}?${queryString(range)}`,
      );
      return data.data;
    },
  });

export const useGaPerformance = (range: GaRange) =>
  useQuery({
    queryKey: [
      QueryKeys.GA_PERFORMANCE,
      range.startDate,
      range.endDate,
      range.granularity,
    ],
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<GaPerformanceResponse>>(
        `${ApiUrls.GA_PERFORMANCE}?${queryString(range)}`,
      );
      return data.data;
    },
  });
