export enum UserRole {
  MEMBER = 'MEMBER',
  ORGANIZER = 'ORGANIZER',
  BUILDER = 'BUILDER'
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  interests: string[];
  bio?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizerId: string;
  organizerName: string;
  price: number;
  category: string;
  attendees: string[]; // User IDs
  image: string;
  aiSummary?: string;
  tags: string[];
}

export interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  organizerId: string;
  image: string;
  tags: string[];
}

export interface EmailSequence {
  id: string;
  name: string;
  targetICP: string;
  steps: {
    subject: string;
    body: string;
    delay: string;
  }[];
}

export interface LeadMagnet {
  id: string;
  title: string;
  description: string;
  type: 'PDF' | 'WEBINAR' | 'CHECKLIST';
  content: string;
}
