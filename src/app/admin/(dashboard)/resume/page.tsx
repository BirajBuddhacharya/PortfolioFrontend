'use client';

import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Briefcase, GraduationCap, Wrench } from 'lucide-react';
import { Button } from '@/components/components/ui/button';
import { Input } from '@/components/components/ui/input';
import { Textarea } from '@/components/components/ui/textarea';
import { Card } from '@/components/components/ui/card';
import { Label } from '@/components/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/components/ui/tabs';
import { cn } from '@/components/lib/utils';
import { useAdminResume, useCreateResumeItem, useUpdateResumeItem, useDeleteResumeItem } from '../../../../services/adminService';
import type { CreateResumeItemPayload, UpdateResumeItemPayload } from '../../../../types/resume';
import {
  MUTED, mono, formField, addButton, saveButton, panelCard, resumeLabel, rowDangerButton,
  SectionLabel, ResumeRowEditor, saveResumeRows,
  type ResumeRow, type SkillRow,
} from '../../../../components/admin/adminUi';

export default function AdminResumePage() {
  return (
    <Tabs defaultValue="experience" className="max-w-[860px] gap-6">
      <TabsList>
        <TabsTrigger value="experience" className="gap-1.5">
          <Briefcase size={13} /> Experience
        </TabsTrigger>
        <TabsTrigger value="education-certs" className="gap-1.5">
          <GraduationCap size={13} /> Education &amp; Certs
        </TabsTrigger>
        <TabsTrigger value="skills" className="gap-1.5">
          <Wrench size={13} /> Skills
        </TabsTrigger>
      </TabsList>
      <TabsContent value="experience">
        <ExperienceSection />
      </TabsContent>
      <TabsContent value="education-certs">
        <EducationCertsSection />
      </TabsContent>
      <TabsContent value="skills">
        <SkillsSection />
      </TabsContent>
    </Tabs>
  );
}

function ExperienceSection() {
  const { data: resumeAdmin } = useAdminResume();
  const [experiences, setExperiences] = useState<ResumeRow[]>([]);
  const hydrated = useRef(false);
  const originalIds = useRef<string[]>([]);
  const [saving, setSaving] = useState(false);
  const createItem = useCreateResumeItem();
  const updateItem = useUpdateResumeItem();
  const deleteItem = useDeleteResumeItem();

  useEffect(() => {
    if (resumeAdmin && !hydrated.current) {
      hydrated.current = true;
      const rows = resumeAdmin.experiences.map((e) => ({
        id: e.id,
        title: e.title,
        period: e.period ?? '',
        organization: e.organization ?? '',
        body: e.points.length ? e.points.join('\n') : (e.body ?? ''),
      }));
      setExperiences(rows);
      originalIds.current = rows.filter((r) => r.id).map((r) => r.id!);
    }
  }, [resumeAdmin]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveResumeRows(
        'EXPERIENCE',
        experiences,
        originalIds.current,
        (row) => ({ points: row.body ? row.body.split('\n').map((s) => s.trim()).filter(Boolean) : [] }),
        { create: (p) => createItem.mutateAsync(p), update: (p) => updateItem.mutateAsync(p), del: (id) => deleteItem.mutateAsync(id) },
      );
      toast.success('Saved');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-[860px] flex flex-col gap-6">
      <SectionLabel>experience</SectionLabel>
      <ResumeRowEditor rows={experiences} setRows={setExperiences} addLabel="+ add experience" />
      <Button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className={saveButton}
      >
        {saving ? 'Saving…' : 'Save changes'}
      </Button>
    </div>
  );
}

