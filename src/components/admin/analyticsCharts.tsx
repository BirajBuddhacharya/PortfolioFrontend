'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card } from '@/components/components/ui/card';
import { cn } from '@/components/lib/utils';
import {
  ACCENT,
  BORDER,
  MUTED,
  TEXT,
  TEXT2,
  dashCard,
  mono,
  SectionLabel,
} from './adminUi';

export const CHART_COLORS = {
  accent: ACCENT,
  blue: '#60A5FA',
  green: '#34D399',
  purple: '#A78BFA',
  amber: '#FBBF24',
  pink: '#F472B6',
  teal: '#2DD4BF',
};

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const axisTick = {
  fill: MUTED,
  fontSize: 10.5,
  fontFamily: mono,
};

export const gridStroke = 'rgba(255,255,255,0.06)';

export function formatAxisTick(value: string) {
  if (typeof value !== 'string') return value;
  const [date, time] = value.split(' ');
  const [, month, day] = date.split('-');
  const label = `${MONTHS[Number(month) - 1] ?? ''} ${Number(day)}`;
  return time ? `${label}, ${time}` : label;
}

export function formatCount(value: number) {
  if (!Number.isFinite(value)) return '0';
  if (Math.abs(value) >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(value) >= 10_000) {
    return `${(value / 1_000).toFixed(1)}k`;
  }
  return value.toLocaleString('en-US');
}

export function formatDuration(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0s';
  if (seconds < 60) {
    return `${seconds < 10 ? seconds.toFixed(1) : Math.round(seconds)}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const rest = Math.round(seconds % 60);
  return `${minutes}m ${rest}s`;
}

export function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

export function Delta({
  value,
  invert = false,
}: {
  value: number | null;
  invert?: boolean;
}) {
  if (value === null) {
    return (
      <span className="text-[11px]" style={{ fontFamily: mono, color: MUTED }}>
        no prior data
      </span>
    );
  }

  const flat = value === 0;
  const good = invert ? value < 0 : value > 0;
  const color = flat ? MUTED : good ? CHART_COLORS.green : '#F87171';
  const arrow = flat ? '•' : value > 0 ? '↑' : '↓';

  return (
    <span
      className="text-[11px]"
      style={{ fontFamily: mono, color }}
    >
      {arrow} {Math.abs(value).toFixed(1)}%
    </span>
  );
}

export function Sparkline({
  series,
  color,
  id,
}: {
  series: number[];
  color: string;
  id: string;
}) {
  const data = series.map((value, index) => ({ index, value }));
  return (
    <ResponsiveContainer width="100%" height={48}>
      <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={`spark-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.6}
          fill={`url(#spark-${id})`}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function StatCard({
  label,
  value,
  delta,
  series,
  color,
  invertDelta,
  index = 0,
}: {
  label: string;
  value: string;
  delta: number | null;
  series: number[];
  color: string;
  invertDelta?: boolean;
  index?: number;
}) {
  const id = label.replace(/[^a-z0-9]/gi, '-').toLowerCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
    >
      <Card className={cn(dashCard, 'min-h-[148px] p-4')}>
        <div
          className="text-[11px] mb-2"
          style={{ fontFamily: mono, color: MUTED }}
        >
          {label}
        </div>
        <div className="flex items-end justify-between gap-3">
          <div
            className="text-[26px] font-semibold leading-none"
            style={{ fontFamily: 'var(--font-space-grotesk)', color: TEXT }}
          >
            {value}
          </div>
          <Delta value={delta} invert={invertDelta} />
        </div>
        <div className="-mx-2 mt-auto pt-3">
          <Sparkline series={series} color={color} id={id} />
        </div>
      </Card>
    </motion.div>
  );
}

