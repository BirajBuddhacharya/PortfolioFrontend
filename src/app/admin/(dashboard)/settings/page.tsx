"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/components/ui/button";
import { Input } from "@/components/components/ui/input";
import { Label } from "@/components/components/ui/label";
import { Switch } from "@/components/components/ui/switch";
import { Card } from "@/components/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/components/ui/tabs";
import { cn } from "@/components/lib/utils";
import {
  useUpdateMe,
  useAdminAbout,
  useUpdateProfile,
  useCreateContactLink,
  useUpdateContactLink,
  useDeleteContactLink,
} from "../../../../services/adminService";
import { useContactLinks } from "../../../../services/contactService";
import { useAdminMe } from "../../../../services/authService";
import type { ContactLink } from "../../../../types/contact";
import {
  BORDER,
  MUTED,
  TEXT,
  TEXT2,
  mono,
  formField,
  addButton,
  saveButton,
  panelCard,
  resumeLabel,
  rowDangerButton,
  SectionLabel,
  saveContactLinks,
  type ContactLinkRow,
} from "../../../../components/admin/adminUi";
import { ImageUploadButton } from "../../../../components/admin/ImageUploadButton";

const triggerCls =
  "justify-start rounded-[8px] px-3 py-[9px] text-[13px] font-normal text-left h-auto " +
  "data-[state=active]:bg-white/[0.06] data-[state=active]:text-[#EDEDEF] " +
  "data-[state=inactive]:text-[#6E6E78] hover:text-[#EDEDEF] transition-colors max-w-[99%]";

export default function AdminSettingsPage() {
  return (
    <Tabs
      orientation="vertical"
      defaultValue="account"
      className="flex flex-col sm:flex-row gap-0 max-w-[860px]"
    >
      {/* Sidebar — horizontal on mobile, vertical on sm+ */}
      <TabsList
        variant="line"
        className="h-auto w-full sm:w-[160px] sm:shrink-0 flex-row sm:flex-col items-stretch gap-0.5 rounded-none bg-transparent p-0 overflow-x-auto border-b sm:border-b-0 sm:border-r pb-1 sm:pb-0 pr-0 sm:pr-3"
        style={{ borderColor: BORDER }}
      >
        <TabsTrigger
          value="account"
          className={cn(triggerCls, "shrink-0 sm:shrink")}
        >
          Account
        </TabsTrigger>
        <TabsTrigger
          value="branding"
          className={cn(triggerCls, "shrink-0 sm:shrink")}
        >
          Branding
        </TabsTrigger>
        <TabsTrigger
          value="links"
          className={cn(triggerCls, "shrink-0 sm:shrink")}
        >
          Contact Links
        </TabsTrigger>
        <TabsTrigger
          value="ticker"
          className={cn(triggerCls, "shrink-0 sm:shrink")}
        >
          Ticker
        </TabsTrigger>
        <TabsTrigger
          value="notifications"
          className={cn(triggerCls, "shrink-0 sm:shrink")}
        >
          Notifications
        </TabsTrigger>
      </TabsList>

      {/* Content */}
      <div className="flex-1 pt-6 sm:pt-0 sm:pl-10">
        <TabsContent value="account">
          <AccountTab />
        </TabsContent>
        <TabsContent value="branding">
          <BrandingTab />
        </TabsContent>
        <TabsContent value="links">
          <LinksTab />
        </TabsContent>
        <TabsContent value="ticker">
          <TickerTab />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationsTab />
        </TabsContent>
      </div>
    </Tabs>
  );
}

function AccountTab() {
  const { data: me } = useAdminMe();
  const updateMe = useUpdateMe();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const hydrated = useRef(false);

  useEffect(() => {
    if (me && !hydrated.current) {
      hydrated.current = true;
      setDisplayName(me.name ?? "");
      setEmail(me.email ?? "");
    }
  }, [me]);

  return (
    <div className="flex flex-col gap-6">
      <SectionLabel>account</SectionLabel>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label
            htmlFor="settings-name"
            className="mb-2 block font-mono text-[11px] font-normal text-[#6E6E78]"
          >
            Display name
          </Label>
          <Input
            id="settings-name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className={cn(formField, "h-auto px-4 py-[10px]")}
          />
        </div>
        <div>
          <Label
            htmlFor="settings-email"
            className="mb-2 block font-mono text-[11px] font-normal text-[#6E6E78]"
          >
            Email
          </Label>
          <Input
            id="settings-email"
            value={email}
            disabled
            className={cn(formField, "h-auto px-4 py-[10px]")}
          />
        </div>
      </div>
      <Button
        type="button"
        onClick={() =>
          updateMe.mutate(
            { name: displayName },
            { onSuccess: () => toast.success("Saved") },
          )
        }
        disabled={updateMe.isPending}
        className={saveButton}
      >
        {updateMe.isPending ? "Saving…" : "Save changes"}
      </Button>
    </div>
  );
}

