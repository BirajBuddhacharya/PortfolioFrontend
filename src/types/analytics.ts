export type GaGranularity = 'hour' | 'day';

export interface GaRange {
  startDate: string;
  endDate: string;
  granularity: GaGranularity;
}

export interface GaMetric {
  value: number;
  delta: number | null;
}

export interface GaTimeseriesPoint {
  date: string;
  hour: string | null;
  label: string;
}

export interface GaRequestPoint extends GaTimeseriesPoint {
  requests: number;
  pageviews: number;
  visits: number;
}

export interface GaVisitorPoint extends GaTimeseriesPoint {
  pageviews: number;
  visits: number;
  users: number;
}

export interface GaPerformancePoint extends GaTimeseriesPoint {
  avgEngagementTime: number;
  engagementRate: number;
  bounceRate: number;
  sessions: number;
}

export interface GaRequestsResponse {
  range: GaRange;
  summary: {
    requests: GaMetric;
    pageviews: GaMetric;
    visits: GaMetric;
  };
  timeseries: GaRequestPoint[];
  byPage: { path: string; requests: number; pageviews: number }[];
  bySource: { source: string; visits: number }[];
  byDevice: { device: string; visits: number }[];
}

export interface GaVisitorsResponse {
  range: GaRange;
  summary: {
    pageviews: GaMetric;
    visits: GaMetric;
    users: GaMetric;
    newUsers: GaMetric;
  };
  timeseries: GaVisitorPoint[];
  countries: { country: string; users: number; pageviews: number }[];
  topPages: { path: string; pageviews: number; users: number }[];
  devices: { device: string; users: number }[];
}

export interface GaPerformanceResponse {
  range: GaRange;
  summary: {
    avgEngagementTime: GaMetric;
    engagementRate: GaMetric;
    bounceRate: GaMetric;
    sessions: GaMetric;
  };
  timeseries: GaPerformancePoint[];
  byPage: {
    path: string;
    avgEngagementTime: number;
    engagementRate: number;
    pageviews: number;
  }[];
  byDevice: {
    device: string;
    avgEngagementTime: number;
    engagementRate: number;
    visits: number;
  }[];
}
