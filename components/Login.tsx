import React, { useState } from 'react';
import { LogIn } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // סימולציה של התחברות - בגרסה אמיתית כאן תהיה בדיקת שרת
    onLogin();
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl mb-4 shadow-lg shadow-blue-200">
            J
          </div>
          <h1 className="text-3xl font-bold text-gray-800">ברוכים הבאים</h1>
          <p className="text-gray-500 mt-2 text-center">הכנס פרטים כדי להתחבר ל-JobFlow</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">כתובת אימייל</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all hover:border-blue-300"
              placeholder="name@example.com"
              dir="ltr"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">סיסמה</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all hover:border-blue-300"
              placeholder="••••••••"
              dir="ltr"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
          >
            <LogIn size={20} />
            התחבר למערכת
          </button>
        </form>
        
        <div className="mt-8 text-center text-xs text-gray-400">
          * זוהי גרסת הדגמה, ניתן להקליד כל דבר ולהתחבר
        </div>
      </div>
    </div>
  );
};
