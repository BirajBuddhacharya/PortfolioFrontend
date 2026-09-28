'use client';

import { useRef } from 'react';
import { Upload, Clipboard } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/components/ui/button';
import { useUploadImage } from '../../services/uploadService';
import { cn } from '@/components/lib/utils';
import { addButton } from './adminUi';

export function ImageUploadButton({
  onUploaded,
  className,
}: {
  onUploaded: (url: string, publicId: string) => void;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const upload = useUploadImage();

  const handleFile = async (file: File) => {
    try {
      const entry = await upload.mutateAsync(file);
      onUploaded(entry.url, entry.publicId);
      toast.success('Image uploaded');
    } catch {
      toast.error('Upload failed');
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await handleFile(file);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handlePaste = async () => {
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        const imageType = item.types.find((t) => t.startsWith('image/'));
        if (imageType) {
          const blob = await item.getType(imageType);
          const file = new File([blob], `paste.${imageType.split('/')[1]}`, { type: imageType });
          await handleFile(file);
          return;
        }
      }
      toast.error('No image in clipboard');
    } catch {
      toast.error('Clipboard access denied');
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={upload.isPending}
        onClick={() => inputRef.current?.click()}
        className={cn(addButton, className)}
      >
        <Upload size={12} className="mr-1" />
        {upload.isPending ? 'Uploading…' : 'Upload'}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={upload.isPending}
        onClick={handlePaste}
        className={cn(addButton, className)}
      >
        <Clipboard size={12} className="mr-1" />
        Paste
      </Button>
    </>
  );
}
