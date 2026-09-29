'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Inbox } from 'lucide-react';
import { Button } from '@/components/components/ui/button';
import { Badge } from '@/components/components/ui/badge';
import { Card } from '@/components/components/ui/card';
import { cn } from '@/components/lib/utils';
import { useAdminInbox, useMarkMessageRead, useDeleteMessage } from '../../../../services/adminService';
import { ACCENT, BORDER, MUTED, TEXT, TEXT2, mono, heading, ConfirmDelete, type InboxMsg } from '../../../../components/admin/adminUi';

export default function AdminInboxPage() {
  const { data: msgs = [] } = useAdminInbox();
  const [selected, setSelected] = useState<InboxMsg | null>(null);
  const markRead = useMarkMessageRead();
  const deleteMessage = useDeleteMessage();

  useEffect(() => {
    if (!selected && msgs.length > 0) setSelected(msgs[0]);
  }, [msgs, selected]);

  useEffect(() => {
    if (selected && !selected.read) markRead.mutate(selected.id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id]);

  const unreadCount = msgs.filter((m) => !m.read).length;

  return (
    <div className="flex gap-4 h-[580px]">

      {/* List panel */}
      <Card className="w-[280px] shrink-0 flex flex-col gap-0 overflow-hidden rounded-[16px] border-border bg-[#111115] p-0 shadow-none">
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: BORDER }}>
          <span className="text-[12px] font-medium" style={{ color: TEXT }}>Inbox</span>
          {unreadCount > 0 && (
            <Badge className="px-2 py-[2px] font-mono text-[10px] font-normal text-[#111]">
              {unreadCount}
            </Badge>
          )}
        </div>
        <div className="flex-1 overflow-auto">
          {msgs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 py-12 px-4">
              <Inbox size={32} style={{ color: MUTED, opacity: 0.4 }} />
              <span className="text-[12px] text-center" style={{ fontFamily: mono, color: MUTED }}>
                no messages
              </span>
            </div>
          ) : (
            msgs.map((m) => (
              <Button
                key={m.id}
                type="button"
                variant="ghost"
                onClick={() => setSelected(m)}
                className={cn(
                  'h-auto w-full flex-col items-stretch gap-1 rounded-none border-b border-border px-4 py-3 text-left font-normal',
                  selected?.id === m.id ? 'bg-[#FF6B6B]/[0.06] hover:bg-[#FF6B6B]/[0.06]' : 'hover:bg-white/[0.03]',
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-[13px] font-medium truncate"
                    style={{ color: m.read ? TEXT2 : TEXT }}
                  >
                    {!m.read && <span className="inline-block w-[6px] h-[6px] rounded-full mr-2 align-middle" style={{ background: ACCENT }} />}
                    {m.name}
                  </span>
                  <span className="text-[10px] shrink-0 ml-2" style={{ fontFamily: mono, color: MUTED }}>{m.time}</span>
                </div>
                <div className="text-[12px] truncate text-left" style={{ color: MUTED }}>{m.subject}</div>
              </Button>
            ))
          )}
        </div>
      </Card>

      {/* Detail panel */}
      <AnimatePresence mode="wait">
        {selected ? (
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.25 }}
            className="flex-1 min-w-0"
          >
            <Card className="flex h-full flex-col gap-0 overflow-hidden rounded-[16px] border-border bg-[#111115] p-0 shadow-none">
              <div className="px-6 py-5 border-b" style={{ borderColor: BORDER }}>
                <div className="text-[17px] font-semibold mb-1" style={{ fontFamily: heading, color: TEXT }}>{selected.subject}</div>
                <div className="flex items-center gap-2 text-[12px]" style={{ fontFamily: mono, color: MUTED }}>
                  <span>{selected.name}</span>
                  <span>·</span>
                  <span>{selected.email}</span>
                  <span>·</span>
                  <span>{selected.time}</span>
                </div>
              </div>
              <div className="flex-1 px-6 py-5 overflow-auto text-[14px] leading-relaxed" style={{ color: TEXT2 }}>
                {selected.body}
              </div>
              <div className="px-6 py-4 border-t flex gap-2" style={{ borderColor: BORDER }}>
                <ConfirmDelete
                  title="Delete this message?"
                  description={`The message from ${selected.name} will be permanently removed. This can't be undone.`}
                  disabled={deleteMessage.isPending}
                  className="px-4 py-2 text-[12px]"
                  onConfirm={() => {
                    if (!selected) return;
                    const id = selected.id;
                    setSelected(msgs.find((m) => m.id !== id) ?? null);
                    deleteMessage.mutate(id);
                  }}
                />
              </div>
            </Card>
          </motion.div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            {msgs.length === 0 ? (
              <>
                <Inbox size={40} style={{ color: MUTED, opacity: 0.25 }} />
                <div className="text-center">
                  <div className="text-[14px] mb-1" style={{ fontFamily: heading, color: TEXT2 }}>Inbox is empty</div>
                  <div className="text-[12px]" style={{ fontFamily: mono, color: MUTED }}>Messages from your contact form appear here.</div>
                </div>
              </>
            ) : (
              <span className="text-[13px]" style={{ fontFamily: mono, color: MUTED }}>select a message</span>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
