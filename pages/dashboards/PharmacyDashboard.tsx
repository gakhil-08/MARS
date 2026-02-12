
import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { ActionType, ActionStatus, UserRole } from '../../types';

const PharmacyDashboard: React.FC = () => {
  const { actions, patients, updateActionStatus, updatePatient } = useHospital();
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [viewingBillManager, setViewingBillManager] = useState(false);

  const myTasks = actions.filter(a => a.assignedTo === UserRole.PHARMACY && a.status === ActionStatus.PENDING);
  const completedTasks = actions.filter(a => a.assignedTo === UserRole.PHARMACY && a.status === ActionStatus.COMPLETED);

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAction) return;
    updateActionStatus(selectedAction, {
      status: ActionStatus.COMPLETED,
      billAmount: parseFloat(amount)
    });
    setSelectedAction(null);
    setAmount('');
  };

  const setAsPaid = (pId: string) => {
    updatePatient(pId, { paymentStatus: 'COMPLETED' });
  };

  const setAsDue = (pId: string) => {
    updatePatient(pId, { paymentStatus: 'DUE' });
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 rounded-[2.5rem] border-4 border-slate-900 shadow-2xl gap-6">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-blue-100 text-blue-900 rounded-3xl flex items-center justify-center border-4 border-blue-200">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-950 uppercase tracking-tighter">Pharmacy & Billing</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Dispensing and Account Settlement</p>
          </div>
        </div>
        
        <button 
          onClick={() => setViewingBillManager(!viewingBillManager)}
          className={`px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest border-4 transition-all shadow-xl ${viewingBillManager ? 'bg-slate-900 text-white border-slate-950' : 'bg-blue-800 text-white border-blue-950 hover:bg-blue-900'}`}
        >
          {viewingBillManager ? 'View Medicine Queue' : 'Manage Patient Bills'}
        </button>
      </div>

      {!viewingBillManager ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <section className="bg-white rounded-[2.5rem] p-10 border-4 border-slate-100 shadow-xl">
            <h3 className="text-xl font-black mb-8 uppercase flex items-center gap-3">
              <span className="w-3 h-3 bg-amber-500 rounded-full border-2 border-slate-900"></span>
              Medicine Queue
            </h3>
            <div className="space-y-6">
              {myTasks.length === 0 ? (
                <div className="py-20 text-center font-black text-slate-200 uppercase italic">All filled.</div>
              ) : myTasks.map(task => (
                <div key={task.id} className="p-8 bg-slate-50 rounded-3xl border-4 border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="text-center md:text-left flex-1">
                    <span className="font-black text-[10px] text-blue-800 block mb-2 uppercase tracking-[0.2em]">{task.patientId} • MEDICINE ORDER</span>
                    <p className="font-black text-2xl text-slate-950 leading-tight">"{task.description}"</p>
                  </div>
                  <button 
                    onClick={() => setSelectedAction(task.id)}
                    className="bg-slate-950 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest border-4 border-slate-800 shadow-lg active:scale-95"
                  >
                    Confirm & Bill
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-[2.5rem] p-10 border-4 border-slate-100 shadow-xl">
            <h3 className="text-xl font-black mb-8 uppercase flex items-center gap-3">
              <span className="w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900"></span>
              Past Dispensations
            </h3>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {completedTasks.sort((a,b) => b.timestamp - a.timestamp).map(task => (
                <div key={task.id} className="p-6 bg-emerald-50/50 rounded-2xl border-4 border-emerald-100 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-black text-slate-950 uppercase mb-1">{task.description}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {task.patientId}</p>
                  </div>
                  <div className="text-lg font-black text-emerald-700 bg-white px-3 py-1 rounded-lg border-2 border-emerald-100">${task.billAmount?.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : (
        /* Patient Bill Manager */
        <section className="bg-white rounded-[3rem] p-12 border-4 border-slate-900 shadow-2xl">
          <h3 className="text-2xl font-black mb-12 uppercase tracking-tighter flex items-center gap-4">
            Patient Payment Status Control
            <span className="h-[4px] flex-1 bg-slate-100"></span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {patients.length === 0 ? (
              <p className="col-span-full py-20 text-center font-black text-slate-300 uppercase">No active patients.</p>
            ) : patients.map(p => {
              const patientBill = actions.filter(a => a.patientId === p.id).reduce((s, a) => s + (a.billAmount || 0), 0);
              const isPaid = p.paymentStatus === 'COMPLETED';
              return (
                <div key={p.id} className="bg-slate-50 p-8 rounded-[2rem] border-4 border-slate-200 shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="font-black text-2xl text-slate-950 leading-none">{p.name}</div>
                      <span className="text-[10px] font-black text-slate-400 uppercase">ID: {p.id}</span>
                    </div>
                    
                    <div className="bg-white p-6 rounded-2xl border-4 border-slate-100 shadow-inner mb-6 text-center">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Total Due</span>
                      <span className="text-4xl font-black text-slate-950 tracking-tighter">${patientBill.toFixed(2)}</span>
                    </div>

                    <div className={`mb-8 text-center p-3 rounded-xl border-4 font-black uppercase text-xs tracking-widest ${isPaid ? 'bg-emerald-100 text-emerald-900 border-emerald-400' : 'bg-red-100 text-red-900 border-red-400'}`}>
                      {isPaid ? 'Payment Received' : 'Payment Outstanding'}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {!isPaid ? (
                      <button 
                        onClick={() => setAsPaid(p.id)}
                        className="w-full bg-emerald-700 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest border-4 border-emerald-950 shadow-lg hover:bg-emerald-800 transition-all"
                      >
                        Mark as Completed
                      </button>
                    ) : (
                      <button 
                        onClick={() => setAsDue(p.id)}
                        className="w-full bg-slate-200 text-slate-600 py-4 rounded-2xl font-black uppercase text-xs tracking-widest border-4 border-slate-300 hover:bg-red-50 hover:text-red-900 hover:border-red-400 transition-all"
                      >
                        Re-open Payment Due
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {selectedAction && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-[3rem] p-10 max-w-sm w-full border-8 border-slate-900 shadow-2xl">
            <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter text-slate-950 text-center">Confirm Charges</h3>
            <p className="text-slate-500 font-bold mb-8 text-xs uppercase tracking-widest text-center">Add dispense fee to patient ledger.</p>
            <form onSubmit={handleComplete} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Billing Amount ($)</label>
                <input required type="number" step="0.01" className="w-full border-4 border-slate-200 rounded-2xl p-4 font-black text-slate-950 outline-none focus:border-blue-900 transition-all text-center text-4xl" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" autoFocus />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button type="button" onClick={() => setSelectedAction(null)} className="bg-slate-100 text-slate-400 py-4 rounded-xl font-black uppercase text-xs">Abort</button>
                <button type="submit" className="bg-blue-900 text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest border-4 border-black shadow-xl">Confirm</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacyDashboard;
