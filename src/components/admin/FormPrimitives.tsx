'use client';

import { useState, type KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/components/ui/input';
import { Button } from '@/components/components/ui/button';
import { Badge } from '@/components/components/ui/badge';
import { cn } from '@/components/lib/utils';

/** Borderless Notion-style field: reveals a surface only on hover/focus. */
export const field =
  'h-8 rounded-md border-transparent bg-transparent px-2 text-[14px] shadow-none ' +
  'transition-colors hover:bg-white/[0.04] placeholder:text-[#45454E] ' +
  'focus-visible:bg-[#131317] focus-visible:border-white/10 focus-visible:ring-0';

/** A Notion page-property row: icon + label on the left, editor on the right. */
export function Row({
  icon: Icon,
  label,
  children,
  align = 'center',
  labelWidth = 168,
}: {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  children: React.ReactNode;
  align?: 'center' | 'start';
  labelWidth?: number;
}) {
  return (
    <div
      className={cn(
        'grid gap-3 rounded-lg px-2 py-1 transition-colors hover:bg-white/[0.022]',
        align === 'center' ? 'items-center' : 'items-start',
      )}
      style={{ gridTemplateColumns: `minmax(${Math.min(labelWidth, 140)}px, ${labelWidth}px) 1fr` }}
    >
      <div
        className="flex select-none items-center gap-2 text-[12.5px] text-[#6E6E78]"
        style={{ paddingTop: align === 'start' ? 9 : 0 }}
      >
        <Icon size={14} />
        <span>{label}</span>
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

/** Tag-style multi-value input: Enter or comma commits, Backspace removes the last. */
export function ChipInput({
  values,
  onChange,
  placeholder,
}: {
  values: string[];
  onChange: (next: string[]) => void;
  placeholder: string;
}) {
  const [draft, setDraft] = useState('');

  const commit = () => {
    const v = draft.trim();
    if (v && !values.includes(v)) onChange([...values, v]);
    setDraft('');
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      commit();
    } else if (e.key === 'Backspace' && !draft && values.length) {
      onChange(values.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 px-2 py-1">
      {values.map((v) => (
        <Badge
          key={v}
          variant="secondary"
          className="gap-1 rounded-md border-white/[0.08] bg-white/[0.05] py-0 pr-0.5 font-mono text-[11.5px] font-normal text-[#C7C7CE]"
        >
          {v}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onChange(values.filter((x) => x !== v))}
            aria-label={`Remove ${v}`}
            className="size-4 rounded-sm text-[#6E6E78] hover:bg-transparent hover:text-[#FF6B6B]"
          >
            <X size={11} />
          </Button>
        </Badge>
      ))}
      <Input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={commit}
        placeholder={values.length ? '' : placeholder}
        className={cn(field, 'h-7 min-w-[130px] flex-1 font-mono text-[13px] hover:bg-transparent')}
      />
    </div>
  );
}
