import { Skeleton } from '@/components/components/ui/skeleton';
import { panelCard } from './adminUi';

function FieldSkeleton({ labelWidth = 'w-16' }: { labelWidth?: string }) {
  return (
    <div>
      <Skeleton className={`mb-2 h-2.5 ${labelWidth}`} />
      <Skeleton className="h-[42px] w-full rounded-[10px]" />
    </div>
  );
}

/** Mirrors the Account tab: section label, name/email fields, save. */
export function SettingsAccountSkeleton() {
  return (
    <div
      className="flex flex-col gap-6"
      aria-busy="true"
      aria-live="polite"
    >
      <Skeleton className="mb-4 h-3 w-16" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FieldSkeleton labelWidth="w-24" />
        <FieldSkeleton labelWidth="w-12" />
      </div>
      <Skeleton className="h-[42px] w-[148px] self-start rounded-[12px]" />
    </div>
  );
}

/** Mirrors the Contact Links tab: header, hint, link cards, save. */
export function SettingsLinksSkeleton() {
  return (
    <div
      className="flex flex-col gap-6"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-[26px] w-[92px] rounded-[8px]" />
      </div>
      <Skeleton className="-mt-4 h-2.5 w-full max-w-[420px]" />
      <div className="flex flex-col gap-4">
        {[0, 1].map((i) => (
          <div key={i} className={panelCard}>
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-6 w-[62px] rounded-[7px]" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <FieldSkeleton labelWidth="w-10" />
              <FieldSkeleton labelWidth="w-24" />
              <FieldSkeleton labelWidth="w-8" />
            </div>
          </div>
        ))}
      </div>
      <Skeleton className="h-[42px] w-[168px] self-start rounded-[12px]" />
    </div>
  );
}

/** Mirrors the Notifications tab: section label and the toggle card. */
export function SettingsNotificationsSkeleton() {
  return (
    <div
      className="flex flex-col gap-6"
      aria-busy="true"
      aria-live="polite"
    >
      <Skeleton className="mb-4 h-3 w-28" />
      <div className="flex items-center justify-between gap-4 rounded-[12px] border border-border bg-[#111115] px-4 py-4">
        <div className="flex-1">
          <Skeleton className="h-3.5 w-36" />
          <Skeleton className="mt-2 h-2.5 w-full max-w-[320px]" />
        </div>
        <Skeleton className="h-6 w-10 shrink-0 rounded-full" />
      </div>
    </div>
  );
}
