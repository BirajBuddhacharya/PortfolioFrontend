export interface Project {
  id: string;
  title: string;
  blurb?: string | null;
  summary?: string | null;
  /** Markdown body rendered on the detail page. */
  content?: string | null;
  year?: string | null;
  kind?: string | null;
  status: string;
  stack: string[];
  gallery: string[];
  metrics: { value: string; label: string }[];
  live?: string | null;
  repo?: string | null;
  coverHeight: number;
  coverAccent: string;
  coverColor: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateProjectPayload = {
  title: string;
  blurb?: string;
  summary?: string;
  content?: string;
  year?: string;
  kind?: string;
  status?: string;
  stack?: string[];
  gallery?: string[];
  metrics?: { value: string; label: string }[];
  live?: string;
  repo?: string;
  coverHeight?: number;
  coverAccent?: string;
  coverColor?: string;
};

export type UpdateProjectPayload = Partial<CreateProjectPayload>;