export function ChartCard({
  title,
  children,
  className,
  action,
  legend,
}: {
  title: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
  legend?: ReactNode;
}) {
  return (
    <Card className={cn(dashCard, 'min-h-[280px] p-5', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <SectionLabel>{title}</SectionLabel>
          {legend}
        </div>
        {action}
      </div>
      <div className="flex-1 min-h-[200px]">{children}</div>
    </Card>
  );
}

export function ChartTooltip({
  active,
  payload,
  label,
  valueFormatter,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; color?: string }>;
  label?: string;
  valueFormatter?: (value: number, name?: string) => string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className="rounded-[10px] border px-3 py-2"
      style={{ borderColor: BORDER, background: '#0C0C0F' }}
    >
      <div
        className="text-[10.5px] mb-1.5"
        style={{ fontFamily: mono, color: MUTED }}
      >
        {label ? formatAxisTick(label) : ''}
      </div>
      <div className="flex flex-col gap-1">
        {payload.map((entry) => (
          <div
            key={entry.name}
            className="flex items-center justify-between gap-4 text-[11.5px]"
            style={{ color: TEXT2 }}
          >
            <span className="flex items-center gap-1.5">
              <span
                className="w-[6px] h-[6px] rounded-full"
                style={{ background: entry.color }}
              />
              {entry.name}
            </span>
            <span style={{ fontFamily: mono, color: TEXT }}>
              {valueFormatter
                ? valueFormatter(Number(entry.value ?? 0), entry.name)
                : formatCount(Number(entry.value ?? 0))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChartLegend({
  items,
}: {
  items: { label: string; color: string }[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 -mt-2 mb-2">
      {items.map((item) => (
        <span
          key={item.label}
          className="inline-flex items-center gap-1.5 text-[10.5px]"
          style={{ fontFamily: mono, color: MUTED }}
        >
          <span
            className="w-[7px] h-[7px] rounded-full"
            style={{ background: item.color }}
          />
          {item.label}
        </span>
      ))}
    </div>
  );
}

export function LineChartPanel({
  data,
  lines,
  valueFormatter,
  className,
  tickFormatter = formatAxisTick,
}: {
  data: Array<Record<string, unknown> & { label: string }>;
  lines: { key: string; name: string; color: string; yAxisId?: string }[];
  valueFormatter?: (value: number, name?: string) => string;
  className?: string;
  tickFormatter?: (value: string) => string;
}) {
  return (
    <div className={cn('h-[220px] w-full', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
          <CartesianGrid stroke={gridStroke} vertical={false} />
          <XAxis
            dataKey="label"
            tick={axisTick}
            tickLine={false}
            axisLine={{ stroke: gridStroke }}
            tickFormatter={tickFormatter}
            minTickGap={28}
          />
          <YAxis
            tick={axisTick}
            tickLine={false}
            axisLine={false}
            width={44}
            tickFormatter={(value) => formatCount(Number(value))}
          />
          <Tooltip
            cursor={{ stroke: 'rgba(255,255,255,0.12)' }}
            content={<ChartTooltip valueFormatter={valueFormatter} />}
          />
          {lines.map((line) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              name={line.name}
              stroke={line.color}
              strokeWidth={1.8}
              dot={false}
              activeDot={{ r: 3, strokeWidth: 0 }}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RankedList({
  items,
  formatValue = formatCount,
  color = CHART_COLORS.accent,
  emptyLabel = 'No data for this period',
  maxRows,
}: {
  items: { label: string; value: number; hint?: string }[];
  formatValue?: (value: number) => string;
  color?: string;
  emptyLabel?: string;
  maxRows?: number;
}) {
  if (items.length === 0) {
    return <EmptyState label={emptyLabel} />;
  }

  const rows = maxRows ? items.slice(0, maxRows) : items;
  const max = Math.max(...rows.map((item) => item.value), 1);
  const total = rows.reduce((sum, item) => sum + item.value, 0) || 1;

  return (
    <div className="flex flex-col gap-3">
      {rows.map((item) => (
        <div key={`${item.label}-${item.value}`} className="flex items-center gap-3">
          <span
            className="w-[118px] shrink-0 truncate text-[12px]"
            style={{ color: TEXT2 }}
            title={item.label}
          >
            {item.label}
          </span>
          <div
            className="flex-1 h-[5px] rounded-full overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.max(2, (item.value / max) * 100)}%`,
                background: color,
              }}
            />
          </div>
          <span
            className="w-[64px] shrink-0 text-right text-[11px]"
            style={{ fontFamily: mono, color: MUTED }}
          >
            {formatValue(item.value)}
          </span>
          <span
            className="w-[38px] shrink-0 text-right text-[10.5px]"
            style={{ fontFamily: mono, color: MUTED }}
          >
            {Math.round((item.value / total) * 100)}%
          </span>
        </div>
      ))}
    </div>
  );
}

export function DataTable({
  columns,
  rows,
  emptyLabel = 'No data for this period',
}: {
  columns: { key: string; label: string; align?: 'left' | 'right' }[];
  rows: Array<Record<string, string | number>>;
  emptyLabel?: string;
}) {
  if (rows.length === 0) return <EmptyState label={emptyLabel} />;

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  'pb-2 text-[10px] font-normal uppercase tracking-[0.1em]',
                  column.align === 'right' ? 'text-right' : 'text-left',
                )}
                style={{ fontFamily: mono, color: MUTED }}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={`${String(row[columns[0].key])}-${index}`}
              className="border-t"
              style={{ borderColor: 'rgba(255,255,255,0.05)' }}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cn(
                    'py-2 text-[12px]',
                    column.align === 'right' ? 'text-right' : 'text-left',
                  )}
                  style={{
                    color: column.key === columns[0].key ? TEXT2 : MUTED,
                    fontFamily:
                      column.align === 'right' ? mono : 'inherit',
                  }}
                >
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function EmptyState({ label }: { label: string }) {
  return (
    <div
      className="flex h-[160px] items-center justify-center text-[12px]"
      style={{ fontFamily: mono, color: MUTED }}
    >
      {label}
    </div>
  );
}

export function AnalyticsError({ message }: { message: string }) {
  return (
    <Card className={cn(dashCard, 'items-center justify-center py-16')}>
      <div
        className="text-[12px] text-center max-w-[440px]"
        style={{ fontFamily: mono, color: MUTED }}
      >
        {message}
      </div>
    </Card>
  );
}
