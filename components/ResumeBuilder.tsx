import React, { useState } from 'react';
import { UserProfile } from '../types';
import { tailorResume } from '../services/geminiService';
import { Wand2, Download, Copy, RefreshCw, FileText, Sparkles } from 'lucide-react';

interface ResumeBuilderProps {
  userProfile: UserProfile;
}

export const ResumeBuilder: React.FC<ResumeBuilderProps> = ({ userProfile }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [generatedResume, setGeneratedResume] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!jobDescription.trim()) return;
    
    setIsLoading(true);
    try {
      const result = await tailorResume(userProfile.baseResume, jobDescription);
      setGeneratedResume(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedResume);
    alert('הטקסט הועתק ללוח!');
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedResume], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "Tailored_Resume.md";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Wand2 className="text-purple-600" />
          התאמת קו"ח למשרה
        </h2>
        <p className="text-gray-500 mt-1">הדבק את תיאור המשרה וה-AI יצור גרסה מותאמת של קורות החיים שלך</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
        {/* Left Side: Inputs */}
        <div className="flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex-1 flex flex-col">
            <label className="font-semibold text-gray-700 mb-2 block">1. תיאור המשרה</label>
            <textarea
              className="w-full flex-1 p-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none transition-all"
              placeholder="הדבק כאן את תיאור המשרה המלא..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <label className="font-semibold text-gray-700 mb-2 block">2. קורות החיים המקוריים שלך</label>
             <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg max-h-32 overflow-y-auto border border-gray-200">
               {userProfile.baseResume}
             </div>
             <button
              onClick={handleGenerate}
              disabled={isLoading || !jobDescription}
              className={`w-full mt-4 py-3 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all ${
                isLoading || !jobDescription ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="animate-spin" />
                  מעבד נתונים...
                </>
              ) : (
                <>
                  <Wand2 />
                  צור קורות חיים מותאמים
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Side: Output */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[600px] lg:h-auto">
          <div className="flex justify-between items-center mb-4 pb-4 border-b">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <FileText size={20} className="text-blue-500"/>
              תוצאה
            </h3>
            <div className="flex gap-2">
              <button 
                onClick={handleCopy}
                disabled={!generatedResume}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg disabled:opacity-50" 
                title="העתק"
              >
                <Copy size={20} />
              </button>
              <button 
                onClick={handleDownload}
                disabled={!generatedResume}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg disabled:opacity-50" 
                title="הורד"
              >
                <Download size={20} />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto bg-gray-50 rounded-xl p-6 border border-gray-200">
            {generatedResume ? (
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-800">
                {generatedResume}
              </pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <Sparkles size={48} className="mb-4 text-gray-300" />
                <p>התוצאה תופיע כאן לאחר הלחיצה</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};