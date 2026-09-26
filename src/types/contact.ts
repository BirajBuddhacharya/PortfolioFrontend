export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'UNREAD' | 'READ';
  createdAt: string;
  updatedAt: string;
}

export interface ContactLink {
  id: string;
  label: string;
  value: string;
  href: string;
  order: number;
}

export type CreateContactLinkPayload = Omit<ContactLink, 'id'>;
export type UpdateContactLinkPayload = Partial<CreateContactLinkPayload>;
