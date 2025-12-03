import { JobApplication, JobOpportunity, UserProfile, ApplicationStatus } from '../types';

// Mock Data for new users
const INITIAL_JOBS: JobOpportunity[] = [
  {
    id: '101',
    companyName: 'Riskified',
    jobTitle: 'Frontend Team Lead',
    description: 'We are looking for an experienced Team Lead to manage a squad of 5 developers. Requirements: 5+ years in React, deep understanding of DOM, leadership experience.',
    location: 'תל אביב',
    requirements: ['React', 'Leadership', '5+ Years Exp']
  },
  {
    id: '102',
    companyName: 'CyberArk',
    jobTitle: 'Software Architect',
    description: 'Join our architecture team. You will design scalable cloud solutions. Must have AWS expertise and Java/C# background.',
    location: 'פתח תקווה',
    requirements: ['AWS', 'Architecture', 'Java/C#']
  },
  {
    id: '103',
    companyName: 'Melio',
    jobTitle: 'React Developer',
    description: 'Looking for a passionate React developer to join our payments team. Experience with Redux and TypeScript is a must.',
    location: 'תל אביב',
    requirements: ['React', 'TypeScript', 'Redux']
  }
];

const INITIAL_APPS: JobApplication[] = [
  {
    id: '1',
    companyName: 'Wix',
    jobTitle: 'Senior Frontend Engineer',
    dateApplied: '2023-10-15',
    status: ApplicationStatus.INTERVIEW,
    resumeUsed: 'React Focused Resume Content...',
    contactPerson: {
      name: 'דנה כהן',
      role: 'HR Manager',
      email: 'dana.c@wix.example.com',
      phone: '050-1234567'
    }
  }
];

const USERS_KEY = 'jobflow_users';

export const db = {
  // User Management
  register: (name: string, email: string, password: string): UserProfile => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    if (users.find((u: any) => u.email === email)) {
      throw new Error('כתובת האימייל כבר קיימת במערכת');
    }
    
    // Save user credentials
    users.push({ email, password, name });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    // Initialize User Data
    const profile: UserProfile = {
      name,
      baseResume: ''
    };
    
    // Save initial data structure for this specific user
    localStorage.setItem(`jobflow_profile_${email}`, JSON.stringify(profile));
    localStorage.setItem(`jobflow_apps_${email}`, JSON.stringify(INITIAL_APPS));
    localStorage.setItem(`jobflow_jobs_${email}`, JSON.stringify(INITIAL_JOBS));

    return profile;
  },

  login: (email: string, password: string): UserProfile => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('אימייל או סיסמה שגויים');
    }

    // Return current profile associated with email
    const profile = JSON.parse(localStorage.getItem(`jobflow_profile_${email}`) || 'null');
    return profile || { name: user.name, baseResume: '' };
  },

  // Data Management
  getData: (email: string) => {
    return {
      profile: JSON.parse(localStorage.getItem(`jobflow_profile_${email}`) || 'null'),
      applications: JSON.parse(localStorage.getItem(`jobflow_apps_${email}`) || '[]'),
      jobs: JSON.parse(localStorage.getItem(`jobflow_jobs_${email}`) || '[]'),
    };
  },

  saveData: (email: string, type: 'profile' | 'apps' | 'jobs', data: any) => {
    localStorage.setItem(`jobflow_${type}_${email}`, JSON.stringify(data));
  }
};