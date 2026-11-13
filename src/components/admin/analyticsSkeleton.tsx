import { Card } from '@/components/components/ui/card';
import { cn } from '@/components/lib/utils';
import { dashCard } from './adminUi';

const BAR_HEIGHTS = [
  42, 68, 31, 84, 55, 74, 38, 92, 61, 49, 79, 34, 66, 88,
];

const LINE_PATH =
  'M0,138 C40,132 62,108 94,112 C126,116 148,86 180,94 C212,102 236,70 268,78 C300,86 322,52 354,64 C386,76 408,98 440,90 C472,82 498,118 530,108 C562,98 582,120 600,110';

function SkeletonBar({ className }: { className?: string }) {
  return (
    <div
      className={cn('animate-pulse rounded bg-white/[0.06]', className)}
    />
  );
}

export function ChartSkeleton({
  variant = 'line',
  height = 200,
}: {
  variant?: 'line' | 'bars';
  height?: number;
}) {
  return (
    <div className="w-full" style={{ height }} aria-hidden="true">
      <div className="relative h-full">
        {/* horizontal grid */}
        <div className="absolute inset-0 flex flex-col justify-between pl-9">
          {[0, 1, 2, 3, 4].map((line) => (
            <div
              key={line}
              className="border-t"
              style={{ borderColor: 'rgba(255,255,255,0.04)' }}
            />
          ))}
        </div>

        {/* y-axis ticks */}
        <div className="absolute inset-y-0 left-0 flex w-8 flex-col justify-between py-[2px]">
          {[0, 1, 2, 3, 4].map((tick) => (
            <SkeletonBar key={tick} className="h-2 w-6" />
          ))}
        </div>

        {/* plot */}
        <div className="absolute inset-y-0 left-9 right-0 flex items-end">
          {variant === 'bars' ? (
            <div className="flex h-full w-full items-end gap-[6px]">
              {BAR_HEIGHTS.map((barHeight, index) => (
                <div
                  key={index}
                  className="flex-1 animate-pulse rounded-[4px]"
                  style={{
                    height: `${barHeight}%`,
                    background: 'rgba(255,255,255,0.06)',
                  }}
                />
              ))}
            </div>
          ) : (
            <svg
              viewBox="0 0 600 160"
              preserveAspectRatio="none"
              className="h-full w-full animate-pulse"
            >
              <path
                d={`${LINE_PATH} L600,160 L0,160 Z`}
                fill="rgba(255,255,255,0.03)"
              />
              <path
                d={LINE_PATH}
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          )}
        </div>
      </div>

      {/* x-axis ticks */}
      <div className="mt-3 flex justify-between pl-9">
        {[0, 1, 2, 3, 4, 5].map((tick) => (
          <SkeletonBar key={tick} className="h-2 w-8" />
        ))}
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <Card className={cn(dashCard, 'min-h-[148px] p-4')}>
      <SkeletonBar className="h-2.5 w-24" />
      <div className="mt-3 flex items-end justify-between">
        <SkeletonBar className="h-7 w-16" />
        <SkeletonBar className="h-2.5 w-10" />
      </div>
      <div
        className="mt-auto h-[48px] w-full animate-pulse rounded-[6px]"
        style={{
          background:
            'linear-gradient(to bottom, rgba(255,255,255,0.06), rgba(255,255,255,0))',
        }}
      />
    </Card>
  );
}

function ListSkeletonRow({ index }: { index: number }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="h-2.5 shrink-0 animate-pulse rounded bg-white/[0.06]"
        style={{ width: `${96 + (index % 3) * 18}px` }}
      />
      <div className="h-[5px] flex-1 animate-pulse rounded-full bg-white/[0.05]" />
      <SkeletonBar className="h-2.5 w-10 shrink-0" />
    </div>
  );
}

export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: rows }).map((_, index) => (
        <ListSkeletonRow key={index} index={index} />
      ))}
    </div>
  );
}

export function AnalyticsSkeleton({
  stats = 3,
  charts = 2,
  lists = 2,
}: {
  stats?: number;
  charts?: number;
  lists?: number;
}) {
  const statColumns = stats >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3';

  return (
    <div className="flex flex-col gap-4" aria-busy="true" aria-live="polite">
      <div className={cn('grid gap-4 sm:grid-cols-2', statColumns)}>
        {Array.from({ length: stats }).map((_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>

      <div className={cn('grid gap-4', charts > 1 && 'lg:grid-cols-2')}>
        {Array.from({ length: charts }).map((_, index) => (
          <Card
            key={index}
            className={cn(dashCard, 'h-auto min-h-[280px] p-5')}
          >
            <div className="mb-4 h-2.5 w-32 animate-pulse rounded bg-white/[0.06]" />
            <ChartSkeleton variant="line" height={200} />
          </Card>
        ))}
      </div>

      <div
        className={cn(
          'grid gap-4',
          lists >= 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2',
        )}
      >
        {Array.from({ length: lists }).map((_, index) => (
          <Card key={index} className={cn(dashCard, 'h-auto p-5')}>
            <div className="mb-4 h-2.5 w-28 animate-pulse rounded bg-white/[0.06]" />
            <ListSkeleton rows={5} />
          </Card>
        ))}
      </div>
    </div>
  );
}