function EducationCertsSection() {
  const { data: resumeAdmin } = useAdminResume();
  const [educationEntries, setEducationEntries] = useState<ResumeRow[]>([]);
  const [certs, setCerts] = useState<ResumeRow[]>([]);
  const hydrated = useRef(false);
  const originalEduIds = useRef<string[]>([]);
  const originalCertIds = useRef<string[]>([]);
  const [saving, setSaving] = useState(false);
  const createItem = useCreateResumeItem();
  const updateItem = useUpdateResumeItem();
  const deleteItem = useDeleteResumeItem();

  useEffect(() => {
    if (resumeAdmin && !hydrated.current) {
      hydrated.current = true;
      const toRow = (e: { id: string; title: string; period: string | null; organization: string | null; body: string | null }) => ({
        id: e.id, title: e.title, period: e.period ?? '', organization: e.organization ?? '', body: e.body ?? '',
      });
      const eduRows = resumeAdmin.education.map(toRow);
      const certRows = resumeAdmin.certifications.map(toRow);
      setEducationEntries(eduRows);
      setCerts(certRows);
      originalEduIds.current = eduRows.filter((r) => r.id).map((r) => r.id!);
      originalCertIds.current = certRows.filter((r) => r.id).map((r) => r.id!);
    }
  }, [resumeAdmin]);

  const handleSave = async () => {
    setSaving(true);
    const bodyExtra = (row: { body?: string }) => ({ body: row.body || undefined });
    const ops = { create: (p: CreateResumeItemPayload) => createItem.mutateAsync(p), update: (p: UpdateResumeItemPayload & { id: string }) => updateItem.mutateAsync(p), del: (id: string) => deleteItem.mutateAsync(id) };
    try {
      await Promise.all([
        saveResumeRows('EDUCATION', educationEntries, originalEduIds.current, bodyExtra, ops),
        saveResumeRows('CERTIFICATION', certs, originalCertIds.current, bodyExtra, ops),
      ]);
      toast.success('Saved');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-[860px] flex flex-col gap-10">
      <div>
        <SectionLabel>education</SectionLabel>
        <ResumeRowEditor rows={educationEntries} setRows={setEducationEntries} addLabel="+ add education" />
      </div>
      <div>
        <SectionLabel>certifications</SectionLabel>
        <ResumeRowEditor rows={certs} setRows={setCerts} addLabel="+ add certification" />
      </div>
      <Button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className={saveButton}
      >
        {saving ? 'Saving…' : 'Save changes'}
      </Button>
    </div>
  );
}

function SkillsSection() {
  const { data: resumeAdmin } = useAdminResume();
  const [skills, setSkills] = useState<SkillRow[]>([]);
  const hydrated = useRef(false);
  const originalIds = useRef<string[]>([]);
  const [saving, setSaving] = useState(false);
  const createItem = useCreateResumeItem();
  const updateItem = useUpdateResumeItem();
  const deleteItem = useDeleteResumeItem();

  useEffect(() => {
    if (resumeAdmin && !hydrated.current) {
      hydrated.current = true;
      const rows = resumeAdmin.skills.map((s) => ({ id: s.id, title: s.title, body: s.body ?? '' }));
      setSkills(rows);
      originalIds.current = rows.filter((r) => r.id).map((r) => r.id!);
    }
  }, [resumeAdmin]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveResumeRows(
        'SKILL',
        skills,
        originalIds.current,
        (row) => ({ body: row.body || undefined }),
        { create: (p) => createItem.mutateAsync(p), update: (p) => updateItem.mutateAsync(p), del: (id) => deleteItem.mutateAsync(id) },
      );
      toast.success('Saved');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-[860px] flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <SectionLabel>skills</SectionLabel>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setSkills((prev) => [...prev, { title: '', body: '' }])}
          className={addButton}
        >
          + add category
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        {skills.map((skill, i) => (
          <Card key={i} className={panelCard}>
            <div className="flex items-center justify-between">
              <div className="text-[11px]" style={{ fontFamily: mono, color: MUTED }}>category {i + 1}</div>
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={() => setSkills((prev) => prev.filter((_, j) => j !== i))}
                className={cn(rowDangerButton, 'rounded-[7px] py-[4px] text-[10.5px]')}
              >
                remove
              </Button>
            </div>
            <div>
              <Label className={resumeLabel}>category name</Label>
              <Input
                value={skill.title}
                onChange={(e) => setSkills((prev) => prev.map((r, j) => j === i ? { ...r, title: e.target.value } : r))}
                className={cn(formField, 'h-auto rounded-[9px] px-3 py-[8px] text-[13px] md:text-[13px]')}
              />
            </div>
            <div>
              <Label className={resumeLabel}>items (comma-separated)</Label>
              <Textarea
                value={skill.body}
                onChange={(e) => setSkills((prev) => prev.map((r, j) => j === i ? { ...r, body: e.target.value } : r))}
                rows={2}
                className={cn(formField, 'resize-none rounded-[9px] px-3 py-[8px] text-[13px] leading-relaxed md:text-[13px]')}
              />
            </div>
          </Card>
        ))}
      </div>
      <Button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className={saveButton}
      >
        {saving ? 'Saving…' : 'Save changes'}
      </Button>
    </div>
  );
}
