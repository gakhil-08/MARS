
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <header className="bg-white border-b border-slate-300 sticky top-0 z-50 px-4 h-16 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-inner">
          H
        </div>
        <div>
          <h1 className="text-lg font-extrabold text-slate-950 leading-none tracking-tight">HospiceFlow</h1>
          <p className="text-[10px] text-blue-800 font-bold uppercase tracking-widest mt-1">Medical Coordination</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex flex-col items-end">
          <span className="text-sm font-bold text-slate-900">{user.name}</span>
          <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded-full text-slate-800 font-bold uppercase tracking-tighter border border-slate-300">
            {user.role}
          </span>
        </div>
        <button 
          onClick={logout}
          className="text-sm text-red-700 font-bold hover:text-red-900 transition-colors bg-red-50 px-3 py-1.5 rounded-lg border border-red-100"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
