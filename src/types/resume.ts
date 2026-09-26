export type ResumeSection = 'EXPERIENCE' | 'EDUCATION' | 'CERTIFICATION' | 'SKILL';

export interface ResumeItem {
  id: string;
  title: string;
  organization: string | null;
  period: string | null;
  location: string | null;
  body: string | null;
  points: string[];
}

export interface ResumeItemFull extends ResumeItem {
  section: ResumeSection;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeGrouped {
  experiences: ResumeItem[];
  education: ResumeItem[];
  certifications: ResumeItem[];
  skills: ResumeItem[];
}

export interface CreateResumeItemPayload {
  section: ResumeSection;
  title: string;
  organization?: string;
  period?: string;
  location?: string;
  body?: string;
  points?: string[];
  order?: number;
}

export type UpdateResumeItemPayload = Partial<CreateResumeItemPayload>;
