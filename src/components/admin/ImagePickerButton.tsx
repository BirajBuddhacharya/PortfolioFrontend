'use client';

import { useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Check, ClipboardPaste, ImagePlus, Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/components/ui/button';
import { Input } from '@/components/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/components/ui/dialog';
import { cn } from '@/components/lib/utils';
import { QueryKeys } from '../../lib/queryKeys';
import { useGallery, useUploadImage, type GalleryEntry } from '../../services/uploadService';
import { addButton, BORDER, MUTED } from './adminUi';

type SelectHandler = (url: string, entry?: GalleryEntry) => void;

export function ImagePickerButton({
  // `onSelect` is the primary prop; `onUploaded` is kept as a drop-in alias
  // for existing `ImageUploadButton` call sites.
  onSelect,
  onUploaded,
  buttonLabel = 'Browse',
  className,
}: {
  onSelect?: SelectHandler;
  onUploaded?: SelectHandler;
  buttonLabel?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const notify = onSelect ?? onUploaded;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm" className={cn(addButton, className)}>
          <ImagePlus size={12} className="mr-1" />
          {buttonLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl border-[#27272A] bg-[#0C0C0F] text-[#EDEDEF] sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="font-[family-name:var(--font-space-grotesk)] text-[16px]">
            Select image
          </DialogTitle>
        </DialogHeader>
        {/* Mounts only when the dialog opens, so the gallery fetch runs on demand. */}
        {open && (
          <PickerBody
            onPick={(url, entry) => {
              notify?.(url, entry);
              setOpen(false);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function PickerBody({ onPick }: { onPick: SelectHandler }) {
  const queryClient = useQueryClient();
  const upload = useUploadImage();
  const { data: items = [], isLoading } = useGallery();
  const fileRef = useRef<HTMLInputElement>(null);

  const [selected, setSelected] = useState<GalleryEntry | null>(null);
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState(false);

  const images = items.filter((i) => i.type === 'image');
  const filtered = query.trim()
    ? images.filter(
        (i) =>
          i.publicId.toLowerCase().includes(query.trim().toLowerCase()) ||
          (i.alt ?? '').toLowerCase().includes(query.trim().toLowerCase()),
      )
    : images;

  const invalidate = () => queryClient.invalidateQueries({ queryKey: [QueryKeys.GALLERY] });

  const uploadFile = async (file: File): Promise<GalleryEntry | null> => {
    try {
      const entry = await upload.mutateAsync(file);
      toast.success('Image uploaded');
      await invalidate();
      return entry;
    } catch {
      // apiClient interceptor already toasted the backend message
      return null;
    }
  };

  const handleFiles = async (files: FileList | File[] | null) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    let last: GalleryEntry | null = null;
    for (const file of Array.from(files)) {
      // eslint-disable-next-line no-await-in-loop
      last = await uploadFile(file);
    }
    setBusy(false);
    // Auto-select the last uploaded image so the user can confirm immediately.
    if (last) setSelected(last);
  };

  const handlePaste = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      for (const item of clipboardItems) {
        const imageType = item.types.find((t) => t.startsWith('image/'));
        if (imageType) {
          const blob = await item.getType(imageType);
          const ext = imageType.split('/')[1] ?? 'png';
          const file = new File([blob], `paste.${ext}`, { type: imageType });
          setBusy(true);
          const entry = await uploadFile(file);
          setBusy(false);
          if (entry) setSelected(entry);
          return;
        }
      }
      toast.error('No image in clipboard');
    } catch {
      toast.error('Clipboard access denied — allow clipboard permission and retry');
    }
  };

  const working = busy || upload.isPending;

  return (
    <div className="flex flex-col gap-3">
      {/* Toolbar: search + upload + paste */}
      <div className="flex flex-wrap items-center gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search gallery…"
          className="h-8 max-w-[220px] flex-1 border-[#27272A] bg-[#131317] font-mono text-[12px] shadow-none placeholder:text-[#3F3F46] focus-visible:ring-0"
        />
        <div className="ml-auto flex gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={async (e) => {
              await handleFiles(e.target.files);
              if (fileRef.current) fileRef.current.value = '';
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={working}
            onClick={() => fileRef.current?.click()}
            className={cn(addButton)}
          >
            {working ? <Loader2 size={12} className="mr-1 animate-spin" /> : <Upload size={12} className="mr-1" />}
            Upload
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={working}
            onClick={handlePaste}
            className={cn(addButton)}
          >
            <ClipboardPaste size={12} className="mr-1" />
            Paste
          </Button>
        </div>
      </div>

      {/* Gallery grid */}
      <div
        className="min-h-[320px] h-130 max-h-[60vh] overflow-y-auto rounded-[12px] border p-3"
        style={{ borderColor: BORDER, background: '#09090B' }}
      >
        {isLoading ? (
          <div className="flex h-[220px] items-center justify-center gap-2 font-mono text-[12px] text-[#6E6E78]">
            <Loader2 size={14} className="animate-spin" /> Loading gallery…
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex h-[220px] flex-col items-center justify-center gap-2 font-mono text-[12px]" style={{ color: MUTED }}>
            {images.length === 0 ? 'no images yet — upload or paste one above' : 'no matches for this search'}
          </div>
        ) : (
          <div className="grid gap-2.5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}>
            {filtered.map((item) => {
              const active = selected?.id === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelected((s) => (s?.id === item.id ? null : item))}
                  onDoubleClick={() => onPick(item.url, item)}
                  title={item.publicId}
                  className={cn(
                    'group relative overflow-hidden rounded-[10px] border transition-all',
                    active ? 'border-[#FF6B6B]' : 'border-[#27272A] hover:border-[#52525B]',
                  )}
                  style={{ aspectRatio: '4/3', background: '#111113' }}
                >
                  <img
                    src={item.url}
                    alt={item.alt ?? item.publicId}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {active && (
                    <span className="absolute right-1.5 top-1.5 flex size-5 items-center justify-center rounded-full bg-[#FF6B6B] text-[#111]">
                      <Check size={13} strokeWidth={3} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected preview + confirm */}
      <div className="flex items-center gap-3">
        {selected ? (
          <>
            <img
              src={selected.url}
              alt=""
              className="h-10 w-16 rounded-md border border-[#27272A] object-cover"
            />
            <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-[#A1A1AA]">
              {selected.publicId}
            </span>
          </>
        ) : (
          <span className="flex-1 font-mono text-[11px] text-[#45454E]">
            {working ? 'uploading…' : 'click an image to select, double-click to insert'}
          </span>
        )}
        <Button
          type="button"
          size="sm"
          disabled={!selected || working}
          onClick={() => selected && onPick(selected.url, selected)}
          className="h-8 font-mono text-[12px] font-semibold"
        >
          Insert image
        </Button>
      </div>
    </div>
  );
}
