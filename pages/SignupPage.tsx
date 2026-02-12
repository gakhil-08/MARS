
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useHospital } from '../context/HospitalContext';
import { UserRole } from '../types';

const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.DOCTOR);
  const { addStaff } = useHospital();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new user object
    const newUser = { 
      id: Math.random().toString(36).substr(2, 9), 
      name, 
      email, 
      password, // In a real app, this would be hashed on the server
      role, 
      isOnline: true 
    };
    
    // Add to Hospital Context (which syncs to localStorage and Admin view)
    addStaff(newUser);
    
    // Redirect to login
    navigate('/login');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border-4 border-slate-900 overflow-hidden">
        <div className="p-10">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-slate-950 tracking-tighter uppercase">Join Staff</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">Mars Multi Speciality Hospital</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Full Name / Title</label>
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-5 py-4 rounded-2xl border-4 border-slate-100 text-slate-950 font-black focus:border-blue-900 outline-none transition-all placeholder:text-slate-300"
                placeholder="Dr. Jane Smith"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Medical Email</label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-5 py-4 rounded-2xl border-4 border-slate-100 text-slate-950 font-black focus:border-blue-900 outline-none transition-all placeholder:text-slate-300"
                placeholder="jane@marshospital.com"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Departmental Role</label>
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-5 py-4 rounded-2xl border-4 border-slate-100 text-slate-950 font-black focus:border-blue-900 outline-none bg-white uppercase text-xs tracking-widest"
              >
                <option value={UserRole.DOCTOR}>Physician / Doctor</option>
                <option value={UserRole.NURSE}>Nursing Station</option>
                <option value={UserRole.LAB}>Lab Technician</option>
                <option value={UserRole.PHARMACY}>Pharmacist / Billing</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Security Password</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-5 py-4 rounded-2xl border-4 border-slate-100 text-slate-950 font-black focus:border-blue-900 outline-none transition-all placeholder:text-slate-300"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-900 text-white font-black py-5 rounded-2xl hover:bg-black transition-all shadow-xl shadow-blue-100 uppercase tracking-widest text-sm border-4 border-black"
            >
              Request Access
            </button>
          </form>

          <p className="text-center mt-10 text-slate-500 font-bold text-xs uppercase tracking-widest">
            Existing Account? <Link to="/login" className="text-blue-900 font-black hover:underline underline-offset-4">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
