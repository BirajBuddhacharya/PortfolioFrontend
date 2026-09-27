'use client';

import { motion } from 'framer-motion';
import { FileText, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useGallery, useDeleteGalleryItem } from '../../../../services/uploadService';
import { QueryKeys } from '../../../../lib/queryKeys';
import { BORDER, MUTED, TEXT, mono, SectionLabel, ConfirmDelete } from '../../../../components/admin/adminUi';
import { ImageUploadButton } from '../../../../components/admin/ImageUploadButton';

export default function AdminGalleryPage() {
  const { data: items = [], isLoading } = useGallery();
  const deleteItem = useDeleteGalleryItem();
  const queryClient = useQueryClient();

  const images = items.filter((i) => i.type === 'image');
  const pdfs = items.filter((i) => i.type === 'pdf');

  return (
    <div className="max-w-[1080px]">
      <div className="flex items-center justify-between mb-6">
        <SectionLabel>gallery</SectionLabel>
        <ImageUploadButton onUploaded={() => queryClient.invalidateQueries({ queryKey: [QueryKeys.GALLERY] })} />
      </div>

      {isLoading && (
        <div className="text-[13px] py-8" style={{ fontFamily: mono, color: MUTED }}>Loading…</div>
      )}

      {images.length > 0 && (
        <div className="mb-8">
          <div className="text-[10.5px] uppercase tracking-[0.1em] mb-3" style={{ fontFamily: mono, color: MUTED }}>
            Images ({images.length})
          </div>
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
            {images.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group relative rounded-[12px] overflow-hidden border"
                style={{ borderColor: BORDER, background: '#0C0C0F', aspectRatio: '4/3' }}
              >
                {/* Use img tag since CldImage requires cloud name env var to be set */}
                {/* ponytail: plain <img> — swap to CldImage once NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is set */}
                <img
                  src={item.url}
                  alt={item.alt ?? item.publicId}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-end p-2 gap-2">
                  <button
                    type="button"
                    onClick={() => { navigator.clipboard.writeText(item.url); toast.success('URL copied'); }}
                    className="text-[10px] px-2 py-1 rounded bg-white/10 text-white font-mono"
                  >
                    copy url
                  </button>
                  <ConfirmDelete
                    title="Delete this image?"
                    description="Removes the record. The Cloudinary asset is not deleted."
                    onConfirm={() => deleteItem.mutate(item.id)}
                    disabled={deleteItem.isPending}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {pdfs.length > 0 && (
        <div>
          <div className="text-[10.5px] uppercase tracking-[0.1em] mb-3" style={{ fontFamily: mono, color: MUTED }}>
            Documents ({pdfs.length})
          </div>
          <div className="flex flex-col gap-2">
            {pdfs.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-4 rounded-[12px] border"
                style={{ borderColor: BORDER, background: '#0C0C0F' }}
              >
                <FileText size={18} style={{ color: '#FF6B6B', flexShrink: 0 }} />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] truncate" style={{ color: TEXT }}>{item.publicId}</div>
                  {item.bytes && (
                    <div className="text-[11px] mt-0.5" style={{ fontFamily: mono, color: MUTED }}>
                      {(item.bytes / 1024).toFixed(0)} KB
                    </div>
                  )}
                </div>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] px-3 py-1.5 rounded-[7px] border"
                  style={{ fontFamily: mono, color: '#FF6B6B', borderColor: 'rgba(255,107,107,0.3)' }}
                >
                  view
                </a>
                <ConfirmDelete
                  title="Delete this PDF?"
                  description="Removes the record. The Cloudinary asset is not deleted."
                  onConfirm={() => deleteItem.mutate(item.id)}
                  disabled={deleteItem.isPending}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {!isLoading && items.length === 0 && (
        <div className="py-24 flex flex-col items-center gap-4">
          <ImageIcon size={40} style={{ color: MUTED, opacity: 0.3 }} />
          <div className="text-[13px]" style={{ fontFamily: mono, color: MUTED }}>no uploads yet</div>
        </div>
      )}
    </div>
  );
}
