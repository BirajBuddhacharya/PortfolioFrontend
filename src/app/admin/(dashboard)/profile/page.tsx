"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/components/ui/button";
import { Input } from "@/components/components/ui/input";
import { Textarea } from "@/components/components/ui/textarea";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/components/ui/tabs";
import { Skeleton } from "@/components/components/ui/skeleton";
import { cn } from "@/components/lib/utils";
import {
  useAdminAbout,
  useUpdateProfile,
} from "../../../../services/adminService";
import {
  BORDER,
  MUTED,
  TEXT,
  mono,
  heading,
  formField,
  addButton,
  saveButton,
  rowDangerButton,
  SectionLabel,
} from "../../../../components/admin/adminUi";
import { ImagePickerButton } from "../../../../components/admin/ImagePickerButton";

const triggerCls =
  "justify-start rounded-[8px] px-3 py-[9px] text-[13px] font-normal text-left h-auto " +
  "data-[state=active]:bg-white/[0.06] data-[state=active]:text-[#EDEDEF] " +
  "data-[state=inactive]:text-[#6E6E78] hover:text-[#EDEDEF] transition-colors max-w-[99%]";

export default function AdminProfilePage() {
  return (
    <Tabs
      orientation="vertical"
      defaultValue="about"
      className="flex flex-col sm:flex-row gap-0 max-w-[860px]"
    >
      {/* Page-based tabs — one per public page that reads the profile. */}
      <TabsList
        variant="line"
        className="h-auto w-full sm:w-[160px] sm:shrink-0 flex-row sm:flex-col items-stretch gap-0.5 rounded-none bg-transparent p-0 overflow-x-auto border-b sm:border-b-0 sm:border-r pb-1 sm:pb-0 pr-0 sm:pr-3"
        style={{ borderColor: BORDER }}
      >
        <TabsTrigger
          value="about"
          className={cn(triggerCls, "shrink-0 sm:shrink")}
        >
          About page
        </TabsTrigger>
        <TabsTrigger
          value="home"
          className={cn(triggerCls, "shrink-0 sm:shrink")}
        >
          Home page
        </TabsTrigger>
        <TabsTrigger
          value="branding"
          className={cn(triggerCls, "shrink-0 sm:shrink")}
        >
          Branding
        </TabsTrigger>
      </TabsList>

      <div className="flex-1 pt-6 sm:pt-0 sm:pl-10">
        <TabsContent value="about">
          <AboutTab />
        </TabsContent>
        <TabsContent value="home">
          <HomeTab />
        </TabsContent>
        <TabsContent value="branding">
          <BrandingTab />
        </TabsContent>
      </div>
    </Tabs>
  );
}

// ── About page ────────────────────────────────────────────────────────────────