function BrandingTab() {
  const { data: profile } = useAdminAbout();
  const updateProfile = useUpdateProfile();
  const [siteName, setSiteName] = useState("");
  const [avatarImage, setAvatarImage] = useState("");
  const [location, setLocation] = useState("");
  const [ctaLabel, setCtaLabel] = useState("");
  const [footerNote, setFooterNote] = useState("");
  const hydrated = useRef(false);

  useEffect(() => {
    if (profile && !hydrated.current) {
      hydrated.current = true;
      setSiteName(profile.name ?? "");
      setAvatarImage(profile.avatarImage ?? "");
      setLocation(profile.location ?? "");
      setCtaLabel(profile.ctaLabel ?? "");
      setFooterNote(profile.footerNote ?? "");
    }
  }, [profile]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <SectionLabel>branding</SectionLabel>
        <div
          className="text-[11px] mb-4 -mt-2"
          style={{ fontFamily: mono, color: MUTED }}
        >
          Shown on every public page — navbar avatar &amp; CTA, footer name
          &amp; contact.
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="mb-2 block font-mono text-[11px] font-normal text-[#6E6E78]">
            Site name
          </Label>
          <Input
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            placeholder="Your full name"
            className={cn(formField, "h-auto px-4 py-[10px]")}
          />
        </div>
        <div>
          <Label className="mb-2 block font-mono text-[11px] font-normal text-[#6E6E78]">
            Location
          </Label>
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Kathmandu, Nepal"
            className={cn(formField, "h-auto px-4 py-[10px]")}
          />
        </div>
        <div>
          <Label className="mb-2 block font-mono text-[11px] font-normal text-[#6E6E78]">
            Navbar CTA label
          </Label>
          <Input
            value={ctaLabel}
            onChange={(e) => setCtaLabel(e.target.value)}
            placeholder="Hire me"
            className={cn(formField, "h-auto px-4 py-[10px]")}
          />
        </div>
        <div>
          <Label className="mb-2 block font-mono text-[11px] font-normal text-[#6E6E78]">
            Footer note
          </Label>
          <Input
            value={footerNote}
            onChange={(e) => setFooterNote(e.target.value)}
            placeholder="e.g. built from scratch"
            className={cn(formField, "h-auto px-4 py-[10px]")}
          />
        </div>
        <div className="col-span-1 sm:col-span-2">
          <Label className="mb-2 block font-mono text-[11px] font-normal text-[#6E6E78]">
            Avatar image
          </Label>
          <div className="flex gap-2 items-center">
            <Input
              value={avatarImage}
              onChange={(e) => setAvatarImage(e.target.value)}
              placeholder="https://example.com/avatar.png  (or leave blank for initials fallback)"
              className={cn(formField, "flex-1 h-auto px-4 py-[10px]")}
            />
            <ImageUploadButton onUploaded={(url) => setAvatarImage(url)} />
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
      </div>
      <Button
        type="button"
        onClick={() =>
          updateProfile.mutate(
            {
              name: siteName,
              avatarImage: avatarImage || undefined,
              location: location || undefined,
              ctaLabel: ctaLabel || undefined,
              footerNote: footerNote || undefined,
            },
            { onSuccess: () => toast.success("Saved") },
          )
        }
        disabled={updateProfile.isPending}
        className={saveButton}
      >
        {updateProfile.isPending ? "Saving…" : "Save branding"}
      </Button>
    </div>
  );
}

