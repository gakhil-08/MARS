
import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { useAuth } from '../../context/AuthContext';
import { Patient, ActionStatus, UserRole, ActionType } from '../../types';

const NurseDashboard: React.FC = () => {
  const { patients, actions, addPatient, deletePatient, updateActionStatus } = useHospital();
  const { user } = useAuth();
  const [showAdd, setShowAdd] = useState(false);
  const [viewingTasksPatientId, setViewingTasksPatientId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    age: '', 
    problem: '', 
    weight: '', 
    height: '', 
    roomNo: '', 
    hasInsurance: false 
  });
  const [newPatientInfo, setNewPatientInfo] = useState<{ id: string, pass: string } | null>(null);

  const pendingNurseTasks = actions.filter(
    (a) => a.assignedTo === UserRole.NURSE && a.status === ActionStatus.PENDING
  );

  const completedNurseTasks = actions.filter(
    (a) => a.assignedTo === UserRole.NURSE && a.status === ActionStatus.COMPLETED
  );

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    const patientId = 'PAT' + Math.floor(100000 + Math.random() * 900000);
    const defaultPass = 'Hospice2025';
    
    const patient: Patient = {
      id: patientId,
      name: formData.name,
      age: parseInt(formData.age),
      problem: formData.problem,
      weight: parseFloat(formData.weight) || 0,
      height: parseFloat(formData.height) || 0,
      roomNo: formData.roomNo,
      password: defaultPass,
      createdBy: user?.id || 'sys',
      createdAt: Date.now(),
      hasInsurance: formData.hasInsurance,
      paymentStatus: 'DUE'
    };

    addPatient(patient);
    setNewPatientInfo({ id: patientId, pass: defaultPass });
    setFormData({ name: '', age: '', problem: '', weight: '', height: '', roomNo: '', hasInsurance: false });
  };

  const handleCompleteTask = (taskId: string) => {
    updateActionStatus(taskId, { status: ActionStatus.COMPLETED });
  };

  const selectedPatientForTasks = patients.find(p => p.id === viewingTasksPatientId);
  const specificPatientTasks = actions.filter(a => a.patientId === viewingTasksPatientId);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-950 tracking-tight uppercase">Nurse Command Center</h2>
          <p className="text-slate-900 font-bold mt-1 uppercase text-[10px] tracking-widest text-slate-500">Ward Management & Patient Admission</p>
        </div>
        <button 
          onClick={() => { setShowAdd(true); setNewPatientInfo(null); }}
          className="bg-blue-800 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-blue-900 transition-all shadow-xl shadow-blue-100 border-2 border-blue-900"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          ADMIT NEW PATIENT
        </button>
      </div>

      {/* ACTIVE ASSIGNMENTS */}
      <section className="space-y-4">
        <h3 className="text-xl font-black text-slate-950 uppercase flex items-center gap-2">
          <span className="w-4 h-4 bg-amber-500 rounded-full border-2 border-slate-900"></span>
          Immediate Assignments
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingNurseTasks.length === 0 ? (
            <div className="col-span-full bg-slate-50 border-4 border-dashed border-slate-200 rounded-3xl p-10 text-center">
              <p className="text-slate-400 font-black text-lg uppercase tracking-widest">Active Queue Empty</p>
            </div>
          ) : (
            pendingNurseTasks.map((task) => {
              const patient = patients.find((p) => p.id === task.patientId);
              return (
                <div key={task.id} className="bg-white rounded-3xl border-4 border-slate-900 p-6 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="bg-blue-900 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter">
                        {task.type}
                      </span>
                      <span className="font-black text-blue-900 text-sm bg-blue-50 px-2 py-1 rounded border border-blue-200 uppercase">ROOM: {patient?.roomNo || 'N/A'}</span>
                    </div>
                    <h4 className="font-black text-slate-950 text-xl mb-3 underline decoration-blue-200 underline-offset-4">{patient?.name || 'Unknown Patient'}</h4>
                    <p className="text-slate-950 font-black text-lg bg-slate-100 p-4 rounded-xl border-2 border-slate-200 italic leading-snug">
                      "{task.description}"
                    </p>
                    {task.timings && (
                      <div className="mt-4 bg-amber-50 border-2 border-amber-200 p-3 rounded-xl flex items-center gap-2">
                        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span className="text-xs font-black text-amber-900 uppercase tracking-widest">Dosage: {task.timings}</span>
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => handleCompleteTask(task.id)}
                    className="mt-6 w-full bg-emerald-700 text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest border-2 border-emerald-900 hover:bg-emerald-800 transition-colors"
                  >
                    Mark Work as Done
                  </button>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* COMPLETED WORK LOG - "SHOW THE WORK" */}
      <section className="space-y-4">
        <h3 className="text-xl font-black text-slate-950 uppercase flex items-center gap-2">
          <span className="w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900"></span>
          Completed Work Log
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {completedNurseTasks.length === 0 ? (
            <div className="col-span-full py-10 text-center font-black text-slate-200 uppercase tracking-widest">No history found.</div>
          ) : (
            completedNurseTasks.sort((a,b) => b.timestamp - a.timestamp).map((task) => {
              const patient = patients.find((p) => p.id === task.patientId);
              return (
                <div key={task.id} className="bg-emerald-50 rounded-2xl border-4 border-emerald-100 p-4 opacity-70 hover:opacity-100 transition-opacity">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[8px] font-black text-emerald-900 uppercase bg-emerald-200 px-1.5 py-0.5 rounded tracking-widest">{task.type}</span>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Room {patient?.roomNo}</span>
                  </div>
                  <h5 className="font-black text-slate-950 text-sm truncate">{patient?.name}</h5>
                  <p className="text-[10px] text-slate-500 font-bold line-clamp-2 mt-1">"{task.description}"</p>
                  {task.timings && <p className="text-[8px] font-black text-emerald-800 mt-2 uppercase">Scheduled: {task.timings}</p>}
                </div>
              );
            })
          )}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-black text-slate-950 uppercase flex items-center gap-2">
          <span className="w-4 h-4 bg-blue-700 rounded-full border-2 border-slate-900"></span>
          Ward Census
        </h3>
        <div className="bg-white rounded-3xl border-4 border-slate-900 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-900 text-white text-xs font-black uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-6 border-r border-slate-800">Patient</th>
                  <th className="px-6 py-6 border-r border-slate-800">Room</th>
                  <th className="px-6 py-6 border-r border-slate-800 text-center">Vitals (Ht/Wt)</th>
                  <th className="px-6 py-6 border-r border-slate-800 text-center">Insurance Status</th>
                  <th className="px-6 py-6 border-r border-slate-800">Actions</th>
                  <th className="px-6 py-6 text-right">Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y-4 divide-slate-100">
                {patients.length === 0 ? (
                  <tr><td colSpan={6} className="p-20 text-center font-black text-slate-300 uppercase italic">Ward Empty</td></tr>
                ) : patients.map(p => {
                  const pendingCount = actions.filter(a => a.patientId === p.id && a.status === ActionStatus.PENDING).length;
                  return (
                    <tr key={p.id} className="hover:bg-blue-50">
                      <td className="px-6 py-8">
                        <div className="font-black text-slate-950 text-xl leading-none">{p.name}</div>
                        <div className="text-[10px] text-blue-900 font-bold mt-1 uppercase">ID: {p.id}</div>
                      </td>
                      <td className="px-6 py-8 font-black text-slate-950 text-lg uppercase">{p.roomNo}</td>
                      <td className="px-6 py-8 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-black text-slate-950">{p.height} cm</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{p.weight} kg</span>
                        </div>
                      </td>
                      <td className="px-6 py-8 text-center">
                        <span className={`px-4 py-1.5 rounded-full border-2 text-[10px] font-black uppercase tracking-widest ${p.hasInsurance ? 'bg-emerald-100 text-emerald-900 border-emerald-400' : 'bg-red-100 text-red-900 border-red-400'}`}>
                          {p.hasInsurance ? 'INSURED' : 'UNINSURED'}
                        </span>
                      </td>
                      <td className="px-6 py-8">
                        <button 
                          onClick={() => setViewingTasksPatientId(p.id)}
                          className="text-xs font-black bg-slate-950 text-white px-4 py-2 rounded-xl uppercase tracking-widest border-2 border-slate-800"
                        >
                          View {pendingCount} Tasks
                        </button>
                      </td>
                      <td className="px-6 py-8 text-right">
                        <button onClick={() => deletePatient(p.id)} className="text-red-600 hover:text-red-900 p-2"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* --- TASK MODAL --- */}
      {viewingTasksPatientId && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4 z-[110]">
          <div className="bg-white rounded-[3rem] p-10 max-w-2xl w-full border-8 border-slate-900">
            <h3 className="text-3xl font-black mb-2 uppercase tracking-tighter">Clinical Record</h3>
            <p className="text-blue-900 font-black mb-8 border-b-4 border-slate-100 pb-4 uppercase tracking-widest text-xs">Patient: {selectedPatientForTasks?.name}</p>
            <div className="space-y-6 max-h-[50vh] overflow-y-auto">
              {specificPatientTasks.length === 0 ? <p className="text-center font-bold text-slate-400 italic py-10">No records found.</p> : specificPatientTasks.sort((a,b) => b.timestamp - a.timestamp).map(task => (
                <div key={task.id} className={`p-6 rounded-2xl border-4 ${task.status === ActionStatus.COMPLETED ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex justify-between items-center mb-4">
                    <span className="bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded uppercase">{task.type}</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${task.status === ActionStatus.COMPLETED ? 'text-emerald-700' : 'text-slate-500'}`}>{task.status}</span>
                  </div>
                  <p className="font-black text-slate-950 text-xl leading-snug">{task.description}</p>
                  {task.timings && <p className="mt-2 text-xs font-black text-blue-900 uppercase tracking-widest">Instruction: {task.timings}</p>}
                  {task.status === ActionStatus.PENDING && (
                    <button onClick={() => handleCompleteTask(task.id)} className="mt-6 w-full bg-emerald-700 text-white py-3 rounded-xl font-black uppercase text-xs border-2 border-emerald-900">Mark Completed</button>
                  )}
                </div>
              ))}
            </div>
            <button onClick={() => setViewingTasksPatientId(null)} className="mt-10 w-full bg-slate-950 text-white py-4 rounded-2xl font-black uppercase text-sm tracking-widest">Close Record</button>
          </div>
        </div>
      )}

      {/* --- ADMISSION MODAL --- */}
      {showAdd && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-lg w-full border-8 border-slate-900 shadow-2xl overflow-y-auto max-h-[95vh]">
            {!newPatientInfo ? (
              <>
                <h3 className="text-3xl font-black mb-8 uppercase tracking-tighter text-slate-950">New Admission</h3>
                <form onSubmit={handleAddPatient} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2">
                      <label className="block text-xs font-black text-slate-950 mb-2 uppercase tracking-widest">Legal Name</label>
                      <input required type="text" className="w-full border-4 border-slate-100 rounded-2xl p-4 text-slate-950 font-black focus:border-blue-900 outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-950 mb-2 uppercase tracking-widest">Age (Years)</label>
                      <input required type="number" className="w-full border-4 border-slate-100 rounded-2xl p-4 text-slate-950 font-black focus:border-blue-900 outline-none" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-950 mb-2 uppercase tracking-widest">Unit No.</label>
                      <input required type="text" className="w-full border-4 border-slate-100 rounded-2xl p-4 text-slate-950 font-black focus:border-blue-900 outline-none" value={formData.roomNo} onChange={e => setFormData({...formData, roomNo: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-950 mb-2 uppercase tracking-widest">Weight (kg)</label>
                      <input required type="number" step="0.1" className="w-full border-4 border-slate-100 rounded-2xl p-4 text-slate-950 font-black focus:border-blue-900 outline-none" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} placeholder="0.0" />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-950 mb-2 uppercase tracking-widest">Height (cm)</label>
                      <input required type="number" step="1" className="w-full border-4 border-slate-100 rounded-2xl p-4 text-slate-950 font-black focus:border-blue-900 outline-none" value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} placeholder="0" />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 bg-blue-50 p-5 rounded-2xl border-4 border-blue-100">
                    <input 
                      type="checkbox" 
                      id="ins" 
                      className="w-8 h-8 rounded accent-blue-900 cursor-pointer" 
                      checked={formData.hasInsurance} 
                      onChange={e => setFormData({...formData, hasInsurance: e.target.checked})} 
                    />
                    <label htmlFor="ins" className="font-black text-slate-950 uppercase tracking-widest text-xs cursor-pointer select-none">Patient has active insurance</label>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-950 mb-2 uppercase tracking-widest">Admission Problem</label>
                    <textarea required className="w-full border-4 border-slate-100 rounded-2xl p-4 text-slate-950 font-bold focus:border-blue-900 outline-none" rows={3} value={formData.problem} onChange={e => setFormData({...formData, problem: e.target.value})} />
                  </div>

                  <button type="submit" className="w-full bg-blue-900 text-white py-5 rounded-2xl font-black uppercase text-sm border-4 border-black shadow-xl hover:bg-black transition-colors">Commit Admission</button>
                  <button type="button" onClick={() => setShowAdd(false)} className="w-full text-slate-400 font-black uppercase text-xs tracking-widest mt-2">Cancel Admission</button>
                </form>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-950 rounded-3xl flex items-center justify-center mx-auto mb-8 border-4 border-emerald-300">
                  <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter">Registration Success</h3>
                <div className="bg-slate-950 border-8 border-blue-900 rounded-[2rem] p-10 text-left mb-10 shadow-2xl">
                  <div className="flex justify-between items-center mb-8 border-b-4 border-blue-900/50 pb-8">
                    <span className="text-blue-400 font-black uppercase text-xs tracking-widest">ID Token</span>
                    <span className="font-black text-white text-3xl bg-blue-900 px-4 py-2 rounded-xl border-2 border-blue-700">{newPatientInfo.id}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-400 font-black uppercase text-xs tracking-widest">Passcode</span>
                    <span className="font-black text-white text-3xl bg-emerald-900 px-4 py-2 rounded-xl border-2 border-emerald-700">{newPatientInfo.pass}</span>
                  </div>
                </div>
                <button onClick={() => setShowAdd(false)} className="w-full bg-blue-800 text-white py-5 rounded-2xl font-black uppercase text-sm border-4 border-blue-900">Confirm & Exit</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NurseDashboard;
