"use client";

import { useEffect, useState } from "react";
import { Pencil, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/components/ui/button";
import { Badge } from "@/components/components/ui/badge";
import { Input } from "@/components/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/components/ui/dialog";
import { Prose } from "../../../../components/Prose";
import { Toc } from "../../../../components/Toc";
import {
  useProjects,
  useDeleteProject,
  useUpdateProject,
} from "../../../../services/projectsService";
import { Skeleton } from "@/components/components/ui/skeleton";
import {
  BORDER,
  TEXT,
  TEXT2,
  MUTED,
  ACCENT,
  mono,
  heading,
  formField,
  newButton,
  tableHead,
  rowButton,
  SectionLabel,
  StatusSelect,
  ConfirmDelete,
  AdminPagination,
} from "../../../../components/admin/adminUi";
import { cn } from "@/components/lib/utils";
import type { Project } from "../../../../types/project";
import { ProjectStatus } from "../../../../types/project";

const PROJECT_STATUSES = [ProjectStatus.ACTIVE, ProjectStatus.ARCHIVED];
const SIZE = 10;

export default function AdminProjectsPage() {
  const deleteProject = useDeleteProject();
  const updateProject = useUpdateProject();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [preview, setPreview] = useState<Project | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  const { data, isPending } = useProjects({
    search: debouncedSearch,
    status: statusFilter,
    page,
    size: SIZE,
  });
  const projects = data?.result ?? [];
  const total = data?.total ?? 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <SectionLabel>all projects</SectionLabel>
        <Button asChild variant="outline" size="sm" className={newButton}>
          <Link href="/admin/projects/new">+ New project</Link>
        </Button>
      </div>

      {/* Search + filter */}
      <div className="flex gap-3 mb-4 items-center flex-wrap">
        <Input
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={cn(
            formField,
            "h-auto px-3 py-[7px] text-[13px] max-w-[220px]",
          )}
        />
        <div className="flex gap-1">
          {["all", ...PROJECT_STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className="px-3 py-[5px] rounded-[7px] text-[11px] border transition-colors duration-150 cursor-pointer"
              style={{
                fontFamily: mono,
                background:
                  statusFilter === s ? "rgba(255,107,107,0.12)" : "transparent",
                borderColor:
                  statusFilter === s ? "rgba(255,107,107,0.4)" : BORDER,
                color: statusFilter === s ? "#FF6B6B" : MUTED,
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div
        className="rounded-[16px] border overflow-hidden"
        style={{ borderColor: BORDER }}
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-white/[0.02] hover:bg-white/[0.02]">
              {["Project", "Tags", "Year", "Status", "Actions"].map((h) => (
                <TableHead key={h} className={tableHead}>
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending &&
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="px-5 py-[14px]">
                    <Skeleton className="h-4 w-[140px]" />
                  </TableCell>
                  <TableCell className="px-5 py-[14px]">
                    <Skeleton className="h-4 w-[70px]" />
                  </TableCell>
                  <TableCell className="px-5 py-[14px]">
                    <Skeleton className="h-4 w-[40px]" />
                  </TableCell>
                  <TableCell className="px-5 py-[14px]">
                    <Skeleton className="h-6 w-[70px] rounded-full" />
                  </TableCell>
                  <TableCell className="px-5 py-[14px]">
                    <Skeleton className="h-7 w-[60px]" />
                  </TableCell>
                </TableRow>
              ))}
            {!isPending && projects.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-16">
                  <div className="flex flex-col items-center gap-3">
                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                      <rect
                        x="3"
                        y="3"
                        width="30"
                        height="30"
                        rx="6"
                        stroke="#26262B"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M10 13h16M10 18h16M10 23h10"
                        stroke="#3F3F46"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span
                      className="text-[12px]"
                      style={{ fontFamily: mono, color: MUTED }}
                    >
                      {search || statusFilter !== "all"
                        ? "no matching projects"
                        : "no projects yet — add one above"}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {!isPending &&
              projects.map((p) => (
                <TableRow
                  key={p.id}
                  className="cursor-pointer"
                  onClick={() => setPreview(p)}
                >
                  <TableCell
                    className="px-5 py-[14px] text-[13.5px] font-medium"
                    style={{ color: TEXT }}
                  >
                    {p.title}
                  </TableCell>
                  <TableCell className="px-5 py-[14px]">
                    <div className="flex flex-wrap gap-[5px]">
                      {p.tags?.length ? (
                        p.tags.map((t) => (
                          <Badge
                            key={t.id}
                            variant="outline"
                            className="border-border bg-white/[0.04] px-[9px] py-[3px] font-mono text-[10.5px] font-normal text-[#A1A1AA]"
                          >
                            {t.name}
                          </Badge>
                        ))
                      ) : (
                        <span
                          style={{
                            fontFamily: mono,
                            color: MUTED,
                            fontSize: "12.5px",
                          }}
                        >
                          —
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell
                    className="px-5 py-[14px] text-[12.5px]"
                    style={{ fontFamily: mono, color: MUTED }}
                  >
                    {p.year ?? "—"}
                  </TableCell>
                  <TableCell className="px-5 py-[14px]">
                    <StatusSelect
                      status={p.status}
                      options={PROJECT_STATUSES}
                      disabled={updateProject.isPending}
                      onValueChange={(val) =>
                        updateProject.mutate({
                          id: p.id,
                          status: val as ProjectStatus,
                        })
                      }
                    />
                  </TableCell>
                  <TableCell
                    className="px-5 py-[14px]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex gap-2">
                      <Button
                        asChild
                        variant="outline"
                        size="xs"
                        className={cn(rowButton, "px-2")}
                      >
                        <Link href={`/admin/projects/${p.slug}/edit`}>
                          <Pencil size={13} />
                        </Link>
                      </Button>
                      <ConfirmDelete
                        title="Delete this project?"
                        description={`"${p.title}" will be removed from your portfolio. This can't be undone.`}
                        disabled={deleteProject.isPending}
                        onConfirm={() => deleteProject.mutate(p.id)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <AdminPagination
        page={page}
        total={total}
        size={SIZE}
        onPageChange={setPage}
      />

      {/* Preview modal — full public view */}
      <Dialog
        open={!!preview}
        onOpenChange={(open) => !open && setPreview(null)}
      >
        <DialogContent
          className="h-[90vh] bg-[#09090B] border-white/[0.08] p-0 overflow-hidden rounded-[20px] flex flex-col"
          style={{ maxWidth: "1400px", width: "95vw" }}
        >
          {preview && (
            <>
              {/* Top bar */}
              <div
                className="flex items-center justify-between px-7 py-3 border-b shrink-0"
                style={{ borderColor: BORDER, background: "#0C0C0F" }}
              >
                <div className="flex items-center gap-3">
                  <DialogTitle
                    className="text-[13px] font-medium"
                    style={{ fontFamily: mono, color: MUTED }}
                  >
                    preview
                  </DialogTitle>
                  <span
                    className="text-[10px] px-[8px] py-[2px] rounded-full border"
                    style={{
                      fontFamily: mono,
                      background:
                        preview.status === ProjectStatus.ACTIVE
                          ? "rgba(16,185,129,0.1)"
                          : "rgba(255,255,255,0.04)",
                      borderColor:
                        preview.status === ProjectStatus.ACTIVE
                          ? "rgba(16,185,129,0.25)"
                          : BORDER,
                      color:
                        preview.status === ProjectStatus.ACTIVE
                          ? "#10B981"
                          : MUTED,
                    }}
                  >
                    {preview.status}
                  </span>
                </div>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className={cn(rowButton, "gap-1.5")}
                >
                  <Link href={`/projects/${preview.slug}`} target="_blank">
                    <ExternalLink size={12} /> Open public page
                  </Link>
                </Button>
              </div>

              {/* Scrollable content */}
              <div
                className="flex-1 overflow-y-auto"
                style={{ color: "#EDEDEF" }}
              >
                <div className="max-w-[1220px] mx-auto px-8 pt-12 pb-16">
                  <div className="grid gap-12 lg:grid-cols-[200px_minmax(0,1fr)]">
                    <Toc
                      content={preview.content ?? ""}
                      className="hidden lg:block"
                    />
                    <div className="min-w-0">
                      <h1
                        className="mb-[18px]"
                        style={{
                          fontFamily: heading,
                          fontSize: "clamp(32px, 5vw, 62px)",
                          lineHeight: 1.02,
                          letterSpacing: "-0.04em",
                          fontWeight: 600,
                          color: "#EDEDEF",
                          margin: "0 0 18px",
                        }}
                      >
                        {preview.title}
                      </h1>

                      {[preview.year, preview.status].filter(Boolean).length >
                        0 && (
                        <div className="flex flex-wrap gap-2 mb-5">
                          {[preview.year, preview.status]
                            .filter(Boolean)
                            .map((m) => (
                              <span
                                key={m}
                                className="text-[11px] uppercase tracking-[0.1em] px-[10px] py-[5px] rounded-[8px] border"
                                style={{
                                  fontFamily: mono,
                                  color: "#8A8A93",
                                  borderColor: "rgba(255,255,255,0.09)",
                                }}
                              >
                                {m}
                              </span>
                            ))}
                        </div>
                      )}

                      {preview.summary && (
                        <p
                          className="text-[17px] leading-[1.7] mb-[26px] max-w-[60ch]"
                          style={{ color: "#A1A1AA" }}
                        >
                          {preview.summary}
                        </p>
                      )}

                      {(preview.live || preview.repo) && (
                        <div className="flex gap-[10px] flex-wrap mb-[34px]">
                          {preview.live && (
                            <a
                              href={preview.live}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-5 py-[11px] rounded-[10px] text-[12.5px] font-semibold"
                              style={{
                                background: "#FF6B6B",
                                color: "#12080A",
                                fontFamily: mono,
                              }}
                            >
                              Live site ↗
                            </a>
                          )}
                          {preview.repo && (
                            <a
                              href={preview.repo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-5 py-[11px] rounded-[10px] text-[12.5px] border border-white/[0.14]"
                              style={{ color: "#EDEDEF", fontFamily: mono }}
                            >
                              GitHub ↗
                            </a>
                          )}
                        </div>
                      )}

                      {preview.metrics?.length > 0 && (
                        <div
                          className="grid gap-[1px] border border-white/[0.08] rounded-[18px] overflow-hidden mb-[48px]"
                          style={{
                            gridTemplateColumns:
                              "repeat(auto-fit, minmax(160px, 1fr))",
                            background: "rgba(255,255,255,0.08)",
                          }}
                        >
                          {preview.metrics.map((m, i) => (
                            <div
                              key={i}
                              className="p-[24px]"
                              style={{ background: "#0C0C0F" }}
                            >
                              <div
                                className="text-[28px] font-semibold mb-1"
                                style={{
                                  fontFamily: heading,
                                  letterSpacing: "-0.03em",
                                  color: "#FF6B6B",
                                }}
                              >
                                {m.value}
                              </div>
                              <div
                                className="text-[11px] uppercase tracking-[0.06em]"
                                style={{ fontFamily: mono, color: "#8A8A93" }}
                              >
                                {m.label}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {preview.content && (
                        <div className="mb-[48px]">
                          <Prose>{preview.content}</Prose>
                        </div>
                      )}

                      {preview.tags?.length > 0 && (
                        <div className="mb-[48px]">
                          <div
                            className="text-[12px] uppercase tracking-[0.1em] mb-4"
                            style={{ fontFamily: mono, color: "#FF6B6B" }}
                          >
                            tags
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {preview.tags.map((t) => (
                              <span
                                key={t.id}
                                className="text-[12.5px] px-[14px] py-2 rounded-[8px] border border-white/[0.08]"
                                style={{
                                  fontFamily: mono,
                                  color: "#C7C7CE",
                                  background: "rgba(255,255,255,0.05)",
                                }}
                              >
                                {t.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
