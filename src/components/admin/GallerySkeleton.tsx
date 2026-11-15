import { Skeleton } from '@/components/components/ui/skeleton';
import { BORDER } from './adminUi';

const GRID_STYLE = {
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
} as const;

/** Mirrors the gallery page: labelled image grid plus document rows. */
export function GallerySkeleton({
  images = 8,
  documents = 2,
}: {
  images?: number;
  documents?: number;
}) {
  return (
    <div aria-busy="true" aria-live="polite">
      <div className="mb-8">
        <Skeleton className="mb-3 h-2.5 w-24" />
        <div className="grid gap-4" style={GRID_STYLE}>
          {Array.from({ length: images }).map((_, i) => (
            <Skeleton
              key={i}
              className="w-full rounded-[12px]"
              style={{ aspectRatio: '4/3' }}
            />
          ))}
        </div>
      </div>

      <div>
        <Skeleton className="mb-3 h-2.5 w-28" />
        <div className="flex flex-col gap-2">
          {Array.from({ length: documents }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-4 rounded-[12px] border"
              style={{ borderColor: BORDER, background: '#0C0C0F' }}
            >
              <Skeleton className="h-[18px] w-[18px] shrink-0 rounded-[4px]" />
              <div className="flex-1 min-w-0">
                <Skeleton
                  className="h-3"
                  style={{ width: `${52 + (i % 3) * 10}%` }}
                />
                <Skeleton className="mt-2 h-2.5 w-12" />
              </div>
              <Skeleton className="h-[26px] w-[52px] rounded-[7px]" />
              <Skeleton className="h-[26px] w-8 rounded-[7px]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
