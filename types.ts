export enum ApplicationStatus {
  APPLIED = 'נשלח',
  REVIEW = 'בבדיקה',
  INTERVIEW = 'ראיון',
  REJECTED = 'נדחה',
  OFFER = 'הצעת עבודה',
}

export interface ContactPerson {
  name: string;
  role: string;
  email?: string;
  phone?: string;
  linkedIn?: string;
}

export interface JobApplication {
  id: string;
  companyName: string;
  jobTitle: string;
  dateApplied: string;
  status: ApplicationStatus;
  resumeUsed: string; // Content or ID of the specific resume version
  contactPerson?: ContactPerson;
  jobDescription?: string;
  notes?: string;
}

export interface JobOpportunity {
  id: string;
  companyName: string;
  jobTitle: string;
  description: string;
  location: string;
  matchScore?: number; // 0-100 calculated by AI
  requirements: string[];
}

export interface UserProfile {
  name: string;
  baseResume: string; // The master resume content
}
