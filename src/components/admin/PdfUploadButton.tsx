'use client';

import { useRef } from 'react';
import { FileUp } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/components/ui/button';
import { useUploadPdf } from '../../services/uploadService';
import { cn } from '@/components/lib/utils';
import { addButton } from './adminUi';

export function PdfUploadButton({
  onUploaded,
  className,
}: {
  onUploaded: (url: string, publicId: string) => void;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const upload = useUploadPdf();

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const entry = await upload.mutateAsync(file);
      onUploaded(entry.url, entry.publicId);
      toast.success('PDF uploaded');
    } catch {
      toast.error('Upload failed');
    }
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
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
        <FileUp size={12} className="mr-1" />
        {upload.isPending ? 'Uploading…' : 'Upload PDF'}
      </Button>
    </>
  );
}
