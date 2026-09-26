'use client';

import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/components/ui/button';
import { Input } from '@/components/components/ui/input';
import { Label } from '@/components/components/ui/label';
import { Switch } from '@/components/components/ui/switch';
import { Card } from '@/components/components/ui/card';
import { cn } from '@/components/lib/utils';
import { useUpdateMe, useAdminAbout, useUpdateProfile, useCreateContactLink, useUpdateContactLink, useDeleteContactLink } from '../../../../services/adminService';
import { useContactLinks } from '../../../../services/contactService';
import { useAdminMe } from '../../../../services/authService';
import type { ContactLink } from '../../../../types/contact';
import {
  BORDER, MUTED, TEXT, mono, formField, addButton, saveButton, panelCard, resumeLabel, rowDangerButton,
  SectionLabel, saveContactLinks, type ContactLinkRow,
} from '../../../../components/admin/adminUi';

const SETTINGS_FIELDS = ['Display name', 'Email'];

export default function AdminSettingsPage() {
  const { data: me } = useAdminMe();
  const updateMe = useUpdateMe();
  const [vals, setVals] = useState<Record<string, string>>(
    Object.fromEntries(SETTINGS_FIELDS.map((f) => [f, '']))
  );
  const hydrated = useRef(false);

  useEffect(() => {
    if (me && !hydrated.current) {
      hydrated.current = true;
      setVals((prev) => ({ ...prev, 'Display name': me.name ?? '', Email: me.email ?? '' }));
    }
  }, [me]);

  const handleSave = () => {
    updateMe.mutate({ name: vals['Display name'] }, { onSuccess: () => toast.success('Saved') });
  };

  // ── Branding (Profile: navbar/footer chrome shown to public visitors) ──────
  const { data: profile } = useAdminAbout();
  const updateProfile = useUpdateProfile();
  const [siteName, setSiteName] = useState('');
  const [avatarImage, setAvatarImage] = useState('');
  const [location, setLocation] = useState('');
  const [ctaLabel, setCtaLabel] = useState('');
  const [footerNote, setFooterNote] = useState('');
  const brandingHydrated = useRef(false);

  useEffect(() => {
    if (profile && !brandingHydrated.current) {
      brandingHydrated.current = true;
      setSiteName(profile.name ?? '');
      setAvatarImage(profile.avatarImage ?? '');
      setLocation(profile.location ?? '');
      setCtaLabel(profile.ctaLabel ?? '');
      setFooterNote(profile.footerNote ?? '');
    }
  }, [profile]);

  const handleSaveBranding = () => {
    updateProfile.mutate(
      {
        name: siteName,
        avatarImage: avatarImage || undefined,
        location: location || undefined,
        ctaLabel: ctaLabel || undefined,
        footerNote: footerNote || undefined,
      },
      { onSuccess: () => toast.success('Saved') },
    );
  };

  // ── Contact links (footer "Elsewhere" + email, e.g. GitHub/LinkedIn) ───────
  const { data: contactLinks } = useContactLinks();
  const [links, setLinks] = useState<ContactLinkRow[]>([]);
  const linksHydrated = useRef(false);
  const originalLinkIds = useRef<string[]>([]);
  const [savingLinks, setSavingLinks] = useState(false);
  const createLink = useCreateContactLink();
  const updateLink = useUpdateContactLink();
  const deleteLink = useDeleteContactLink();

  useEffect(() => {
    if (contactLinks && !linksHydrated.current) {
      linksHydrated.current = true;
      const rows = contactLinks.map((l: ContactLink) => ({ id: l.id, label: l.label, value: l.value, href: l.href }));
      setLinks(rows);
      originalLinkIds.current = rows.filter((r) => r.id).map((r) => r.id!);
    }
  }, [contactLinks]);

  const handleSaveLinks = async () => {
    setSavingLinks(true);
    try {
      await saveContactLinks(
        links,
        originalLinkIds.current,
        { create: (p) => createLink.mutateAsync(p), update: (p) => updateLink.mutateAsync(p), del: (id) => deleteLink.mutateAsync(id) },
      );
      toast.success('Saved');
    } finally {
      setSavingLinks(false);
    }
  };

  const [notifEmail, setNotifEmail] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [analytics, setAnalytics] = useState(false);

  return (
    <div className="max-w-[680px] flex flex-col gap-8">

      {/* Profile fields */}
      <div>
        <SectionLabel>profile</SectionLabel>
        <div className="grid grid-cols-2 gap-4">
          {SETTINGS_FIELDS.map((label) => (
            <div key={label}>
              <Label htmlFor={`settings-${label}`} className="mb-2 block font-mono text-[11px] font-normal text-[#6E6E78]">
                {label}
              </Label>
              <Input
                id={`settings-${label}`}
                value={vals[label]}
                disabled={label === 'Email'}
                onChange={(e) => setVals((prev) => ({ ...prev, [label]: e.target.value }))}
                className={cn(formField, 'h-auto px-4 py-[10px]')}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Branding — public-facing navbar/footer chrome */}
      <div>
        <SectionLabel>branding</SectionLabel>
        <div className="text-[11px] mb-4 -mt-2" style={{ fontFamily: mono, color: MUTED }}>
          Shown on every public page — navbar avatar &amp; CTA, footer name &amp; contact.
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="mb-2 block font-mono text-[11px] font-normal text-[#6E6E78]">Site name</Label>
            <Input
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder="Your full name"
              className={cn(formField, 'h-auto px-4 py-[10px]')}
            />
          </div>
          <div>
            <Label className="mb-2 block font-mono text-[11px] font-normal text-[#6E6E78]">Location</Label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Kathmandu, Nepal"
              className={cn(formField, 'h-auto px-4 py-[10px]')}
            />
          </div>
          <div>
            <Label className="mb-2 block font-mono text-[11px] font-normal text-[#6E6E78]">Navbar CTA label</Label>
            <Input
              value={ctaLabel}
              onChange={(e) => setCtaLabel(e.target.value)}
              placeholder="Hire me"
              className={cn(formField, 'h-auto px-4 py-[10px]')}
            />
          </div>
          <div>
            <Label className="mb-2 block font-mono text-[11px] font-normal text-[#6E6E78]">Footer note</Label>
            <Input
              value={footerNote}
              onChange={(e) => setFooterNote(e.target.value)}
              placeholder="e.g. built from scratch"
              className={cn(formField, 'h-auto px-4 py-[10px]')}
            />
          </div>
          <div className="col-span-2">
            <Label className="mb-2 block font-mono text-[11px] font-normal text-[#6E6E78]">Avatar image URL</Label>
            <Input
              value={avatarImage}
              onChange={(e) => setAvatarImage(e.target.value)}
              placeholder="https://example.com/avatar.png  (or leave blank for the initial-letter fallback)"
              className={cn(formField, 'h-auto px-4 py-[10px]')}
            />
            {avatarImage && (
              <div
                className="mt-3 rounded-full border overflow-hidden"
                style={{ borderColor: BORDER, width: 48, height: 48 }}
              >
                <img
                  src={avatarImage}
                  alt="avatar preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            )}
          </div>
        </div>
        <Button
          type="button"
          onClick={handleSaveBranding}
          disabled={updateProfile.isPending}
          className={cn(saveButton, 'mt-4')}
        >
          {updateProfile.isPending ? 'Saving…' : 'Save branding'}
        </Button>
      </div>

      {/* Contact links — footer "Elsewhere" list + the email line */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <SectionLabel>contact links</SectionLabel>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setLinks((prev) => [...prev, { label: '', value: '', href: '' }])}
            className={addButton}
          >
            + add link
          </Button>
        </div>
        <div className="text-[11px] mb-4 -mt-2" style={{ fontFamily: mono, color: MUTED }}>
          Shown in the footer &amp; on the contact page. A link labeled "Email" is used as the footer contact address.
        </div>
        <div className="flex flex-col gap-4">
          {links.map((link, i) => (
            <Card key={i} className={panelCard}>
              <div className="flex items-center justify-between">
                <div className="text-[11px]" style={{ fontFamily: mono, color: MUTED }}>link {i + 1}</div>
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  onClick={() => setLinks((prev) => prev.filter((_, j) => j !== i))}
                  className={cn(rowDangerButton, 'rounded-[7px] py-[4px] text-[10.5px]')}
                >
                  remove
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className={resumeLabel}>label</Label>
                  <Input
                    value={link.label}
                    onChange={(e) => setLinks((prev) => prev.map((r, j) => j === i ? { ...r, label: e.target.value } : r))}
                    placeholder="GitHub"
                    className={cn(formField, 'h-auto rounded-[9px] px-3 py-[8px] text-[13px] md:text-[13px]')}
                  />
                </div>
                <div>
                  <Label className={resumeLabel}>display value</Label>
                  <Input
                    value={link.value}
                    onChange={(e) => setLinks((prev) => prev.map((r, j) => j === i ? { ...r, value: e.target.value } : r))}
                    placeholder="github.com/you"
                    className={cn(formField, 'h-auto rounded-[9px] px-3 py-[8px] text-[13px] md:text-[13px]')}
                  />
                </div>
                <div>
                  <Label className={resumeLabel}>href</Label>
                  <Input
                    value={link.href}
                    onChange={(e) => setLinks((prev) => prev.map((r, j) => j === i ? { ...r, href: e.target.value } : r))}
                    placeholder="https://github.com/you"
                    className={cn(formField, 'h-auto rounded-[9px] px-3 py-[8px] text-[13px] md:text-[13px]')}
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
          className={cn(saveButton, 'mt-4')}
        >
          {savingLinks ? 'Saving…' : 'Save contact links'}
        </Button>
      </div>

      {/* Preferences toggles */}
      <div>
        <SectionLabel>preferences</SectionLabel>
        <div className="flex flex-col gap-3">
          {[
            { label: 'Email notifications', desc: 'Get notified about new messages', val: notifEmail, set: setNotifEmail },
            { label: 'Dark mode', desc: 'Use the dark theme everywhere', val: darkMode, set: setDarkMode },
            { label: 'Analytics', desc: 'Share anonymous usage data', val: analytics, set: setAnalytics },
          ].map((pref) => {
            const id = `pref-${pref.label.replace(/\s+/g, '-').toLowerCase()}`;
            return (
              <Card
                key={pref.label}
                className="flex-row items-center justify-between gap-4 rounded-[12px] border-border bg-[#111115] px-4 py-3 shadow-none"
              >
                <div>
                  <Label htmlFor={id} className="text-[13.5px] font-medium" style={{ color: TEXT }}>
                    {pref.label}
                  </Label>
                  <div className="text-[12px]" style={{ color: MUTED }}>{pref.desc}</div>
                </div>
                <Switch id={id} checked={pref.val} onCheckedChange={pref.set} />
              </Card>
            );
          })}
        </div>
      </div>

      {/* Save button */}
      <Button
        type="button"
        onClick={handleSave}
        disabled={updateMe.isPending}
        className={saveButton}
      >
        {updateMe.isPending ? 'Saving…' : 'Save changes'}
      </Button>

    </div>
  );
}
