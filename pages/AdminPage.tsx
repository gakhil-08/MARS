
import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { useNavigate } from 'react-router-dom';

const AdminPage: React.FC = () => {
  const { staff, deleteStaff } = useHospital();
  const navigate = useNavigate();
  const [adminKey, setAdminKey] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);

  const checkAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminKey.toLowerCase() === 'mars') setIsAuthorized(true);
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
        <div className="bg-slate-900 border-4 border-slate-800 p-10 rounded-[2.5rem] shadow-2xl w-full max-w-sm">
          <h2 className="text-xl font-black text-white uppercase tracking-widest mb-8 text-center">Admin Verification</h2>
          <form onSubmit={checkAuth} className="space-y-6">
            <input 
              type="password" 
              placeholder="ENTER SYSTEM KEY"
              className="w-full bg-slate-950 border-4 border-slate-800 rounded-2xl p-4 text-white font-black text-center focus:border-blue-900 outline-none tracking-[0.5em]"
              value={adminKey}
              onChange={e => setAdminKey(e.target.value)}
              autoFocus
            />
            <button className="w-full bg-blue-900 text-white py-4 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-blue-800 transition-colors">Authorize Access</button>
          </form>
          <button onClick={() => navigate('/')} className="mt-8 w-full text-slate-500 font-black text-xs uppercase tracking-widest hover:text-white">Exit System</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10">
      <div className="flex justify-between items-center border-b-8 border-slate-900 pb-8">
        <div>
          <h2 className="text-4xl font-black text-slate-950 tracking-tighter uppercase">Personnel Management</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">Medical Staff Identity Control</p>
        </div>
        <button onClick={() => navigate('/')} className="bg-slate-950 text-white px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest">Logout Admin</button>
      </div>

      <div className="bg-white rounded-[2rem] border-8 border-slate-900 shadow-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-900 text-white text-xs font-black uppercase tracking-widest">
            <tr>
              <th className="p-6">Name</th>
              <th className="p-6">Email / Identifier</th>
              <th className="p-6">Departmental Role</th>
              <th className="p-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y-8 divide-slate-50">
            {staff.length === 0 ? (
              <tr><td colSpan={4} className="p-20 text-center font-black text-slate-300 uppercase">No Staff Registered</td></tr>
            ) : staff.map(s => (
              <tr key={s.id} className="hover:bg-blue-50">
                <td className="p-6 font-black text-slate-950">{s.name}</td>
                <td className="p-6 font-bold text-slate-500">{s.email}</td>
                <td className="p-6">
                  <span className="bg-slate-100 px-3 py-1 rounded-lg border-2 border-slate-200 text-xs font-black text-slate-800 uppercase tracking-widest">{s.role}</span>
                </td>
                <td className="p-6 text-right">
                  <button 
                    onClick={() => deleteStaff(s.id)}
                    className="bg-red-50 text-red-700 px-4 py-2 rounded-xl border-2 border-red-200 font-black uppercase text-[10px] tracking-widest hover:bg-red-700 hover:text-white transition-all"
                  >
                    Revoke Access
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPage;