function LinksTab() {
  const { data: contactLinks } = useContactLinks();
  const [links, setLinks] = useState<ContactLinkRow[]>([]);
  const hydrated = useRef(false);
  const originalLinkIds = useRef<string[]>([]);
  const [savingLinks, setSavingLinks] = useState(false);
  const createLink = useCreateContactLink();
  const updateLink = useUpdateContactLink();
  const deleteLink = useDeleteContactLink();

  useEffect(() => {
    if (contactLinks && !hydrated.current) {
      hydrated.current = true;
      const rows = contactLinks.map((l: ContactLink) => ({
        id: l.id,
        label: l.label,
        value: l.value,
        href: l.href,
      }));
      setLinks(rows);
      originalLinkIds.current = rows.filter((r) => r.id).map((r) => r.id!);
    }
  }, [contactLinks]);

  const handleSaveLinks = async () => {
    setSavingLinks(true);
    try {
      await saveContactLinks(links, originalLinkIds.current, {
        create: (p) => createLink.mutateAsync(p),
        update: (p) => updateLink.mutateAsync(p),
        del: (id) => deleteLink.mutateAsync(id),
      });
      toast.success("Saved");
    } finally {
      setSavingLinks(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <SectionLabel>contact links</SectionLabel>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            setLinks((prev) => [...prev, { label: "", value: "", href: "" }])
          }
          className={addButton}
        >
          + add link
        </Button>
      </div>
      <div
        className="text-[11px] -mt-4"
        style={{ fontFamily: mono, color: MUTED }}
      >
        Shown in the footer &amp; on the contact page. A link labeled "Email" is
        used as the footer contact address.
      </div>
      <div className="flex flex-col gap-4">
        {links.map((link, i) => (
          <Card key={i} className={panelCard}>
            <div className="flex items-center justify-between">
              <div
                className="text-[11px]"
                style={{ fontFamily: mono, color: MUTED }}
              >
                link {i + 1}
              </div>
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={() =>
                  setLinks((prev) => prev.filter((_, j) => j !== i))
                }
                className={cn(
                  rowDangerButton,
                  "rounded-[7px] py-[4px] text-[10.5px]",
                )}
              >
                remove
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <Label className={resumeLabel}>label</Label>
                <Input
                  value={link.label}
                  onChange={(e) =>
                    setLinks((prev) =>
                      prev.map((r, j) =>
                        j === i ? { ...r, label: e.target.value } : r,
                      ),
                    )
                  }
                  placeholder="GitHub"
                  className={cn(
                    formField,
                    "h-auto rounded-[9px] px-3 py-[8px] text-[13px] md:text-[13px]",
                  )}
                />
              </div>
              <div>
                <Label className={resumeLabel}>display value</Label>
                <Input
                  value={link.value}
                  onChange={(e) =>
                    setLinks((prev) =>
                      prev.map((r, j) =>
                        j === i ? { ...r, value: e.target.value } : r,
                      ),
                    )
                  }
                  placeholder="github.com/you"
                  className={cn(
                    formField,
                    "h-auto rounded-[9px] px-3 py-[8px] text-[13px] md:text-[13px]",
                  )}
                />
              </div>
              <div>
                <Label className={resumeLabel}>href</Label>
                <Input
                  value={link.href}
                  onChange={(e) =>
                    setLinks((prev) =>
                      prev.map((r, j) =>
                        j === i ? { ...r, href: e.target.value } : r,
                      ),
                    )
                  }
                  placeholder="https://github.com/you"
                  className={cn(
                    formField,
                    "h-auto rounded-[9px] px-3 py-[8px] text-[13px] md:text-[13px]",
                  )}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Button
        type="button"
        onClick={handleSaveLinks}
        disabled={savingLinks}
        className={saveButton}
      >
        {savingLinks ? "Saving…" : "Save contact links"}
      </Button>
    </div>
  );
}

function TickerTab() {
  const { data: profile } = useAdminAbout();
  const updateProfile = useUpdateProfile();
  const [items, setItems] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const hydrated = useRef(false);

  useEffect(() => {
    if (profile && !hydrated.current) {
      hydrated.current = true;
      setItems(profile.ticker ?? []);
    }
  }, [profile]);

  const add = () => {
    const val = input.trim();
    if (!val || items.includes(val)) return;
    setItems((prev) => [...prev, val]);
    setInput("");
  };

  const remove = (i: number) =>
    setItems((prev) => prev.filter((_, j) => j !== i));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <SectionLabel>ticker</SectionLabel>
        <div
          className="text-[11px] -mt-2 mb-4"
          style={{ fontFamily: mono, color: MUTED }}
        >
          Skills scrolled in the marquee strip on the home page.
        </div>
      </div>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder="e.g. TypeScript"
          className={cn(formField, "flex-1 h-auto px-4 py-[10px]")}
        />
        <Button
          type="button"
          variant="outline"
          onClick={add}
          className={addButton}
        >
          + add
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-1.5 rounded-[8px] border px-3 py-[5px] font-mono text-[12px]"
            style={{
              borderColor: "rgba(255,255,255,0.1)",
              color: TEXT2,
              background: "#131317",
            }}
          >
            {item}
            <button
              type="button"
              onClick={() => remove(i)}
              className="opacity-50 hover:opacity-100 transition-opacity text-[10px] leading-none"
              style={{ color: MUTED }}
            >
              ✕
            </button>
          </span>
        ))}
      </div>
      <Button
        type="button"
        onClick={() =>
          updateProfile.mutate(
            { ticker: items },
            { onSuccess: () => toast.success("Saved") },
          )
        }
        disabled={updateProfile.isPending}
        className={saveButton}
      >
        {updateProfile.isPending ? "Saving…" : "Save ticker"}
      </Button>
    </div>
  );
}

function NotificationsTab() {
  const { data: profile } = useAdminAbout();
  const updateProfile = useUpdateProfile();
  const notifEmail = profile?.emailNotifications ?? true;

  const handleToggle = (val: boolean) => {
    updateProfile.mutate(
      { emailNotifications: val },
      {
        onSuccess: () =>
          toast.success(
            val
              ? "Email notifications enabled"
              : "Email notifications disabled",
          ),
      },
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <SectionLabel>notifications</SectionLabel>
      <Card className="flex-row items-center justify-between gap-4 rounded-[12px] border-border bg-[#111115] px-4 py-4 shadow-none">
        <div>
          <Label
            htmlFor="pref-email-notif"
            className="text-[13.5px] font-medium"
            style={{ color: TEXT }}
          >
            Email notifications
          </Label>
          <div className="text-[12px] mt-[2px]" style={{ color: MUTED }}>
            Get notified via email when a new contact message arrives.
          </div>
        </div>
        <Switch
          id="pref-email-notif"
          checked={notifEmail}
          onCheckedChange={handleToggle}
          disabled={updateProfile.isPending}
        />
      </Card>
    </div>
  );
}
