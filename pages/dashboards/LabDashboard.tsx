
import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { ActionType, ActionStatus, UserRole } from '../../types';

const LabDashboard: React.FC = () => {
  const { actions, updateActionStatus } = useHospital();
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [result, setResult] = useState('');
  const [amount, setAmount] = useState('');

  const myTasks = actions.filter(a => a.assignedTo === UserRole.LAB && a.status === ActionStatus.PENDING);
  const completedTasks = actions.filter(a => a.assignedTo === UserRole.LAB && a.status === ActionStatus.COMPLETED);

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAction) return;
    updateActionStatus(selectedAction, {
      status: ActionStatus.COMPLETED,
      result,
      billAmount: parseFloat(amount)
    });
    setSelectedAction(null);
    setResult('');
    setAmount('');
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Laboratory Dashboard</h2>
        <p className="text-slate-500">Processing test orders and diagnostic reports</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-white rounded-2xl p-6 border border-slate-200">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Pending Tests
          </h3>
          <div className="space-y-4">
            {myTasks.length === 0 ? (
              <p className="text-slate-400 text-center py-10">No pending lab orders.</p>
            ) : myTasks.map(task => (
              <div key={task.id} className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono text-xs font-bold text-blue-600">ID: {task.patientId}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{new Date(task.timestamp).toLocaleDateString()}</span>
                </div>
                <p className="font-semibold text-slate-800 mb-4">{task.description}</p>
                <button 
                  onClick={() => setSelectedAction(task.id)}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all"
                >
                  Process Results
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl p-6 border border-slate-200">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Recently Completed
          </h3>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {completedTasks.map(task => (
              <div key={task.id} className="p-5 bg-emerald-50/50 rounded-xl border border-emerald-100">
                <div className="flex justify-between items-start mb-2">
                   <span className="font-mono text-xs font-bold text-emerald-600">ID: {task.patientId}</span>
                   <span className="text-[10px] text-emerald-400 font-bold uppercase">Done</span>
                </div>
                <p className="font-medium text-slate-700 mb-1">{task.description}</p>
                <p className="text-sm text-slate-500 italic mb-2">Result: {task.result}</p>
                <div className="text-xs font-bold text-slate-400">Bill: ${task.billAmount?.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {selectedAction && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold mb-6 text-slate-800">Submit Test Report</h3>
            <form onSubmit={handleComplete} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Diagnostic Findings</label>
                <textarea required className="w-full border rounded-lg p-3" rows={4} value={result} onChange={e => setResult(e.target.value)} placeholder="Enter full test report..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Service Bill Amount ($)</label>
                <input required type="number" step="0.01" className="w-full border rounded-lg p-3" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setSelectedAction(null)} className="flex-1 bg-slate-100 py-3 rounded-lg font-bold">Cancel</button>
                <button type="submit" className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-bold">Complete & Bill</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabDashboard;
