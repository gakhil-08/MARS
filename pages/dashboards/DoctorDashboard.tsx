
import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { useAuth } from '../../context/AuthContext';
import { ActionType, ActionStatus, UserRole, PatientAction } from '../../types';

const DoctorDashboard: React.FC = () => {
  const { patients, actions, addAction, deleteAction, staff } = useHospital();
  const { user } = useAuth();
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [showActionForm, setShowActionForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [doctorSearch, setDoctorSearch] = useState('');
  const [formData, setFormData] = useState({
    type: ActionType.INSTRUCTION,
    description: '',
    timings: '',
    assignedTo: UserRole.NURSE,
    referringDoctorId: ''
  });

  const allDoctors = staff.filter(s => s.role === UserRole.DOCTOR);
  const filteredDoctors = allDoctors.filter(d => 
    d.name.toLowerCase().includes(doctorSearch.toLowerCase())
  );
  
  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId) return;

    let location = "Ward Level";
    if (formData.assignedTo === UserRole.LAB) location = "Diagnostic Wing - Floor 2";
    if (formData.assignedTo === UserRole.PHARMACY) location = "Clinical Pharmacy - Floor 1";

    const refDoc = allDoctors.find(d => d.id === formData.referringDoctorId);
    const descPrefix = refDoc ? `[Consult/Ref: Dr. ${refDoc.name}] ` : "";

    const action: PatientAction = {
      id: Math.random().toString(36).substr(2, 9),
      patientId: selectedPatientId,
      type: formData.type,
      description: descPrefix + formData.description,
      timings: formData.timings, // This captures "Dosage Frequency" if it's a medicine type
      location: location,
      createdBy: user?.id || 'sys',
      assignedTo: formData.assignedTo,
      status: ActionStatus.PENDING,
      timestamp: Date.now()
    };

    addAction(action);
    setShowActionForm(false);
    setFormData({ type: ActionType.INSTRUCTION, description: '', timings: '', assignedTo: UserRole.NURSE, referringDoctorId: '' });
    setDoctorSearch('');
  };

  const selectedPatient = patients.find(p => p.id === selectedPatientId);
  const patientActions = actions.filter(a => a.patientId === selectedPatientId).sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
      {/* Left: Patient List */}
      <div className="w-full lg:w-1/3 space-y-4">
        <div className="relative group mb-6">
          <input 
            type="text" 
            placeholder="Search Patient Name or ID..."
            className="w-full bg-white border-4 border-slate-900 rounded-2xl p-4 font-black text-slate-950 outline-none focus:ring-4 focus:ring-blue-100 transition-all uppercase text-xs tracking-widest"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>

        <h3 className="text-xl font-black text-slate-950 uppercase tracking-tight flex items-center gap-2">
          <span className="w-3 h-3 bg-blue-800 rounded-full border-2 border-white"></span>
          Clinical Queue
        </h3>
        
        <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-20rem)] pr-2">
          {filteredPatients.length === 0 ? (
            <p className="py-10 text-center font-black text-slate-300 uppercase italic">No Matches</p>
          ) : filteredPatients.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedPatientId(p.id)}
              className={`w-full text-left p-6 rounded-3xl border-4 transition-all shadow-xl ${selectedPatientId === p.id ? 'bg-blue-900 border-black text-white' : 'bg-white border-slate-100 hover:border-blue-400 text-slate-950'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-black text-xl leading-none">{p.name}</span>
                <span className={`text-[10px] px-2 py-1 rounded font-black border-2 ${selectedPatientId === p.id ? 'bg-white/20 border-white/40' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>{p.id}</span>
              </div>
              <p className={`text-xs font-bold leading-relaxed mb-4 ${selectedPatientId === p.id ? 'text-blue-100' : 'text-slate-500'}`}>{p.problem.substring(0, 40)}...</p>
              <div className={`text-[10px] font-black uppercase tracking-widest flex items-center justify-between ${selectedPatientId === p.id ? 'text-white' : 'text-blue-900'}`}>
                <span>Room: {p.roomNo}</span>
                <span className={`px-2 py-1 rounded border-2 ${p.hasInsurance ? 'border-emerald-500 text-emerald-500' : 'border-red-500 text-red-500'}`}>
                  {p.hasInsurance ? 'Insured' : 'Self-Pay'}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right: Patient Timeline & Actions */}
      <div className="flex-1 space-y-6">
        {selectedPatient ? (
          <>
            <div className="bg-white rounded-[2.5rem] p-10 border-4 border-slate-900 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div>
                <h2 className="text-4xl font-black text-slate-950 tracking-tighter uppercase">{selectedPatient.name}</h2>
                <div className="flex items-center gap-6 mt-4">
                   <div className="bg-slate-50 border-2 border-slate-200 p-4 rounded-2xl text-center min-w-[100px]">
                      <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase tracking-widest">Height</span>
                      <span className="text-xl font-black text-slate-950">{selectedPatient.height} CM</span>
                   </div>
                   <div className="bg-slate-50 border-2 border-slate-200 p-4 rounded-2xl text-center min-w-[100px]">
                      <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase tracking-widest">Weight</span>
                      <span className="text-xl font-black text-slate-950">{selectedPatient.weight} KG</span>
                   </div>
                </div>
              </div>
              <button 
                onClick={() => setShowActionForm(true)}
                className="bg-slate-950 text-white px-10 py-5 rounded-2xl font-black uppercase text-sm tracking-[0.2em] shadow-2xl hover:bg-blue-800 transition-all border-4 border-slate-800"
              >
                New Clinical Order
              </button>
            </div>

            <div className="bg-white rounded-[2.5rem] p-10 border-4 border-slate-100 shadow-xl min-h-[600px]">
              <h3 className="text-xl font-black mb-12 text-slate-950 flex items-center gap-4 uppercase border-b-8 border-slate-50 pb-6">
                Medical Records History
                <span className="bg-emerald-100 text-emerald-800 text-[10px] px-3 py-1 rounded-full border-2 border-emerald-300 font-black animate-pulse uppercase">Synced</span>
              </h3>
              
              <div className="space-y-12">
                {patientActions.length === 0 ? (
                  <p className="text-center py-40 font-black text-slate-200 text-3xl italic">No records found.</p>
                ) : patientActions.map(a => (
                  <div key={a.id} className="bg-slate-50 rounded-3xl p-8 border-4 border-slate-200 relative">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex gap-4">
                        <span className="bg-slate-900 text-white text-[10px] font-black px-3 py-1.5 rounded uppercase tracking-widest border-2 border-slate-800">
                          {a.type}
                        </span>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest py-1.5">
                          {new Date(a.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <button onClick={() => deleteAction(a.id)} className="text-red-300 hover:text-red-700 transition-colors">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                    <p className="text-slate-950 font-black text-2xl mb-6 leading-tight">"{a.description}"</p>
                    {a.timings && (
                      <p className="mb-4 text-xs font-black text-blue-900 bg-white inline-block px-3 py-1 rounded border-2 border-blue-100 uppercase tracking-widest">
                        Instructions: {a.timings}
                      </p>
                    )}
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-blue-900 bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-sm">
                      <span>Executing: {a.assignedTo}</span>
                      <span>Status: {a.status}</span>
                      {a.billAmount && <span className="text-emerald-700 font-black">Fee: ${a.billAmount.toFixed(2)}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-slate-50 rounded-[3rem] border-8 border-dashed border-slate-100 p-20 text-center">
            <p className="text-slate-300 font-black text-4xl uppercase tracking-tighter italic">Select Patient File</p>
          </div>
        )}
      </div>

      {showActionForm && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-[3rem] p-10 max-w-lg w-full border-8 border-slate-900 shadow-2xl overflow-y-auto max-h-[90vh]">
            <h3 className="text-3xl font-black mb-8 uppercase tracking-tighter text-slate-950">New Protocol Entry</h3>
            <form onSubmit={handleCreateAction} className="space-y-6">
              
              {/* Doctor Search & Select */}
              <div>
                <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">Referring/Collaborating Doctor</label>
                <div className="space-y-2">
                   <input 
                    type="text"
                    placeholder="Search doctor by name..."
                    className="w-full border-4 border-slate-100 rounded-xl p-3 text-sm font-bold focus:border-blue-900 outline-none"
                    value={doctorSearch}
                    onChange={e => setDoctorSearch(e.target.value)}
                   />
                   <select 
                    className="w-full border-4 border-slate-200 rounded-2xl p-4 text-slate-950 font-black focus:border-blue-900 outline-none uppercase text-xs" 
                    value={formData.referringDoctorId} 
                    onChange={e => setFormData({...formData, referringDoctorId: e.target.value})}
                   >
                    <option value="">No Consultation Required</option>
                    {filteredDoctors.map(d => (
                      <option key={d.id} value={d.id}>DR. {d.name.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">Protocol Type</label>
                <select className="w-full border-4 border-slate-200 rounded-2xl p-4 text-slate-950 font-black focus:border-blue-900 outline-none uppercase text-xs" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as ActionType})}>
                  <option value={ActionType.INSTRUCTION}>General Instruction</option>
                  <option value={ActionType.MEDICINE}>Prescription</option>
                  <option value={ActionType.TEST}>Laboratory Test</option>
                </select>
              </div>

              {/* Specific Dosage Frequency field for medicine */}
              {formData.type === ActionType.MEDICINE && (
                <div className="animate-fade-in">
                  <label className="block text-[10px] font-black text-blue-900 mb-2 uppercase tracking-widest">Dosage Frequency (Number of times per day)</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full border-4 border-blue-100 rounded-2xl p-4 text-slate-950 font-black focus:border-blue-900 outline-none placeholder:text-slate-300"
                    placeholder="e.g., 3 times daily, Before sleep, etc."
                    value={formData.timings}
                    onChange={e => setFormData({...formData, timings: e.target.value})}
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">Executing Department</label>
                <select className="w-full border-4 border-slate-200 rounded-2xl p-4 text-slate-950 font-black focus:border-blue-900 outline-none uppercase text-xs" value={formData.assignedTo} onChange={e => setFormData({...formData, assignedTo: e.target.value as UserRole})}>
                  <option value={UserRole.NURSE}>Nurse Station</option>
                  <option value={UserRole.LAB}>Laboratory</option>
                  <option value={UserRole.PHARMACY}>Pharmacy</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">Description & Orders</label>
                <textarea required className="w-full border-4 border-slate-200 rounded-2xl p-4 text-slate-950 font-bold focus:border-blue-900 outline-none" rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe dosage details, test parameters, or specific care instructions..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button type="button" onClick={() => setShowActionForm(false)} className="bg-slate-100 text-slate-400 py-5 rounded-2xl font-black uppercase text-xs tracking-widest border-4 border-transparent hover:border-slate-300">Abort</button>
                <button type="submit" className="bg-blue-900 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] border-4 border-black shadow-xl">Commit Order</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
