import { Skeleton } from '@/components/components/ui/skeleton';
import { panelCard } from './adminUi';

/** Label + input pair used inside the resume entry cards. */
function FieldSkeleton({ labelWidth = 'w-12' }: { labelWidth?: string }) {
  return (
    <div>
      <Skeleton className={`mb-1 h-2.5 ${labelWidth}`} />
      <Skeleton className="h-9 w-full rounded-[9px]" />
    </div>
  );
}

function EntryCardSkeleton() {
  return (
    <div className={panelCard}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-14" />
        <Skeleton className="h-6 w-[62px] rounded-[7px]" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FieldSkeleton />
        <FieldSkeleton />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FieldSkeleton />
        <FieldSkeleton />
      </div>
      <div>
        <Skeleton className="mb-1 h-2.5 w-10" />
        <Skeleton className="h-[62px] w-full rounded-[9px]" />
      </div>
    </div>
  );
}

function SaveButtonSkeleton() {
  return <Skeleton className="h-[42px] w-[148px] self-start rounded-[12px]" />;
}

const row = (key: number) => <EntryCardSkeleton key={key} />;

/** Mirrors the Experience tab: section label, add button, entry cards, save. */
export function ResumeExperienceSkeleton() {
  return (
    <div
      className="max-w-[860px] flex flex-col gap-6"
      aria-busy="true"
      aria-live="polite"
    >
      <Skeleton className="mb-4 h-3 w-20" />
      <div className="flex justify-end mb-4">
        <Skeleton className="h-[26px] w-[118px] rounded-[8px]" />
      </div>
      <div className="flex flex-col gap-4">{[0, 1].map(row)}</div>
      <SaveButtonSkeleton />
    </div>
  );
}

/** Mirrors the Education & Certs tab: two stacked row lists. */
export function ResumeEducationCertsSkeleton() {
  return (
    <div
      className="max-w-[860px] flex flex-col gap-10"
      aria-busy="true"
      aria-live="polite"
    >
      {[0, 1].map((section) => (
        <div key={section}>
          <Skeleton className="mb-4 h-3 w-24" />
          <div className="flex justify-end mb-4">
            <Skeleton className="h-[26px] w-[120px] rounded-[8px]" />
          </div>
          <div className="flex flex-col gap-4">{[0, 1].map(row)}</div>
        </div>
      ))}
      <SaveButtonSkeleton />
    </div>
  );
}

/** Mirrors the Skills tab: header with add button, category cards, save. */
export function ResumeSkillsSkeleton() {
  return (
    <div
      className="max-w-[860px] flex flex-col gap-6"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-14" />
        <Skeleton className="h-[26px] w-[112px] rounded-[8px]" />
      </div>
      <div className="flex flex-col gap-4">
        {[0, 1].map((i) => (
          <div key={i} className={panelCard}>
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-6 w-[62px] rounded-[7px]" />
            </div>
            <FieldSkeleton labelWidth="w-24" />
            <div>
              <Skeleton className="mb-1 h-2.5 w-36" />
              <Skeleton className="h-[54px] w-full rounded-[9px]" />
            </div>
          </div>
        ))}
      </div>
      <SaveButtonSkeleton />
    </div>
  );
}

/** Mirrors the Resume PDF tab: drop zone, URL input, save. */
export function ResumePdfSkeleton() {
  return (
    <div
      className="max-w-[860px] flex flex-col gap-6"
      aria-busy="true"
      aria-live="polite"
    >
      <Skeleton className="mb-4 h-3 w-24" />
      <Skeleton className="h-[170px] w-full rounded-[16px]" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-2.5 w-36" />
        <Skeleton className="h-[42px] w-full rounded-[10px]" />
      </div>
      <Skeleton className="h-[42px] w-[148px] self-start rounded-[12px]" />
    </div>
  );
}
