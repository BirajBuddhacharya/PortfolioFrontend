export interface Profile {
  headline: string;
  coverImage: string | null;
  paragraphs: string[];
  facts: { k: string; v: string }[];
  stats: { value: string; label: string }[];
  ticker: string[];
  name: string;
  avatarImage: string | null;
  location: string | null;
  ctaLabel: string;
  footerNote: string | null;
  updatedAt?: string;
}

export type UpdateProfilePayload = Partial<Omit<Profile, 'updatedAt'>>;