function AboutTab() {
  const { data: about, isLoading } = useAdminAbout();
  const updateProfile = useUpdateProfile();

  const [headline, setHeadline] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [facts, setFacts] = useState<{ k: string; v: string }[]>([]);
  const hydrated = useRef(false);

  useEffect(() => {
    if (about && !hydrated.current) {
      hydrated.current = true;
      setHeadline(about.headline ?? "");
      setCoverImage(about.coverImage ?? "");
      setParagraphs(about.paragraphs ?? []);
      setFacts(
        (about.facts ?? []).map((f) => ({ k: f.k ?? "", v: f.v ?? "" })),
      );
    }
  }, [about]);

  const handleSave = () => {
    updateProfile.mutate(
      {
        headline,
        coverImage: coverImage || undefined,
        paragraphs: paragraphs.filter((p) => p.trim()),
        facts: facts.filter((f) => f.k.trim() || f.v.trim()),
      },
      { onSuccess: () => toast.success("Saved") },
    );
  };

  if (isLoading) return <TabSkeleton />;

  return (
    <div className="flex flex-col gap-10">
      {/* ── Headline ── */}
      <div>
        <SectionLabel>page headline</SectionLabel>
        <Input
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          placeholder="e.g. ML engineer with a full-stack habit"
          className={cn(
            formField,
            "h-auto px-4 py-[10px] text-[15px] font-semibold tracking-[-0.02em] md:text-[15px]",
          )}
          style={{ fontFamily: heading }}
        />
        <div
          className="text-[11px] mt-2"
          style={{ fontFamily: mono, color: MUTED }}
        >
          The accent dot (.) is appended automatically on the public page.
        </div>
      </div>

      {/* ── Cover image ── */}
      <div>
        <SectionLabel>cover image</SectionLabel>
        <div className="flex gap-2 items-center">
          <Input
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="cover image"
            className={cn(formField, "flex-1 h-auto px-4 py-[10px]")}
          />
          <ImagePickerButton onUploaded={(url) => setCoverImage(url)} />
        </div>
        {coverImage && (
          <div
            className="mt-3 rounded-[12px] border overflow-hidden"
            style={{ borderColor: BORDER, maxWidth: 160, aspectRatio: "4/5" }}
          >
            <img
              src={coverImage}
              alt="cover preview"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        )}
      </div>

      {/* ── Bio paragraphs ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <SectionLabel>bio paragraphs</SectionLabel>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setParagraphs((prev) => [...prev, ""])}
            className={addButton}
          >
            + add paragraph
          </Button>
        </div>
        {paragraphs.length === 0 ? (
          <EmptyState>
            No bio paragraphs yet — add one to populate the About page.
          </EmptyState>
        ) : (
          <div className="flex flex-col gap-3">
            {paragraphs.map((p, i) => (
              <div key={i} className="flex gap-2 items-start">
                <Textarea
                  value={p}
                  onChange={(e) =>
                    setParagraphs((prev) =>
                      prev.map((x, j) => (j === i ? e.target.value : x)),
                    )
                  }
                  rows={3}
                  className={cn(
                    formField,
                    "flex-1 resize-none px-4 py-3 leading-relaxed",
                  )}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  onClick={() =>
                    setParagraphs((prev) => prev.filter((_, j) => j !== i))
                  }
                  className={cn(rowDangerButton, "mt-[1px] shrink-0 py-[7px]")}
                >
                  del
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Beyond the keyboard (facts) ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <SectionLabel>beyond the keyboard</SectionLabel>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setFacts((prev) => [...prev, { k: "", v: "" }])}
            className={addButton}
          >
            + add fact
          </Button>
        </div>
        {facts.length === 0 ? (
          <EmptyState>
            No facts yet — add one to show it under “Beyond the keyboard” on the
            About page.
          </EmptyState>
        ) : (
          <div className="flex flex-col gap-3">
            {facts.map((f, i) => (
              <div key={i} className="flex gap-3 items-center">
                <Input
                  value={f.k ?? ""}
                  onChange={(e) =>
                    setFacts((prev) =>
                      prev.map((row, j) =>
                        j === i ? { ...row, k: e.target.value } : row,
                      ),
                    )
                  }
                  placeholder="label"
                  className={cn(
                    formField,
                    "h-auto w-[180px] shrink-0 rounded-[9px] px-3 py-[8px] font-mono text-[12px] md:text-[12px]",
                  )}
                />
                <Input
                  value={f.v ?? ""}
                  onChange={(e) =>
                    setFacts((prev) =>
                      prev.map((row, j) =>
                        j === i ? { ...row, v: e.target.value } : row,
                      ),
                    )
                  }
                  placeholder="value"
                  className={cn(
                    formField,
                    "h-auto flex-1 rounded-[9px] px-3 py-[8px]",
                  )}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  onClick={() =>
                    setFacts((prev) => prev.filter((_, j) => j !== i))
                  }
                  className={cn(rowDangerButton, "shrink-0 py-[7px]")}
                >
                  del
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <SaveButton onClick={handleSave} pending={updateProfile.isPending} />
    </div>
  );
}

// ── Home page ─────────────────────────────────────────────────────────────────

function HomeTab() {
  const { data: about, isLoading } = useAdminAbout();
  const updateProfile = useUpdateProfile();

  const [stats, setStats] = useState<{ value: string; label: string }[]>([]);
  const [ticker, setTicker] = useState<string[]>([]);
  const [tickerInput, setTickerInput] = useState("");
  const hydrated = useRef(false);

  useEffect(() => {
    if (about && !hydrated.current) {
      hydrated.current = true;
      setStats(
        (about.stats ?? []).map((s) => ({
          value: s.value ?? "",
          label: s.label ?? "",
        })),
      );
      setTicker(about.ticker ?? []);
    }
  }, [about]);

  const addTickerItem = () => {
    const val = tickerInput.trim();
    if (!val || ticker.includes(val)) return;
    setTicker((prev) => [...prev, val]);
    setTickerInput("");
  };

  const removeTickerItem = (i: number) =>
    setTicker((prev) => prev.filter((_, j) => j !== i));

  const handleSave = () => {
    updateProfile.mutate(
      {
        stats: stats.filter((s) => s.value.trim() || s.label.trim()),
        ticker,
      },
      { onSuccess: () => toast.success("Saved") },
    );
  };

  if (isLoading) return <TabSkeleton />;

  return (
    <div className="flex flex-col gap-10">
      {/* ── Stats ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <SectionLabel>stats</SectionLabel>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setStats((prev) => [...prev, { value: "", label: "" }])
            }
            className={addButton}
          >
            + add stat
          </Button>
        </div>
        {stats.length === 0 ? (
          <EmptyState>
            No stats yet — add one to show it in the homepage stats strip.
          </EmptyState>
        ) : (
          <div className="flex flex-col gap-3">
            {stats.map((s, i) => (
              <div key={i} className="flex gap-3 items-center">
                <Input
                  value={s.value}
                  onChange={(e) =>
                    setStats((prev) =>
                      prev.map((row, j) =>
                        j === i ? { ...row, value: e.target.value } : row,
                      ),
                    )
                  }
                  placeholder="3+"
                  className={cn(
                    formField,
                    "h-auto w-[120px] shrink-0 rounded-[9px] px-3 py-[8px] font-mono text-[12px] md:text-[12px]",
                  )}
                />
                <Input
                  value={s.label}
                  onChange={(e) =>
                    setStats((prev) =>
                      prev.map((row, j) =>
                        j === i ? { ...row, label: e.target.value } : row,
                      ),
                    )
                  }
                  placeholder="years experience"
                  className={cn(
                    formField,
                    "h-auto flex-1 rounded-[9px] px-3 py-[8px]",
                  )}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  onClick={() =>
                    setStats((prev) => prev.filter((_, j) => j !== i))
                  }
                  className={cn(rowDangerButton, "shrink-0 py-[7px]")}
                >
                  del
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Ticker ── */}
      <div>
        <SectionLabel>ticker</SectionLabel>
        <div className="flex gap-2">
          <Input
            value={tickerInput}
            onChange={(e) => setTickerInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTickerItem();
              }
            }}
            placeholder="e.g. TypeScript"
            className={cn(formField, "flex-1 h-auto px-4 py-[10px]")}
          />
          <Button
            type="button"
            variant="outline"
            onClick={addTickerItem}
            className={addButton}
          >
            + add
          </Button>
        </div>
        {ticker.length === 0 ? (
          <div className="mt-3">
            <EmptyState>
              No ticker items yet — add skills to fill the marquee strip.
            </EmptyState>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 mt-3">
            {ticker.map((item, i) => (
              <span
                key={i}
                className="flex items-center gap-1.5 rounded-[8px] border px-3 py-[5px] font-mono text-[12px]"
                style={{
                  borderColor: "rgba(255,255,255,0.1)",
                  color: TEXT,
                  background: "#131317",
                }}
              >
                {item}
                <button
                  type="button"
                  onClick={() => removeTickerItem(i)}
                  className="opacity-50 hover:opacity-100 transition-opacity text-[10px] leading-none"
                  style={{ color: MUTED }}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <SaveButton onClick={handleSave} pending={updateProfile.isPending} />
    </div>
  );
}

// ── Branding (site-wide) ──────────────────────────────────────────────────────

function BrandingTab() {
  const { data: about, isLoading } = useAdminAbout();
  const updateProfile = useUpdateProfile();

  const [name, setName] = useState("");
  const [avatarImage, setAvatarImage] = useState("");
  const [location, setLocation] = useState("");
  const [ctaLabel, setCtaLabel] = useState("");
  const [footerNote, setFooterNote] = useState("");
  const hydrated = useRef(false);

  useEffect(() => {
    if (about && !hydrated.current) {
      hydrated.current = true;
      setName(about.name ?? "");
      setAvatarImage(about.avatarImage ?? "");
      setLocation(about.location ?? "");
      setCtaLabel(about.ctaLabel ?? "");
      setFooterNote(about.footerNote ?? "");
    }
  }, [about]);

  const handleSave = () => {
    updateProfile.mutate(
      {
        name,
        avatarImage: avatarImage || undefined,
        location: location || undefined,
        ctaLabel: ctaLabel || undefined,
        footerNote: footerNote || undefined,
      },
      { onSuccess: () => toast.success("Saved") },
    );
  };

  if (isLoading) return <TabSkeleton />;

  return (
    <div className="flex flex-col gap-10">
      <div>
        <SectionLabel>branding</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div
              className="mb-1 font-mono text-[10.5px]"
              style={{ color: MUTED }}
            >
              name
            </div>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className={cn(formField, "h-auto px-4 py-[10px]")}
            />
          </div>
          <div>
            <div
              className="mb-1 font-mono text-[10.5px]"
              style={{ color: MUTED }}
            >
              location
            </div>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Kathmandu, Nepal"
              className={cn(formField, "h-auto px-4 py-[10px]")}
            />
          </div>
          <div>
            <div
              className="mb-1 font-mono text-[10.5px]"
              style={{ color: MUTED }}
            >
              cta label
            </div>
            <Input
              value={ctaLabel}
              onChange={(e) => setCtaLabel(e.target.value)}
              placeholder="Hire me"
              className={cn(formField, "h-auto px-4 py-[10px]")}
            />
          </div>
          <div>
            <div
              className="mb-1 font-mono text-[10.5px]"
              style={{ color: MUTED }}
            >
              footer note
            </div>
            <Input
              value={footerNote}
              onChange={(e) => setFooterNote(e.target.value)}
              placeholder="e.g. built from scratch"
              className={cn(formField, "h-auto px-4 py-[10px]")}
            />
          </div>
        </div>
      </div>

      <div>
        <SectionLabel>avatar image</SectionLabel>
        <div className="flex gap-2 items-center">
          <Input
            value={avatarImage}
            onChange={(e) => setAvatarImage(e.target.value)}
            placeholder="avatar image"
            className={cn(formField, "flex-1 h-auto px-4 py-[10px]")}
          />
          <ImagePickerButton onUploaded={(url) => setAvatarImage(url)} />
        </div>
        {avatarImage && (
          <div
            className="mt-3 rounded-full border overflow-hidden"
            style={{ borderColor: BORDER, width: 48, height: 48 }}
          >
            <img
              src={avatarImage}
              alt="avatar preview"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        )}
      </div>

      <SaveButton onClick={handleSave} pending={updateProfile.isPending} />
    </div>
  );
}

// ── Shared ────────────────────────────────────────────────────────────────────

function SaveButton({
  onClick,
  pending,
}: {
  onClick: () => void;
  pending: boolean;
}) {
  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={pending}
      className={saveButton}
    >
      {pending ? "Saving…" : "Save changes"}
    </Button>
  );
}

function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div
      className="rounded-[10px] border border-dashed px-4 py-6 text-center text-[12px] leading-relaxed"
      style={{
        borderColor: BORDER,
        fontFamily: mono,
        color: MUTED,
        background: "#0C0C0F",
      }}
    >
      {children}
    </div>
  );
}

function TabSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <Skeleton className="h-3 w-28 mb-3 rounded-[4px]" />
        <Skeleton className="h-10 w-full rounded-[10px]" />
        <Skeleton className="h-2.5 w-64 mt-2 rounded-[4px]" />
      </div>
      <div>
        <Skeleton className="h-3 w-24 mb-3 rounded-[4px]" />
        <Skeleton className="h-10 w-full rounded-[10px]" />
      </div>
      <div className="flex flex-col gap-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-14 w-full rounded-[10px]" />
        ))}
      </div>
      <Skeleton className="h-10 w-32 rounded-[10px]" />
    </div>
  );
}
