import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Save, User, FileText, Check, Loader2 } from 'lucide-react';

interface SettingsProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
}

export const Settings: React.FC<SettingsProps> = ({ userProfile, onUpdateProfile }) => {
  const [name, setName] = useState(userProfile.name);
  const [resume, setResume] = useState(userProfile.baseResume);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleSave = () => {
    setSaveState('saving');
    // Simulate API delay for better UX
    setTimeout(() => {
      onUpdateProfile({ ...userProfile, name, baseResume: resume });
      setSaveState('saved');
      
      // Reset back to idle after 2 seconds
      setTimeout(() => {
        setSaveState('idle');
      }, 2000);
    }, 600);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">הגדרות</h2>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <User size={16} />
            שם מלא
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <FileText size={16} />
            קורות חיים (Base Resume)
          </label>
          <textarea
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl h-64 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow resize-none"
          />
          <p className="text-xs text-gray-500 mt-2">זהו נוסח קורות החיים הבסיסי שישמש את ה-AI ליצירת גרסאות מותאמות.</p>
        </div>

        <div className="pt-4 border-t">
          <button
            onClick={handleSave}
            disabled={saveState !== 'idle'}
            className={`
              px-8 py-2.5 rounded-xl font-medium shadow-md transition-all duration-200 flex items-center gap-2 min-w-[160px] justify-center
              ${saveState === 'saved' ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}
              ${saveState === 'saving' ? 'opacity-80 cursor-wait' : ''}
            `}
          >
            {saveState === 'idle' && (
              <>
                <Save size={18} />
                שמור שינויים
              </>
            )}
            {saveState === 'saving' && (
              <>
                <Loader2 size={18} className="animate-spin" />
                שומר...
              </>
            )}
            {saveState === 'saved' && (
              <>
                <Check size={18} />
                נשמר בהצלחה
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};