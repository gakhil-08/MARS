
import React from 'react';
import { useNavigate } from 'react-router-dom';

const StartPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center animate-fade-in relative">
      {/* Admin Access: Represented as a minimalist black dot logo */}
      <div 
        onClick={() => navigate('/admin')}
        className="fixed bottom-8 right-8 w-4 h-4 bg-slate-950 rounded-full cursor-pointer hover:scale-125 transition-transform shadow-lg z-50 group"
        title="System Administration"
      >
        <div className="absolute inset-0 bg-slate-950 rounded-full animate-ping opacity-20 group-hover:opacity-40"></div>
      </div>

      <div className="max-w-2xl w-full flex flex-col items-center space-y-12">
        {/* LOGO DESIGN BASED ON UPLOADED IMAGE */}
        <div className="relative w-72 h-72 flex items-center justify-center">
          {/* Overlapping Circles */}
          <div className="absolute top-0 left-0 w-44 h-44 bg-blue-700/80 rounded-full mix-blend-multiply filter blur-[1px]"></div>
          <div className="absolute bottom-0 right-0 w-44 h-44 bg-emerald-500/80 rounded-full mix-blend-multiply filter blur-[1px]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 bg-blue-900/40 rounded-full mix-blend-overlay border border-white/20"></div>
          
          <div className="relative z-10 flex flex-col items-center justify-center text-white font-black leading-none">
            <div className="flex gap-6 mb-2">
              <span className="text-7xl tracking-tighter">A</span>
              <span className="text-7xl tracking-tighter">R</span>
            </div>
            <div className="flex gap-6">
              <span className="text-7xl tracking-tighter">S</span>
              <span className="text-7xl tracking-tighter">M</span>
            </div>
            {/* Vertical line through logo */}
            <div className="absolute w-[6px] h-full bg-white/50 left-1/2 -translate-x-1/2 top-0 rounded-full shadow-2xl"></div>
          </div>
        </div>

        <div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter uppercase mb-2">
            MARS
          </h1>
          <h2 className="text-2xl font-black text-slate-500 tracking-widest uppercase mb-6">
            Multi Speciality Hospital
          </h2>
          <div className="h-[2px] w-24 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">
            Advancing Health & Research
          </p>
        </div>

        {/* Down Arrow Button */}
        <button 
          onClick={() => navigate('/login')}
          className="mt-16 w-24 h-24 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:bg-blue-800 transition-all active:scale-90 group border-8 border-slate-50"
          aria-label="Open Login Page"
        >
          <svg className="w-12 h-12 group-hover:translate-y-3 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default StartPage;
