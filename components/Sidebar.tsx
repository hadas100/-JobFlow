import React from 'react';
import { LayoutDashboard, Briefcase, FileText, Search, Settings, LogOut } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'לוח בקרה', icon: <LayoutDashboard size={20} /> },
    { id: 'tracker', label: 'המועמדויות שלי', icon: <Briefcase size={20} /> },
    { id: 'finder', label: 'משרות מותאמות', icon: <Search size={20} /> },
    { id: 'resume-ai', label: 'עריכת קו"ח (AI)', icon: <FileText size={20} /> },
  ];

  return (
    <div className="w-64 bg-white h-screen shadow-lg flex flex-col fixed right-0 top-0 z-10 border-l border-gray-100">
      <div className="p-6 border-b border-gray-100 flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
          J
        </div>
        <h1 className="text-2xl font-bold text-gray-800">JobFlow</h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === item.id
                ? 'bg-blue-50 text-blue-600 font-medium shadow-sm'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100 space-y-2">
        <button 
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
            activeTab === 'settings' 
              ? 'bg-blue-50 text-blue-600 font-medium' 
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <Settings size={18} />
          <span>הגדרות</span>
        </button>

        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-red-500 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={18} />
          <span>התנתק</span>
        </button>

        <div className="mt-2 px-4 text-xs text-gray-400 text-center pt-2">
          v1.0.0 Beta
        </div>
      </div>
    </div>
  );
};
