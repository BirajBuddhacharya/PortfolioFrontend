'use client';

import { useMemo, useState } from 'react';
import { CalendarDays } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/components/ui/select';
import { cn } from '@/components/lib/utils';
import type { GaRange } from '../../types/analytics';
import { BORDER, MUTED, TEXT2, formField, mono } from './adminUi';

export type RangePreset = '24h' | '7d' | '14d' | '30d' | '90d' | 'custom';

const PRESETS: { value: RangePreset; label: string; days?: number }[] = [
  { value: '24h', label: 'Last 24 hours' },
  { value: '7d', label: 'Last 7 days', days: 7 },
  { value: '14d', label: 'Last 14 days', days: 14 },
  { value: '30d', label: 'Last 30 days', days: 30 },
  { value: '90d', label: 'Last 90 days', days: 90 },
  { value: 'custom', label: 'Custom range' },
];

const DAY_MS = 24 * 60 * 60 * 1000;

const toIso = (date: Date) => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
};

const addDays = (date: Date, days: number) =>
  new Date(date.getTime() + days * DAY_MS);

function presetRange(preset: RangePreset): { start: string; end: string } {
  const today = new Date();
  const end = toIso(today);

  if (preset === '24h') {
    return { start: toIso(addDays(today, -1)), end };
  }

  const days = PRESETS.find((item) => item.value === preset)?.days ?? 7;
  return { start: toIso(addDays(today, -(days - 1))), end };
}

export function useAnalyticsRange() {
  const [preset, setPreset] = useState<RangePreset>('7d');
  const initial = presetRange('30d');
  const [customStart, setCustomStart] = useState(initial.start);
  const [customEnd, setCustomEnd] = useState(initial.end);

  const range = useMemo<GaRange>(() => {
    if (preset === 'custom') {
      const start = customStart || toIso(addDays(new Date(), -6));
      const end = customEnd || toIso(new Date());
      return start > end
        ? { startDate: end, endDate: start, granularity: 'day' }
        : { startDate: start, endDate: end, granularity: 'day' };
    }

    const { start, end } = presetRange(preset);
    return {
      startDate: start,
      endDate: end,
      granularity: preset === '24h' ? 'hour' : 'day',
    };
  }, [preset, customStart, customEnd]);

  return {
    preset,
    setPreset,
    customStart,
    setCustomStart,
    customEnd,
    setCustomEnd,
    range,
  };
}

export function AnalyticsTimeFilter({
  preset,
  onPresetChange,
  customStart,
  customEnd,
  onCustomStartChange,
  onCustomEndChange,
}: {
  preset: RangePreset;
  onPresetChange: (value: RangePreset) => void;
  customStart: string;
  customEnd: string;
  onCustomStartChange: (value: string) => void;
  onCustomEndChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {preset === 'custom' && (
        <>
          <input
            type="date"
            value={customStart}
            max={customEnd}
            onChange={(event) => onCustomStartChange(event.target.value)}
            className={cn(
              formField,
              'h-auto rounded-[10px] px-3 py-[7px] text-[12px]',
            )}
            style={{ fontFamily: mono, color: TEXT2, colorScheme: 'dark' }}
            aria-label="Start date"
          />
          <span className="text-[11px]" style={{ fontFamily: mono, color: MUTED }}>
            to
          </span>
          <input
            type="date"
            value={customEnd}
            min={customStart}
            onChange={(event) => onCustomEndChange(event.target.value)}
            className={cn(
              formField,
              'h-auto rounded-[10px] px-3 py-[7px] text-[12px]',
            )}
            style={{ fontFamily: mono, color: TEXT2, colorScheme: 'dark' }}
            aria-label="End date"
          />
        </>
      )}

      <Select
        value={preset}
        onValueChange={(value) => onPresetChange(value as RangePreset)}
      >
        <SelectTrigger
          className={cn(
            'h-auto w-auto gap-2 rounded-[10px] border px-3 py-[7px]',
            'font-mono text-[12px] shadow-none focus:ring-0',
          )}
          style={{
            borderColor: BORDER,
            background: '#111115',
            color: TEXT2,
          }}
        >
          <CalendarDays size={13} strokeWidth={1.7} />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PRESETS.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="font-mono text-[12px]"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
