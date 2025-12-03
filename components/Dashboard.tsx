import React from 'react';
import { JobApplication, ApplicationStatus } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { TrendingUp, Users, CheckCircle, Clock } from 'lucide-react';

interface DashboardProps {
  applications: JobApplication[];
}

export const Dashboard: React.FC<DashboardProps> = ({ applications }) => {
  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.keys(statusCounts).map(status => ({
    name: status,
    value: statusCounts[status]
  }));

  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#ef4444', '#f97316'];

  const stats = [
    { label: 'סה"כ מועמדויות', value: applications.length, icon: <TrendingUp className="text-blue-500"/>, bg: 'bg-blue-50' },
    { label: 'ראיונות', value: statusCounts[ApplicationStatus.INTERVIEW] || 0, icon: <Users className="text-purple-500"/>, bg: 'bg-purple-50' },
    { label: 'הצעות', value: statusCounts[ApplicationStatus.OFFER] || 0, icon: <CheckCircle className="text-green-500"/>, bg: 'bg-green-50' },
    { label: 'ממתינים לתשובה', value: (statusCounts[ApplicationStatus.APPLIED] || 0) + (statusCounts[ApplicationStatus.REVIEW] || 0), icon: <Clock className="text-orange-500"/>, bg: 'bg-orange-50' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">לוח בקרה</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">התפלגות סטטוסים</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
             {data.map((entry, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                   <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}}></div>
                   <span className="text-gray-600">{entry.name}</span>
                </div>
             ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <h3 className="font-bold text-gray-800 mb-4">פעילות אחרונה</h3>
           <div className="space-y-4">
             {applications.slice(0, 4).map(app => (
               <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border text-gray-400 font-bold">
                        {app.companyName.charAt(0)}
                     </div>
                     <div>
                        <p className="font-bold text-sm text-gray-800">{app.companyName}</p>
                        <p className="text-xs text-gray-500">{app.jobTitle}</p>
                     </div>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded bg-white border text-gray-600">
                     {app.status}
                  </span>
               </div>
             ))}
             {applications.length === 0 && <p className="text-center text-gray-400 py-10">אין פעילות להצגה</p>}
           </div>
        </div>
      </div>
    </div>
  );
};
