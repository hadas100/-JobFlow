import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ApplicationTracker } from './components/ApplicationTracker';
import { JobFinder } from './components/JobFinder';
import { ResumeBuilder } from './components/ResumeBuilder';
import { Dashboard } from './components/Dashboard';
import { Settings } from './components/Settings';
import { Login } from './components/Login';
import { db } from './services/db';
import { JobApplication, ApplicationStatus, JobOpportunity, UserProfile } from './types';

function App() {
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // State initialized with empty/default, will load from DB on login
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({ name: '', baseResume: '' });
  const [jobs, setJobs] = useState<JobOpportunity[]>([]);

  // Load data when user logs in
  useEffect(() => {
    if (currentUserEmail) {
      const data = db.getData(currentUserEmail);
      if (data.profile) setUserProfile(data.profile);
      if (data.applications) setApplications(data.applications);
      if (data.jobs) setJobs(data.jobs);
    }
  }, [currentUserEmail]);

  // Data persistence wrappers
  const updateApplications = (newApps: JobApplication[]) => {
    setApplications(newApps);
    if (currentUserEmail) db.saveData(currentUserEmail, 'apps', newApps);
  };

  const updateJobs = (newJobs: JobOpportunity[]) => {
    setJobs(newJobs);
    if (currentUserEmail) db.saveData(currentUserEmail, 'jobs', newJobs);
  };

  const updateProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    if (currentUserEmail) db.saveData(currentUserEmail, 'profile', newProfile);
  };

  const handleStatusUpdate = (id: string, newStatus: ApplicationStatus) => {
    const updated = applications.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    );
    updateApplications(updated);
  };

  const handleAddApplication = (newApp: JobApplication) => {
    const updated = [newApp, ...applications];
    updateApplications(updated);
    setActiveTab('tracker');
  };

  const handleEditApplication = (updatedApp: JobApplication) => {
    const updated = applications.map(app => app.id === updatedApp.id ? updatedApp : app);
    updateApplications(updated);
  };

  const handleDeleteApplication = (id: string) => {
    const updated = applications.filter(app => app.id !== id);
    updateApplications(updated);
  };

  const handleAddJobs = (newJobs: JobOpportunity[]) => {
    const updated = [...newJobs, ...jobs];
    updateJobs(updated);
  };

  const handleLogin = (email: string) => {
    setCurrentUserEmail(email);
  };

  const handleLogout = () => {
    setCurrentUserEmail(null);
    setApplications([]);
    setJobs([]);
    setActiveTab('dashboard');
  };

  if (!currentUserEmail) {
    return <Login onLogin={handleLogin} />;
  }

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
        return <Settings userProfile={userProfile} onUpdateProfile={updateProfile} />;
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
                <span className="text-gray-500 font-bold">{userProfile.name?.split(' ').map(n => n[0]).join('').substring(0,2) || 'U'}</span>
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
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
    </div>
  );
}

export default App;