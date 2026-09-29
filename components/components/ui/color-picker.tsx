'use client';

import { useEffect, useRef, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Input } from './input';
import { cn } from '@/components/lib/utils';

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

export function ColorPicker({ value, onChange, label, className }: ColorPickerProps) {
  const [hex, setHex] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setHex(value); }, [value]);

  const handleHex = (raw: string) => {
    setHex(raw);
    if (/^#[0-9A-Fa-f]{6}$/.test(raw)) onChange(raw);
  };

  const handleNative = (val: string) => {
    onChange(val);
    setHex(val);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'flex items-center gap-1.5 rounded-md border border-border px-2 py-1 font-mono text-[12px] hover:bg-white/[0.03] transition-colors',
            className,
          )}
        >
          <span
            className="inline-block size-3.5 shrink-0 rounded-sm border border-white/10"
            style={{ background: value }}
          />
          <span className="text-[#A1A1AA]">{value}</span>
          {label && <span className="text-[#6E6E78]">· {label}</span>}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] gap-0 border-border bg-[#111115] p-3" align="start">
        <div className="flex flex-col gap-2">
          <div
            className="h-[96px] w-full cursor-pointer rounded-md border border-white/10"
            style={{ background: value }}
            onClick={() => inputRef.current?.click()}
          />
          <input
            ref={inputRef}
            type="color"
            value={value}
            onChange={(e) => handleNative(e.target.value)}
            className="sr-only"
          />
          <Input
            value={hex}
            onChange={(e) => handleHex(e.target.value)}
            placeholder="#000000"
            maxLength={7}
            className="h-8 font-mono text-[12px]"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
