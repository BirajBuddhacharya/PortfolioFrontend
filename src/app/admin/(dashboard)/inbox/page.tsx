'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Inbox, CheckCheck, Trash2 } from 'lucide-react';
import { Button } from '@/components/components/ui/button';
import { Badge } from '@/components/components/ui/badge';
import { Card } from '@/components/components/ui/card';
import { Checkbox } from '@/components/components/ui/checkbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/components/ui/alert-dialog';
import { cn } from '@/components/lib/utils';
import { useAdminInbox, useMarkMessageRead, useDeleteMessage } from '../../../../services/adminService';
import { ACCENT, BORDER, MUTED, TEXT, TEXT2, mono, heading, ConfirmDelete, type InboxMsg } from '../../../../components/admin/adminUi';

export default function AdminInboxPage() {
  const { data: msgs = [], isLoading } = useAdminInbox();
  const [selected, setSelected] = useState<InboxMsg | null>(null);
  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());
  const markRead = useMarkMessageRead();
  const deleteMessage = useDeleteMessage();

  useEffect(() => {
    if (selected && !selected.read) markRead.mutate(selected.id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id]);

  const unreadCount = msgs.filter((m) => !m.read).length;
  const allChecked = msgs.length > 0 && checkedIds.size === msgs.length;

  const toggleCheck = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCheckedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (allChecked) setCheckedIds(new Set());
    else setCheckedIds(new Set(msgs.map((m) => m.id)));
  };

  const handleBulkMarkRead = async () => {
    const unread = msgs.filter((m) => checkedIds.has(m.id) && !m.read);
    await Promise.all(unread.map((m) => markRead.mutateAsync(m.id)));
    setCheckedIds(new Set());
  };

  const handleBulkDelete = async () => {
    const ids = [...checkedIds];
    if (selected && checkedIds.has(selected.id)) setSelected(null);
    await Promise.all(ids.map((id) => deleteMessage.mutateAsync(id)));
    setCheckedIds(new Set());
  };

  const hasSelection = checkedIds.size > 0;
  const isPending = markRead.isPending || deleteMessage.isPending;

  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:h-[580px]">

      {/* List panel */}
      <Card className={cn(
        'sm:w-[280px] sm:shrink-0 flex flex-col gap-0 overflow-hidden rounded-[16px] border-border bg-[#111115] p-0 shadow-none',
        selected ? 'hidden sm:flex' : 'flex',
      )}>
        {/* Header — swaps to action bar when rows are selected */}
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: BORDER }}>
          {hasSelection ? (
            <>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={allChecked}
                  onCheckedChange={toggleAll}
                  className="border-[#3F3F46] data-[state=checked]:bg-[#FF6B6B] data-[state=checked]:border-[#FF6B6B]"
                />
                <span className="text-[12px] font-medium" style={{ color: TEXT }}>
                  {checkedIds.size} selected
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={isPending}
                  title="Mark as read"
                  className="h-7 w-7 rounded-[8px] text-[#6E6E78] hover:text-[#A1A1AA] hover:bg-white/[0.04]"
                  onClick={handleBulkMarkRead}
                >
                  <CheckCheck size={14} strokeWidth={1.6} />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={isPending}
                      title="Delete selected"
                      className="h-7 w-7 rounded-[8px] text-[#6E6E78] hover:text-destructive hover:bg-destructive/[0.08]"
                    >
                      <Trash2 size={14} strokeWidth={1.6} />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete {checkedIds.size} message{checkedIds.size > 1 ? 's' : ''}?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently remove the selected messages. This can't be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction variant="destructive" onClick={handleBulkDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </>
          ) : (
            <>
              <span className="text-[12px] font-medium" style={{ color: TEXT }}>Inbox</span>
              {unreadCount > 0 && (
                <Badge className="px-2 py-[2px] font-mono text-[10px] font-normal text-[#111]">
                  {unreadCount}
                </Badge>
              )}
            </>
          )}
        </div>

        {/* Message list */}
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            [0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-2 border-b border-border px-3 py-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-[6px]">
                    <div className="h-3 w-28 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.08)' }} />
                    <div className="h-2.5 w-10 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.06)' }} />
                  </div>
                  <div className="h-2.5 w-40 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.05)' }} />
                </div>
              </div>
            ))
          ) : msgs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 py-12 px-4">
              <Inbox size={32} style={{ color: MUTED, opacity: 0.4 }} />
              <span className="text-[12px] text-center" style={{ fontFamily: mono, color: MUTED }}>
                no messages
              </span>
            </div>
          ) : (
            msgs.map((m) => (
              <div
                key={m.id}
                className={cn(
                  'group flex items-start gap-2 border-b border-border px-3 py-3 transition-colors duration-150',
                  selected?.id === m.id ? 'bg-[#FF6B6B]/[0.06]' : 'hover:bg-white/[0.03]',
                  checkedIds.has(m.id) && 'bg-white/[0.03]',
                )}
              >
                {/* Checkbox — visible on hover or when checked */}
                <div
                  className={cn(
                    'pt-[2px] shrink-0 transition-opacity duration-150',
                    checkedIds.has(m.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
                  )}
                  onClick={(e) => toggleCheck(m.id, e)}
                >
                  <Checkbox
                    checked={checkedIds.has(m.id)}
                    className="border-[#3F3F46] data-[state=checked]:bg-[#FF6B6B] data-[state=checked]:border-[#FF6B6B]"
                  />
                </div>

                {/* Row body */}
                <button
                  type="button"
                  className="flex-1 min-w-0 text-left bg-transparent border-none p-0 cursor-pointer"
                  onClick={() => setSelected(m)}
                >
                  <div className="flex items-center justify-between mb-[3px]">
                    <span className="text-[13px] font-medium truncate" style={{ color: m.read ? TEXT2 : TEXT }}>
                      {!m.read && (
                        <span
                          className="inline-block w-[6px] h-[6px] rounded-full mr-2 align-middle"
                          style={{ background: ACCENT }}
                        />
                      )}
                      {m.name}
                    </span>
                    <span className="text-[10px] shrink-0 ml-2" style={{ fontFamily: mono, color: MUTED }}>{m.time}</span>
                  </div>
                  <div className="text-[12px] truncate" style={{ color: MUTED }}>{m.subject}</div>
                </button>
              </div>
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
            className="flex-1 min-w-0 min-h-[480px] sm:min-h-0"
          >
            <Card className="flex h-full flex-col gap-0 overflow-hidden rounded-[16px] border-border bg-[#111115] p-0 shadow-none">
              <div className="px-6 py-5 border-b" style={{ borderColor: BORDER }}>
                <button
                  className="sm:hidden flex items-center gap-1 text-[11.5px] mb-3 cursor-pointer bg-transparent border-none p-0"
                  style={{ fontFamily: mono, color: MUTED }}
                  onClick={() => setSelected(null)}
                >
                  ← back
                </button>
                <div className="text-[17px] font-semibold mb-1" style={{ fontFamily: heading, color: TEXT }}>{selected.subject}</div>
                <div className="flex flex-wrap items-center gap-2 text-[12px]" style={{ fontFamily: mono, color: MUTED }}>
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
