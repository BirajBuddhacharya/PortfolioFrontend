'use client';

import { Suspense, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/components/ui/tabs';
import { apiErrorMessage } from '../../../../lib/apiClient';
import {
  useGaPerformance,
  useGaRequests,
  useGaVisitors,
} from '../../../../services/analyticsService';
import type { GaRange } from '../../../../types/analytics';
import {
  AnalyticsError,
  ChartCard,
  ChartLegend,
  CHART_COLORS,
  DataTable,
  formatCount,
  formatDuration,
  formatPercent,
  LineChartPanel,
  RankedList,
  StatCard,
} from '../../../../components/admin/analyticsCharts';
import { AnalyticsSkeleton } from '../../../../components/admin/analyticsSkeleton';
import { VisitorsMapCard } from '../../../../components/admin/VisitorsMapCard';
import {
  AnalyticsTimeFilter,
  useAnalyticsRange,
} from '../../../../components/admin/AnalyticsTimeFilter';
import { BORDER, MUTED, mono } from '../../../../components/admin/adminUi';

const tabTrigger =
  'h-auto flex-none rounded-none border-0 px-0 pb-3 pt-1 text-[13px] font-normal ' +
  'text-[#6E6E78] data-[state=active]:text-[#EDEDEF] hover:text-[#EDEDEF] ' +
  'data-[state=active]:after:bg-[#FF6B6B]';

const ANALYTICS_TABS = ['requests', 'visitors', 'performance'] as const;
type AnalyticsTab = (typeof ANALYTICS_TABS)[number];

function isAnalyticsTab(value: string | null): value is AnalyticsTab {
  return ANALYTICS_TABS.includes(value as AnalyticsTab);
}

export default function AdminAnalyticsPage() {
  return (
    <Suspense fallback={<AnalyticsPageFallback />}>
      <AnalyticsDashboard />
    </Suspense>
  );
}

function AnalyticsPageFallback() {
  return (
    <div className="max-w-[1280px]">
      <AnalyticsSkeleton stats={3} charts={1} lists={3} />
    </div>
  );
}

function AnalyticsDashboard() {
  const filter = useAnalyticsRange();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const queryTab = searchParams?.get('activeTab') ?? null;
  const activeTab: AnalyticsTab = isAnalyticsTab(queryTab)
    ? queryTab
    : 'requests';

  const handleTabChange = useCallback(
    (value: string) => {
      if (!isAnalyticsTab(value)) return;

      const params = new URLSearchParams(searchParams?.toString() ?? '');
      params.set('activeTab', value);

      // Soft navigation: update the URL without a full page reload so the
      // selected tab survives refreshes and can be shared as a link.
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  return (
    <div className="max-w-[1280px]">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="gap-5">
        <div
          className="flex flex-wrap items-end justify-between gap-4 border-b pb-3"
          style={{ borderColor: BORDER }}
        >
          <TabsList
            variant="line"
            className="h-auto w-auto justify-start gap-6 overflow-visible bg-transparent p-0"
          >
            <TabsTrigger value="requests" className={tabTrigger}>
              Requests
            </TabsTrigger>
            <TabsTrigger value="visitors" className={tabTrigger}>
              Visitors
            </TabsTrigger>
            <TabsTrigger value="performance" className={tabTrigger}>
              Performance
            </TabsTrigger>
          </TabsList>

          <AnalyticsTimeFilter
            preset={filter.preset}
            onPresetChange={filter.setPreset}
            customStart={filter.customStart}
            customEnd={filter.customEnd}
            onCustomStartChange={filter.setCustomStart}
            onCustomEndChange={filter.setCustomEnd}
          />
        </div>

        <TabsContent value="requests">
          <RequestsTab range={filter.range} />
        </TabsContent>
        <TabsContent value="visitors">
          <VisitorsTab range={filter.range} />
        </TabsContent>
        <TabsContent value="performance">
          <PerformanceTab range={filter.range} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function RequestsTab({ range }: { range: GaRange }) {
  const { data, isLoading, error } = useGaRequests(range);

  if (isLoading) return <AnalyticsSkeleton stats={3} charts={1} lists={3} />;
  if (error || !data) {
    return <AnalyticsError message={apiErrorMessage(error)} />;
  }

  const chartData = data.timeseries.map((point) => ({
    label: point.label,
    requests: point.requests,
    pageviews: point.pageviews,
    visits: point.visits,
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Total requests"
          value={formatCount(data.summary.requests.value)}
          delta={data.summary.requests.delta}
          series={data.timeseries.map((point) => point.requests)}
          color={CHART_COLORS.accent}
          index={0}
        />
        <StatCard
          label="Pageviews"
          value={formatCount(data.summary.pageviews.value)}
          delta={data.summary.pageviews.delta}
          series={data.timeseries.map((point) => point.pageviews)}
          color={CHART_COLORS.blue}
          index={1}
        />
        <StatCard
          label="Visits"
          value={formatCount(data.summary.visits.value)}
          delta={data.summary.visits.delta}
          series={data.timeseries.map((point) => point.visits)}
          color={CHART_COLORS.green}
          index={2}
        />
      </div>

      <ChartCard
        title="Requests over time"
        legend={
          <ChartLegend
            items={[
              { label: 'Requests', color: CHART_COLORS.accent },
              { label: 'Pageviews', color: CHART_COLORS.blue },
              { label: 'Visits', color: CHART_COLORS.green },
            ]}
          />
        }
      >
        <LineChartPanel
          data={chartData}
          lines={[
            {
              key: 'requests',
              name: 'Requests',
              color: CHART_COLORS.accent,
            },
            {
              key: 'pageviews',
              name: 'Pageviews',
              color: CHART_COLORS.blue,
            },
            { key: 'visits', name: 'Visits', color: CHART_COLORS.green },
          ]}
        />
      </ChartCard>

      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Top pages">
          <RankedList
            items={data.byPage.map((page) => ({
              label: page.path,
              value: page.requests,
            }))}
            color={CHART_COLORS.accent}
          />
        </ChartCard>

        <ChartCard title="Traffic sources">
          <RankedList
            items={data.bySource.map((source) => ({
              label: source.source,
              value: source.visits,
            }))}
            color={CHART_COLORS.blue}
          />
        </ChartCard>

        <ChartCard title="Requests by device">
          <RankedList
            items={data.byDevice.map((device) => ({
              label: device.device,
              value: device.visits,
            }))}
            color={CHART_COLORS.purple}
          />
        </ChartCard>
      </div>
    </div>
  );
}

function VisitorsTab({ range }: { range: GaRange }) {
  const { data, isLoading, error } = useGaVisitors(range);

  if (isLoading) return <AnalyticsSkeleton stats={4} charts={2} lists={3} />;
  if (error || !data) {
    return <AnalyticsError message={apiErrorMessage(error)} />;
  }

  const pageviews = data.timeseries.map((point) => ({
    label: point.label,
    pageviews: point.pageviews,
  }));
  const visits = data.timeseries.map((point) => ({
    label: point.label,
    visits: point.visits,
    users: point.users,
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Pageviews"
          value={formatCount(data.summary.pageviews.value)}
          delta={data.summary.pageviews.delta}
          series={data.timeseries.map((point) => point.pageviews)}
          color={CHART_COLORS.accent}
          index={0}
        />
        <StatCard
          label="Visits"
          value={formatCount(data.summary.visits.value)}
          delta={data.summary.visits.delta}
          series={data.timeseries.map((point) => point.visits)}
          color={CHART_COLORS.blue}
          index={1}
        />
        <StatCard
          label="Users"
          value={formatCount(data.summary.users.value)}
          delta={data.summary.users.delta}
          series={data.timeseries.map((point) => point.users)}
          color={CHART_COLORS.green}
          index={2}
        />
        <StatCard
          label="New users"
          value={formatCount(data.summary.newUsers.value)}
          delta={data.summary.newUsers.delta}
          series={data.timeseries.map((point) => point.users)}
          color={CHART_COLORS.purple}
          index={3}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Pageviews over time">
          <LineChartPanel
            data={pageviews}
            lines={[
              {
                key: 'pageviews',
                name: 'Pageviews',
                color: CHART_COLORS.accent,
              },
            ]}
          />
        </ChartCard>

        <ChartCard
          title="Visits over time"
          legend={
            <ChartLegend
              items={[
                { label: 'Visits', color: CHART_COLORS.blue },
                { label: 'Users', color: CHART_COLORS.green },
              ]}
            />
          }
        >
          <LineChartPanel
            data={visits}
            lines={[
              { key: 'visits', name: 'Visits', color: CHART_COLORS.blue },
              { key: 'users', name: 'Users', color: CHART_COLORS.green },
            ]}
          />
        </ChartCard>
      </div>

      <VisitorsMapCard countries={data.countries} />

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Top pages">
          <RankedList
            items={data.topPages.map((page) => ({
              label: page.path,
              value: page.pageviews,
            }))}
            color={CHART_COLORS.accent}
            maxRows={5}
          />
        </ChartCard>

        <ChartCard title="Visitors by device">
          <RankedList
            items={data.devices.map((device) => ({
              label: device.device,
              value: device.users,
            }))}
            color={CHART_COLORS.purple}
          />
        </ChartCard>
      </div>
    </div>
  );
}

function PerformanceTab({ range }: { range: GaRange }) {
  const { data, isLoading, error } = useGaPerformance(range);

  if (isLoading) return <AnalyticsSkeleton stats={4} charts={2} lists={2} />;
  if (error || !data) {
    return <AnalyticsError message={apiErrorMessage(error)} />;
  }

  const engagement = data.timeseries.map((point) => ({
    label: point.label,
    avgEngagementTime: point.avgEngagementTime,
  }));
  const rates = data.timeseries.map((point) => ({
    label: point.label,
    engagementRate: point.engagementRate,
    bounceRate: point.bounceRate,
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Avg engagement time"
          value={formatDuration(data.summary.avgEngagementTime.value)}
          delta={data.summary.avgEngagementTime.delta}
          series={data.timeseries.map((point) => point.avgEngagementTime)}
          color={CHART_COLORS.accent}
          index={0}
        />
        <StatCard
          label="Engagement rate"
          value={formatPercent(data.summary.engagementRate.value)}
          delta={data.summary.engagementRate.delta}
          series={data.timeseries.map((point) => point.engagementRate)}
          color={CHART_COLORS.green}
          index={1}
        />
        <StatCard
          label="Bounce rate"
          value={formatPercent(data.summary.bounceRate.value)}
          delta={data.summary.bounceRate.delta}
          series={data.timeseries.map((point) => point.bounceRate)}
          color={CHART_COLORS.amber}
          invertDelta
          index={2}
        />
        <StatCard
          label="Sessions"
          value={formatCount(data.summary.sessions.value)}
          delta={data.summary.sessions.delta}
          series={data.timeseries.map((point) => point.sessions)}
          color={CHART_COLORS.blue}
          index={3}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Engagement time over time">
          <LineChartPanel
            data={engagement}
            lines={[
              {
                key: 'avgEngagementTime',
                name: 'Avg engagement time',
                color: CHART_COLORS.accent,
              },
            ]}
            valueFormatter={(value) => formatDuration(value)}
          />
        </ChartCard>

        <ChartCard
          title="Engagement & bounce rate"
          legend={
            <ChartLegend
              items={[
                { label: 'Engagement rate', color: CHART_COLORS.green },
                { label: 'Bounce rate', color: CHART_COLORS.amber },
              ]}
            />
          }
        >
          <LineChartPanel
            data={rates}
            lines={[
              {
                key: 'engagementRate',
                name: 'Engagement rate',
                color: CHART_COLORS.green,
              },
              {
                key: 'bounceRate',
                name: 'Bounce rate',
                color: CHART_COLORS.amber,
              },
            ]}
            valueFormatter={(value) => formatPercent(value)}
          />
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Top pages by engagement">
          <DataTable
            columns={[
              { key: 'path', label: 'Page' },
              { key: 'engagement', label: 'Avg time', align: 'right' },
              { key: 'rate', label: 'Engaged', align: 'right' },
              { key: 'pageviews', label: 'Views', align: 'right' },
            ]}
            rows={data.byPage.map((page) => ({
              path: page.path,
              engagement: formatDuration(page.avgEngagementTime),
              rate: formatPercent(page.engagementRate),
              pageviews: formatCount(page.pageviews),
            }))}
          />
        </ChartCard>

        <ChartCard title="Engagement by device">
          <RankedList
            items={data.byDevice.map((device) => ({
              label: device.device,
              value: device.visits,
            }))}
            color={CHART_COLORS.purple}
          />
        </ChartCard>
      </div>

      <div
        className="text-[10.5px]"
        style={{ fontFamily: mono, color: MUTED }}
      >
        Aggregated by Google Analytics 4. Percent changes compare the selected
        range with the immediately preceding period of equal length.
      </div>
    </div>
  );
}
