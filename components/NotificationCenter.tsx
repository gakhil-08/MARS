
import React, { useState, useEffect } from 'react';
import { useHospital } from '../context/HospitalContext';
import { useAuth } from '../context/AuthContext';

const NotificationCenter: React.FC = () => {
  const { notifications } = useHospital();
  const { user } = useAuth();
  const [activeNote, setActiveNote] = useState<string | null>(null);

  useEffect(() => {
    if (notifications.length > 0) {
      const latest = notifications[0];
      // Check if it's for this user's role
      if (user && latest.role === user.role) {
        setActiveNote(latest.id);
        const timer = setTimeout(() => setActiveNote(null), 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [notifications, user]);

  if (!activeNote) return null;

  const note = notifications.find(n => n.id === activeNote);
  if (!note) return null;

  return (
    <div className="fixed top-20 right-4 z-[60] w-80 animate-slide-in">
      <div className="bg-blue-600 text-white p-4 rounded-xl shadow-2xl flex items-start gap-3 border border-blue-400">
        <div className="bg-blue-400/30 p-2 rounded-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="font-bold text-sm">Action Assigned</p>
          <p className="text-xs opacity-90">{note.message}</p>
        </div>
        <button onClick={() => setActiveNote(null)} className="text-white/60 hover:text-white">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default NotificationCenter;
