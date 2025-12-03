import React, { useState } from 'react';
import { LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { db } from '../services/db';

interface LoginProps {
  onLogin: (email: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isRegistering) {
        if (!name) throw new Error('נא להזין שם מלא');
        db.register(name, email, password);
      } else {
        db.login(email, password);
      }
      onLogin(email);
    } catch (err: any) {
      setError(err.message || 'אירעה שגיאה');
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl mb-4 shadow-lg shadow-blue-200">
            J
          </div>
          <h1 className="text-3xl font-bold text-gray-800">
            {isRegistering ? 'הרשמה למערכת' : 'ברוכים הבאים'}
          </h1>
          <p className="text-gray-500 mt-2 text-center">
            {isRegistering 
              ? 'צור חשבון חדש כדי לנהל את חיפוש העבודה שלך'
              : 'הכנס פרטים כדי להתחבר ל-JobFlow'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {isRegistering && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">שם מלא</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all hover:border-blue-300"
                placeholder="ישראל ישראלי"
                required={isRegistering}
              />
            </div>
          )}

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
            {isRegistering ? (
               <>
                <UserPlus size={20} />
                הירשם למערכת
               </>
            ) : (
               <>
                <LogIn size={20} />
                התחבר
               </>
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center pt-6 border-t border-gray-100">
          <button 
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
            }}
            className="text-blue-600 font-medium hover:underline text-sm"
          >
            {isRegistering 
              ? 'יש לך כבר חשבון? התחבר כאן' 
              : 'אין לך חשבון? הירשם עכשיו'
            }
          </button>
        </div>
      </div>
    </div>
  );
};