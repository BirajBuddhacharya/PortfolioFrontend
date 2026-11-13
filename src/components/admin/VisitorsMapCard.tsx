'use client';

import { useMemo, useRef, useState } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { geoNaturalEarth1, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import kindofWorld from 'world-atlas/countries-110m.json';
import type { Feature, FeatureCollection, Geometry } from 'geojson';
import type {
  GeometryCollection,
  Topology,
} from 'topojson-specification';
import { Card } from '@/components/components/ui/card';
import { cn } from '@/components/lib/utils';
import { CHART_COLORS } from './analyticsCharts';
import {
  BORDER,
  MUTED,
  TEXT,
  TEXT2,
  dashCard,
  mono,
  SectionLabel,
} from './adminUi';

const MAP_WIDTH = 800;
const MAP_HEIGHT = 420;

type CountryProperties = { name?: string };
type CountryFeature = Feature<Geometry, CountryProperties>;

const topology = kindofWorld as unknown as Topology;
const collection = feature(
  topology,
  topology.objects.countries as GeometryCollection<CountryProperties>,
) as FeatureCollection<Geometry, CountryProperties>;

// Antarctica adds a lot of empty area and skews the fit; skip it.
const mapFeatures = collection.features.filter(
  (country) => country.properties?.name !== 'Antarctica',
);

const projection = geoNaturalEarth1().fitExtent(
  [
    [12, 12],
    [MAP_WIDTH - 12, MAP_HEIGHT - 12],
  ],
  { type: 'FeatureCollection', features: mapFeatures } as FeatureCollection,
);
const pathFor = geoPath(projection);

const COUNTRY_ALIASES: Record<string, string> = {
  'united states': 'united states',
  'united states of america': 'united states',
  'bosnia and herz.': 'bosnia and herzegovina',
  'bosnia and herzegovina': 'bosnia and herzegovina',
  'central african rep.': 'central african republic',
  'central african republic': 'central african republic',
  'dem. rep. congo': 'democratic republic of the congo',
  'democratic republic of the congo': 'democratic republic of the congo',
  'congo - kinshasa': 'democratic republic of the congo',
  congo: 'republic of the congo',
  'republic of the congo': 'republic of the congo',
  'congo - brazzaville': 'republic of the congo',
  'dominican rep.': 'dominican republic',
  'dominican republic': 'dominican republic',
  'eq. guinea': 'equatorial guinea',
  'equatorial guinea': 'equatorial guinea',
  's. sudan': 'south sudan',
  'south sudan': 'south sudan',
  "côte d'ivoire": "côte d'ivoire",
  'ivory coast': "côte d'ivoire",
  'côte d’ivoire': "côte d'ivoire",
  macedonia: 'north macedonia',
  'north macedonia': 'north macedonia',
  'timor-leste': 'timor-leste',
  'east timor': 'timor-leste',
  myanmar: 'myanmar',
  'myanmar (burma)': 'myanmar',
  eswatini: 'eswatini',
  swaziland: 'eswatini',
  palestine: 'palestine',
  'palestinian territories': 'palestine',
  'w. sahara': 'western sahara',
  'western sahara': 'western sahara',
  'solomon is.': 'solomon islands',
  'solomon islands': 'solomon islands',
  'falkland is.': 'falkland islands',
  'falkland islands': 'falkland islands',
  czechia: 'czechia',
  'czech republic': 'czechia',
  laos: 'laos',
  "lao people's democratic republic": 'laos',
  russia: 'russia',
  'russian federation': 'russia',
  'south korea': 'south korea',
  'republic of korea': 'south korea',
  'north korea': 'north korea',
  "democratic people's republic of korea": 'north korea',
  turkey: 'turkey',
  'türkiye': 'turkey',
  vietnam: 'vietnam',
  'viet nam': 'vietnam',
  brunei: 'brunei',
  'brunei darussalam': 'brunei',
  moldova: 'moldova',
  'republic of moldova': 'moldova',
  tanzania: 'tanzania',
  'united republic of tanzania': 'tanzania',
  venezuela: 'venezuela',
  'venezuela, bolivarian republic of': 'venezuela',
  bolivia: 'bolivia',
  'bolivia, plurinational state of': 'bolivia',
  iran: 'iran',
  'islamic republic of iran': 'iran',
  syria: 'syria',
  'syrian arab republic': 'syria',
  taiwan: 'taiwan',
  'taiwan, province of china': 'taiwan',
};

function canonicalCountry(name: string) {
  const key = name.trim().toLowerCase().replace(/\u2019/g, "'");
  return COUNTRY_ALIASES[key] ?? key;
}

function formatCount(value: number) {
  return Number.isFinite(value) ? value.toLocaleString('en-US') : '0';
}

type CountryRow = { country: string; users: number; pageviews: number };

export function VisitorsMapCard({
  countries,
  className,
}: {
  countries: CountryRow[];
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<CountryFeature | null>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  const values = useMemo(() => {
    const map = new Map<string, number>();
    for (const country of countries) {
      const key = canonicalCountry(country.country);
      map.set(key, (map.get(key) ?? 0) + country.users);
    }
    return map;
  }, [countries]);

  const maxUsers = useMemo(
    () => Math.max(...countries.map((country) => country.users), 1),
    [countries],
  );

  const topCountries = useMemo(
    () => [...countries].sort((a, b) => b.users - a.users).slice(0, 8),
    [countries],
  );

  const maxTopUsers = Math.max(...topCountries.map((item) => item.users), 1);

  const fillFor = (users: number) => {
    if (users === 0) return 'rgba(255,255,255,0.055)';
    const ratio = Math.min(1, users / maxUsers);
    return `rgba(96,165,250,${0.42 + ratio * 0.5})`;
  };

  const trackPointer = (event: ReactMouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPointer({
      x: Math.min(Math.max(event.clientX - rect.left, 72), rect.width - 72),
      y: Math.max(event.clientY - rect.top, 54),
    });
  };

  const hoveredName = hovered?.properties?.name;
  const hoveredUsers = hoveredName
    ? (values.get(canonicalCountry(hoveredName)) ?? 0)
    : 0;

  return (
    <Card className={cn(dashCard, 'h-auto p-5', className)}>
      <SectionLabel>visitors by country</SectionLabel>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_210px]">
        <div ref={containerRef} className="relative min-w-0">
          <svg
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            className="h-auto w-full"
            role="img"
            aria-label="World map of visitors by country"
          >
            <rect
              width={MAP_WIDTH}
              height={MAP_HEIGHT}
              fill="transparent"
            />
            {mapFeatures.map((country) => {
              const name = country.properties?.name ?? '';
              const users = values.get(canonicalCountry(name)) ?? 0;
              const isHovered = hoveredName === name;
              const d = pathFor(country) ?? '';

              return (
                <path
                  key={name}
                  d={d}
                  fill={isHovered ? '#93C5FD' : fillFor(users)}
                  stroke={isHovered ? '#DBEAFE' : '#0C0C0F'}
                  strokeWidth={isHovered ? 1.1 : 0.6}
                  strokeLinejoin="round"
                  className="cursor-pointer transition-[fill] duration-150"
                  onMouseEnter={(event) => {
                    setHovered(country);
                    trackPointer(event);
                  }}
                  onMouseMove={trackPointer}
                  onMouseLeave={() => setHovered(null)}
                >
                  <title>
                    {name}
                    {users > 0 ? ` — ${users} visitors` : ''}
                  </title>
                </path>
              );
            })}
          </svg>

          {hovered && (
            <div
              className="pointer-events-none absolute z-10 rounded-[9px] border px-2.5 py-1.5 shadow-lg"
              style={{
                left: pointer.x,
                top: pointer.y - 12,
                transform: 'translate(-50%, -100%)',
                borderColor: BORDER,
                background: '#0C0C0F',
              }}
            >
              <div
                className="whitespace-nowrap text-[11.5px]"
                style={{ color: TEXT }}
              >
                {hovered.properties?.name}
              </div>
              <div
                className="mt-0.5 whitespace-nowrap text-[10.5px]"
                style={{ fontFamily: mono, color: MUTED }}
              >
                {hoveredUsers > 0
                  ? `${formatCount(hoveredUsers)} visitors`
                  : 'No visitors'}
              </div>
            </div>
          )}

          <div className="mt-1 flex items-center justify-end gap-2">
            <span
              className="text-[9.5px] uppercase tracking-[0.08em]"
              style={{ fontFamily: mono, color: MUTED }}
            >
              fewer
            </span>
            <div
              className="h-[5px] w-[92px] rounded-full"
              style={{
                background:
                  'linear-gradient(to right, rgba(96,165,250,0.2), rgba(96,165,250,0.92))',
              }}
            />
            <span
              className="text-[9.5px] uppercase tracking-[0.08em]"
              style={{ fontFamily: mono, color: MUTED }}
            >
              more
            </span>
          </div>
        </div>

        <div className="flex min-w-0 flex-col">
          <div
            className="flex items-center justify-between gap-3 border-b pb-2"
            style={{ borderColor: BORDER }}
          >
            <span
              className="text-[9.5px] uppercase tracking-[0.1em]"
              style={{ fontFamily: mono, color: MUTED }}
            >
              Country
            </span>
            <span
              className="text-[9.5px] uppercase tracking-[0.1em]"
              style={{ fontFamily: mono, color: MUTED }}
            >
              Visitors
            </span>
          </div>

          {topCountries.length === 0 && (
            <div
              className="py-8 text-[11px]"
              style={{ fontFamily: mono, color: MUTED }}
            >
              No country data
            </div>
          )}

          <div className="flex flex-col">
            {topCountries.map((country) => (
              <div
                key={country.country}
                className="flex items-center justify-between gap-3 border-b py-[7px]"
                style={{ borderColor: 'rgba(255,255,255,0.05)' }}
              >
                <div className="min-w-0 flex-1">
                  <div
                    className="truncate text-[12px]"
                    style={{ color: TEXT2 }}
                    title={country.country}
                  >
                    {country.country}
                  </div>
                  <div
                    className="mt-1 h-[3px] w-full max-w-[120px] overflow-hidden rounded-full"
                    style={{ background: 'rgba(255,255,255,0.06)' }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.max(
                          3,
                          (country.users / maxTopUsers) * 100,
                        )}%`,
                        background: CHART_COLORS.blue,
                      }}
                    />
                  </div>
                </div>
                <span
                  className="shrink-0 text-[12px]"
                  style={{ fontFamily: mono, color: TEXT }}
                >
                  {formatCount(country.users)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
