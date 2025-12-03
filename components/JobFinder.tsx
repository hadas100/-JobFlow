import React, { useState, useRef } from 'react';
import { JobOpportunity, UserProfile } from '../types';
import { analyzeJobMatch } from '../services/geminiService';
import { MapPin, Building, Target, Loader2, Sparkles, Briefcase, Upload } from 'lucide-react';

interface JobFinderProps {
  jobs: JobOpportunity[];
  userProfile: UserProfile;
  onAddJobs: (jobs: JobOpportunity[]) => void;
}

export const JobFinder: React.FC<JobFinderProps> = ({ jobs, userProfile, onAddJobs }) => {
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [matchResults, setMatchResults] = useState<Record<string, { score: number, reasoning: string }>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAnalyze = async (job: JobOpportunity) => {
    setAnalyzingId(job.id);
    const result = await analyzeJobMatch(userProfile.baseResume, job.description);
    setMatchResults(prev => ({ ...prev, [job.id]: result }));
    setAnalyzingId(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      try {
        const json = JSON.parse(content);
        if (Array.isArray(json)) {
            const newJobs = json.map((job: any) => ({
                id: job.id || Math.random().toString(36).substr(2, 9),
                companyName: job.companyName || 'Unknown Company',
                jobTitle: job.jobTitle || 'Untitled Position',
                description: job.description || '',
                location: job.location || 'Remote',
                requirements: Array.isArray(job.requirements) ? job.requirements : []
            }));
            onAddJobs(newJobs);
            return;
        }
      } catch (e) {
        // Not a JSON file, treat as text
      }

      // Treat as single text job
      const newJob: JobOpportunity = {
        id: Math.random().toString(36).substr(2, 9),
        companyName: 'Uploaded Job',
        jobTitle: 'Imported Position',
        description: content,
        location: 'Unknown',
        requirements: []
      };
      onAddJobs([newJob]);
    };
    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">משרות מומלצות עבורך</h2>
          <p className="text-gray-500 mt-1">משרות שעדיין לא הגשת אליהן מועמדות</p>
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept=".json,.txt" 
          onChange={handleFileUpload}
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="bg-white text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2 text-sm font-medium"
        >
          <Upload size={18} />
          <span>העלה משרות</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-blue-200 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{job.jobTitle}</h3>
                <div className="flex items-center gap-2 text-gray-500 mt-1">
                  <Building size={16} />
                  <span>{job.companyName}</span>
                  <span className="mx-1">•</span>
                  <MapPin size={16} />
                  <span>{job.location}</span>
                </div>
              </div>
              <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                חדש
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">דרישות עיקריות:</h4>
              <div className="flex flex-wrap gap-2">
                {job.requirements.map((req, idx) => (
                  <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-md">
                    {req}
                  </span>
                ))}
              </div>
            </div>

            {/* AI Match Section */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 mb-4 border border-indigo-100">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2 text-indigo-900 font-semibold">
                  <Sparkles size={18} className="text-purple-600" />
                  התאמת AI
                </div>
                {matchResults[job.id] && (
                  <span className={`text-lg font-bold ${matchResults[job.id].score > 80 ? 'text-green-600' : 'text-orange-500'}`}>
                    {matchResults[job.id].score}%
                  </span>
                )}
              </div>
              
              {matchResults[job.id] ? (
                <p className="text-sm text-indigo-800 leading-relaxed">
                  {matchResults[job.id].reasoning}
                </p>
              ) : (
                 <p className="text-sm text-gray-500">לחץ לבדיקת התאמה אישית של קורות החיים שלך למשרה זו</p>
              )}

              {!matchResults[job.id] && (
                <button 
                  onClick={() => handleAnalyze(job)}
                  disabled={analyzingId === job.id}
                  className="mt-3 text-sm text-indigo-600 font-medium hover:text-indigo-800 flex items-center gap-1 transition-colors"
                >
                  {analyzingId === job.id ? <Loader2 className="animate-spin" size={16}/> : <Target size={16} />}
                  נתח התאמה
                </button>
              )}
            </div>

            <div className="flex gap-3 mt-4">
              <button className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <Briefcase size={18} />
                הגש מועמדות
              </button>
              <button className="px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
                שמור
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};