
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useHospital } from '../context/HospitalContext';
import { UserRole } from '../types';

const LoginPage: React.FC = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [isPatient, setIsPatient] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { patients, staff } = useHospital();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isPatient) {
      const found = patients.find((p: any) => p.id === id && p.password === password);
      if (found) {
        login({ id: found.id, name: found.name, role: UserRole.PATIENT });
        navigate('/dashboard');
      } else {
        setError('Invalid Patient ID or Password');
      }
    } else {
      const found = staff.find((u: any) => u.email === id && u.password === password);
      if (found) {
        login(found);
        navigate('/dashboard');
      } else {
        setError('Unauthorized Staff Credentials');
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border-4 border-slate-900 overflow-hidden relative">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 text-slate-400 hover:text-slate-950 transition-colors flex items-center gap-1 group"
          aria-label="Back to Start"
        >
          <svg className="w-6 h-6 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l(7-7m-7 7h18" />
          </svg>
          <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
        </button>

        <div className="p-10 pt-16">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-slate-950 tracking-tighter uppercase leading-none">Hospital Portal</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">Mars Multi Speciality Hospital</p>
          </div>

          <div className="flex bg-slate-100 p-2 rounded-2xl mb-10 border-4 border-slate-200">
            <button 
              onClick={() => setIsPatient(false)}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${!isPatient ? 'bg-slate-950 shadow-xl text-white' : 'text-slate-500 hover:text-slate-950'}`}
            >
              Medical Staff
            </button>
            <button 
              onClick={() => setIsPatient(true)}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${isPatient ? 'bg-slate-950 shadow-xl text-white' : 'text-slate-500 hover:text-slate-950'}`}
            >
              Patient Portal
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="bg-red-50 text-red-700 font-black text-[10px] p-4 rounded-xl border-2 border-red-200 text-center uppercase tracking-widest">{error}</div>}
            
            <div>
              <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">{isPatient ? 'Patient ID' : 'Staff Medical Email'}</label>
              <input 
                type={isPatient ? "text" : "email"}
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
                className="w-full px-5 py-4 rounded-2xl border-4 border-slate-100 text-slate-950 font-black focus:border-blue-900 outline-none transition-all placeholder:text-slate-300"
                placeholder={isPatient ? "ID (e.g. PAT123456)" : "email@marshospital.com"}
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Access Key</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-5 py-4 rounded-2xl border-4 border-slate-100 text-slate-950 font-black focus:border-blue-900 outline-none transition-all placeholder:text-slate-300"
                placeholder="••••••••"
              />
              {isPatient && (
                <div className="mt-6 p-4 bg-blue-50 border-4 border-blue-100 rounded-2xl">
                  <p className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-1 text-center">System Default Password</p>
                  <p className="text-2xl font-black text-blue-950 text-center tracking-[0.2em]">Hospice2025</p>
                </div>
              )}
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-900 text-white font-black py-5 rounded-2xl hover:bg-black transition-all shadow-xl shadow-blue-100 uppercase tracking-widest text-sm border-4 border-black"
            >
              Authorize Login
            </button>
          </form>

          {!isPatient && (
            <p className="text-center mt-10 text-slate-500 font-bold text-xs uppercase tracking-widest">
              Need Access? <Link to="/signup" className="text-blue-900 font-black hover:underline underline-offset-4">Register Account</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
