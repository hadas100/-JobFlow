import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ApplicationTracker } from './components/ApplicationTracker';
import { JobFinder } from './components/JobFinder';
import { ResumeBuilder } from './components/ResumeBuilder';
import { Dashboard } from './components/Dashboard';
import { Settings } from './components/Settings';
import { JobApplication, ApplicationStatus, JobOpportunity, UserProfile } from './types';

// Mock Data
const MOCK_USER: UserProfile = {
  name: "ישראל ישראלי",
  baseResume: `
ישראל ישראלי
מפתח תוכנה מנוסה (Full Stack)

ניסיון תעסוקתי:
2020 - היום: מפתח בכיר בחברת TechStart
- פיתוח מערכות Web ב-React ו-Node.js
- הובלת צוות של 3 מפתחים
- שיפור ביצועי המערכת ב-40%

2018 - 2020: מפתח Junior בחברת SoftSol
- בניית דפי נחיתה
- עבודה עם מסדי נתונים SQL

השכלה:
תואר ראשון במדעי המחשב, אוניברסיטת תל אביב

מיומנויות:
JavaScript, TypeScript, React, Node.js, Python, AWS
  `
};

const MOCK_APPLICATIONS: JobApplication[] = [
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
  },
  {
    id: '2',
    companyName: 'Monday.com',
    jobTitle: 'Full Stack Developer',
    dateApplied: '2023-10-20',
    status: ApplicationStatus.APPLIED,
    resumeUsed: 'General Fullstack Resume...',
    contactPerson: {
      name: 'רוני לוי',
      role: 'Recruiter'
    }
  },
  {
    id: '3',
    companyName: 'IronSource',
    jobTitle: 'Backend Engineer',
    dateApplied: '2023-10-01',
    status: ApplicationStatus.REJECTED,
    resumeUsed: 'Backend focused...'
  }
];

const MOCK_JOBS: JobOpportunity[] = [
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

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [applications, setApplications] = useState<JobApplication[]>(MOCK_APPLICATIONS);
  const [userProfile, setUserProfile] = useState<UserProfile>(MOCK_USER);
  const [jobs, setJobs] = useState<JobOpportunity[]>(MOCK_JOBS);

  const handleStatusUpdate = (id: string, newStatus: ApplicationStatus) => {
    setApplications(prev => prev.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    ));
  };

  const handleAddApplication = (newApp: JobApplication) => {
    setApplications(prev => [newApp, ...prev]);
    setActiveTab('tracker'); // Ensure we are on the tracker tab to see the new item
  };

  const handleEditApplication = (updatedApp: JobApplication) => {
    setApplications(prev => prev.map(app => app.id === updatedApp.id ? updatedApp : app));
  };

  const handleDeleteApplication = (id: string) => {
    setApplications(prev => prev.filter(app => app.id !== id));
  };

  const handleAddJobs = (newJobs: JobOpportunity[]) => {
    setJobs(prev => [...newJobs, ...prev]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard applications={applications} />;
      case 'tracker':
        return <ApplicationTracker 
          applications={applications} 
          onStatusUpdate={handleStatusUpdate} 
          onAddApplication={handleAddApplication}
          onEditApplication={handleEditApplication}
          onDeleteApplication={handleDeleteApplication}
        />;
      case 'finder':
        return <JobFinder jobs={jobs} userProfile={userProfile} onAddJobs={handleAddJobs} />;
      case 'resume-ai':
        return <ResumeBuilder userProfile={userProfile} />;
      case 'settings':
        return <Settings userProfile={userProfile} onUpdateProfile={setUserProfile} />;
      default:
        return <Dashboard applications={applications} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f3f4f6]">
      {/* Main Content Area */}
      <main className="flex-1 mr-64 transition-all duration-300">
        <header className="bg-white p-4 shadow-sm sticky top-0 z-20 flex justify-between items-center px-8">
           <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border border-gray-100">
                <span className="text-gray-500 font-bold">{userProfile.name.split(' ').map(n => n[0]).join('').substring(0,2)}</span>
             </div>
             <div>
               <h2 className="font-bold text-gray-800 text-sm">{userProfile.name}</h2>
               <p className="text-xs text-gray-500">מחפש עבודה פעיל</p>
             </div>
           </div>
           <div className="text-sm text-gray-400">
             יום ראשון, 27 אוקטובר
           </div>
        </header>
        {renderContent()}
      </main>

      {/* Sidebar (Fixed Right) */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;