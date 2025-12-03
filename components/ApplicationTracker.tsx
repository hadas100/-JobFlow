import React, { useState } from 'react';
import { JobApplication, ApplicationStatus } from '../types';
import { MoreVertical, Phone, Mail, FileText, Calendar, Building2, X, Plus, Link as LinkIcon, Save, Trash2, Pencil } from 'lucide-react';

interface ApplicationTrackerProps {
  applications: JobApplication[];
  onStatusUpdate: (id: string, status: ApplicationStatus) => void;
  onAddApplication: (app: JobApplication) => void;
  onEditApplication: (app: JobApplication) => void;
  onDeleteApplication: (id: string) => void;
}

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({ 
  applications, 
  onStatusUpdate, 
  onAddApplication, 
  onEditApplication, 
  onDeleteApplication 
}) => {
  const [filter, setFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: '',
    link: '',
    notes: ''
  });

  const filteredApps = filter === 'ALL' 
    ? applications 
    : applications.filter(app => app.status === filter);

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.APPLIED: return 'bg-blue-100 text-blue-700';
      case ApplicationStatus.INTERVIEW: return 'bg-purple-100 text-purple-700';
      case ApplicationStatus.OFFER: return 'bg-green-100 text-green-700';
      case ApplicationStatus.REJECTED: return 'bg-red-100 text-red-700';
      case ApplicationStatus.REVIEW: return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleDownloadResume = (content: string, company: string) => {
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Resume_${company}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ companyName: '', jobTitle: '', link: '', notes: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (app: JobApplication) => {
    setEditingId(app.id);
    setFormData({
      companyName: app.companyName,
      jobTitle: app.jobTitle,
      link: app.jobDescription || '',
      notes: app.notes || ''
    });
    setIsModalOpen(true);
    setMenuOpenId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName || !formData.jobTitle) return;

    if (editingId) {
      const existingApp = applications.find(a => a.id === editingId);
      if (existingApp) {
        const updatedApp: JobApplication = {
          ...existingApp,
          companyName: formData.companyName,
          jobTitle: formData.jobTitle,
          jobDescription: formData.link,
          notes: formData.notes
        };
        onEditApplication(updatedApp);
      }
    } else {
      const newApp: JobApplication = {
        id: Date.now().toString(),
        companyName: formData.companyName,
        jobTitle: formData.jobTitle,
        dateApplied: new Date().toISOString().split('T')[0],
        status: ApplicationStatus.APPLIED,
        resumeUsed: 'קו"ח כלליים',
        jobDescription: formData.link, // Storing link/details here
        notes: formData.notes
      };
      onAddApplication(newApp);
    }

    setIsModalOpen(false);
    setFormData({ companyName: '', jobTitle: '', link: '', notes: '' });
    setEditingId(null);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto relative" onClick={() => setMenuOpenId(null)}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">מעקב מועמדויות</h2>
          <p className="text-gray-500 mt-1">נהל את כל המשרות ששלחת אליהן קורות חיים</p>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            openAddModal();
          }}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-md flex items-center gap-2"
        >
           <Plus size={20} />
           <span>הוסף מועמדות ידנית</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button 
          onClick={() => setFilter('ALL')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === 'ALL' ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}
        >
          הכל
        </button>
        {Object.values(ApplicationStatus).map(status => (
           <button 
           key={status}
           onClick={() => setFilter(status)}
           className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === status ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}
         >
           {status}
         </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApps.map((app) => (
          <div key={app.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative group">
            <div className={`absolute top-4 left-4 transition-opacity z-10 ${menuOpenId === app.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
              <div className="relative">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpenId(menuOpenId === app.id ? null : app.id);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600"
                >
                  <MoreVertical size={18} />
                </button>
                
                {menuOpenId === app.id && (
                  <div className="absolute left-0 top-full mt-1 w-32 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-1 z-20 animate-in fade-in zoom-in duration-200">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(app);
                      }}
                      className="w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Pencil size={14} />
                      ערוך
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteApplication(app.id);
                        setMenuOpenId(null);
                      }}
                      className="w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <Trash2 size={14} />
                      מחק
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-start justify-between mb-4">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                  <Building2 size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{app.jobTitle}</h3>
                  <p className="text-gray-500 text-sm font-medium">{app.companyName}</p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                {app.status}
              </span>
              <span className="text-gray-400 text-xs mr-3 flex inline-flex items-center gap-1">
                <Calendar size={12} />
                {app.dateApplied}
              </span>
            </div>

            {app.jobDescription && app.jobDescription.startsWith('http') && (
              <div className="mb-4">
                 <a href={app.jobDescription} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline flex items-center gap-1">
                    <LinkIcon size={14} />
                    קישור למשרה
                 </a>
              </div>
            )}

            {app.contactPerson && (
              <div className="bg-gray-50 rounded-xl p-3 mb-4 text-sm">
                <p className="text-gray-700 font-medium mb-1">איש קשר: {app.contactPerson.name}</p>
                <div className="flex gap-3 mt-2">
                   {app.contactPerson.phone && (
                     <a href={`tel:${app.contactPerson.phone}`} className="text-gray-500 hover:text-green-600 bg-white p-1.5 rounded-lg shadow-sm">
                       <Phone size={14} />
                     </a>
                   )}
                   {app.contactPerson.email && (
                     <a href={`mailto:${app.contactPerson.email}`} className="text-gray-500 hover:text-blue-600 bg-white p-1.5 rounded-lg shadow-sm">
                       <Mail size={14} />
                     </a>
                   )}
                </div>
              </div>
            )}

            <div className="border-t pt-4 flex gap-2">
              <button 
                onClick={() => handleDownloadResume(app.resumeUsed, app.companyName)}
                className="flex-1 flex items-center justify-center gap-2 text-sm text-gray-600 hover:bg-gray-50 py-2 rounded-lg transition-colors border border-gray-200"
              >
                <FileText size={16} />
                הורד קו"ח שנשלחו
              </button>
              <select 
                className="text-sm border-gray-200 rounded-lg text-gray-600 bg-gray-50 border px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={app.status}
                onChange={(e) => onStatusUpdate(app.id, e.target.value as ApplicationStatus)}
              >
                {Object.values(ApplicationStatus).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Manual Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">
                {editingId ? 'עריכת מועמדות' : 'הוספת מועמדות ידנית'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">שם החברה *</label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={e => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="לדוגמה: Google"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">שם המשרה *</label>
                  <input
                    type="text"
                    required
                    value={formData.jobTitle}
                    onChange={e => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="לדוגמה: Frontend Dev"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">לינק למשרה / פרטים נוספים</label>
                <div className="relative">
                  <LinkIcon size={18} className="absolute top-3 right-3 text-gray-400" />
                  <input
                    type="text"
                    value={formData.link}
                    onChange={e => setFormData(prev => ({ ...prev, link: e.target.value }))}
                    className="w-full p-2.5 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">הערות</label>
                <textarea
                  value={formData.notes}
                  onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-24 resize-none"
                  placeholder="הערות אישיות..."
                />
              </div>

              <div className="pt-4 flex gap-3">
                 <button
                   type="button"
                   onClick={() => setIsModalOpen(false)}
                   className="flex-1 py-2.5 text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl font-medium transition-colors"
                 >
                   ביטול
                 </button>
                 <button
                   type="submit"
                   className="flex-1 py-2.5 text-white bg-blue-600 hover:bg-blue-700 rounded-xl font-medium shadow-md transition-colors flex items-center justify-center gap-2"
                 >
                   <Save size={18} />
                   {editingId ? 'עדכן מועמדות' : 'שמור מועמדות'}
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};