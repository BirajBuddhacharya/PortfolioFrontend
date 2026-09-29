import { Skeleton } from '@/components/components/ui/skeleton';

/** Mirrors ProjectForm's layout so the edit page doesn't jump when data lands. */
export function ProjectFormSkeleton() {
  return (
    <div>
      {/* Sticky bar */}
      <div className="sticky top-0 z-20 -mx-7 mb-10 flex items-center justify-between gap-4 border-b border-border bg-background/85 px-7 py-3 backdrop-blur">
        <Skeleton className="h-8 w-16" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>

      <Skeleton className="h-10 w-3/4" />
      <Skeleton className="mb-6 mt-3 h-5 w-full max-w-[420px]" />

      <div className="flex flex-col gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-4 w-4 rounded-sm" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-6 w-40" />
          </div>
        ))}
      </div>

      <div className="my-8 h-px bg-border" />

      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-7 w-28 rounded-lg" />
      </div>

      <Skeleton className="h-[460px] w-full" />
    </div>
  );
}
