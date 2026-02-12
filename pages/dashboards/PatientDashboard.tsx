
import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { useAuth } from '../../context/AuthContext';
import { ActionStatus, ActionType } from '../../types';
import ChatBot from '../../components/ChatBot';

const PatientDashboard: React.FC = () => {
  const { actions, appointments, addAppointment, staff, patients } = useHospital();
  const { patientUser } = useAuth();
  const [showBooking, setShowBooking] = useState(false);
  const [bookingData, setBookingData] = useState({ doctorId: '', date: '', time: '' });

  if (!patientUser) return null;

  const patientDetails = patients.find(p => p.id === patientUser.id);
  const myActions = actions.filter(a => a.patientId === patientUser.id).sort((a, b) => b.timestamp - a.timestamp);
  const totalBill = myActions.reduce((sum, a) => sum + (a.billAmount || 0), 0);
  const myAppointments = appointments.filter(app => app.patientId === patientUser.id);
  const doctors = staff.filter(s => s.role === 'DOCTOR' as any);

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    addAppointment({
      id: Math.random().toString(36).substr(2, 9),
      patientId: patientUser.id,
      doctorId: bookingData.doctorId,
      date: bookingData.date,
      time: bookingData.time,
      status: 'Scheduled'
    });
    setShowBooking(false);
  };

  const isPaid = patientDetails?.paymentStatus === 'COMPLETED';

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile & Billing */}
        <div className="space-y-6">
          <div className="bg-white rounded-[2.5rem] p-10 border-4 border-slate-900 shadow-2xl relative overflow-hidden">
            {/* Status Banner */}
            <div className={`absolute top-0 right-0 px-8 py-4 rounded-bl-[2.5rem] font-black text-xs tracking-[0.2em] shadow-xl border-l-4 border-b-4 border-black/10 ${isPaid ? 'bg-emerald-600 text-white' : 'bg-red-700 text-white animate-pulse'}`}>
              {isPaid ? 'PAYMENT COMPLETED' : 'PAYMENT IS DUE'}
            </div>
            
            <div className="w-24 h-24 bg-blue-100 text-blue-900 rounded-[2rem] flex items-center justify-center mb-8 text-4xl font-black shadow-inner border-4 border-blue-200">
              {patientUser.name[0]}
            </div>
            
            <h2 className="text-3xl font-black text-slate-950 tracking-tighter uppercase leading-none">{patientUser.name}</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-[10px] font-black text-blue-900 font-mono bg-blue-50 px-3 py-1 rounded-lg border-2 border-blue-100 uppercase tracking-widest">ID: {patientUser.id}</span>
              <span className="text-[10px] font-black text-slate-500 bg-slate-50 px-3 py-1 rounded-lg border-2 border-slate-100 uppercase tracking-widest">WARD: {patientDetails?.roomNo}</span>
            </div>
            
            {patientDetails && (
              <div className="mt-10 grid grid-cols-2 gap-4 border-t-4 border-slate-50 pt-8">
                <div className="bg-slate-50 p-6 rounded-3xl border-4 border-slate-100 text-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Weight</span>
                  <div className="font-black text-slate-950 text-2xl">{patientDetails.weight} kg</div>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl border-4 border-slate-100 text-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Height</span>
                  <div className="font-black text-slate-950 text-2xl">{patientDetails.height} cm</div>
                </div>
              </div>
            )}

            <div className="mt-10 pt-10 border-t-8 border-slate-50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Total Billing</h3>
                {patientDetails?.hasInsurance && (
                  <span className="bg-emerald-100 text-emerald-900 text-[8px] font-black px-3 py-1.5 rounded-full border-2 border-emerald-300 uppercase tracking-widest">Insured</span>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-7xl font-black text-slate-950 tracking-tighter">${totalBill.toFixed(2)}</span>
                {!isPaid && (
                   <p className="mt-6 text-[10px] font-black text-red-900 uppercase tracking-[0.2em] bg-red-50 p-4 rounded-2xl border-4 border-red-100 text-center">
                    Please visit the Pharmacy window to clear your balance.
                  </p>
                )}
                {isPaid && (
                  <p className="mt-6 text-[10px] font-black text-emerald-900 uppercase tracking-[0.2em] bg-emerald-50 p-4 rounded-2xl border-4 border-emerald-100 text-center">
                    No outstanding balance. Thank you!
                  </p>
                )}
              </div>
            </div>
          </div>

          <button 
            onClick={() => setShowBooking(true)}
            className="w-full bg-slate-950 text-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] hover:bg-blue-800 transition-all shadow-2xl border-4 border-slate-800 active:scale-95 flex items-center justify-center gap-4"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" /></svg>
            Book Specialist Consult
          </button>
        </div>

        {/* Clinical History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[3rem] p-12 border-4 border-slate-100 shadow-2xl min-h-[800px]">
            <h3 className="text-3xl font-black mb-12 text-slate-950 flex flex-col md:flex-row md:items-center gap-6 uppercase tracking-tighter border-b-8 border-slate-50 pb-8">
              Medical Care Timeline
              <span className="bg-blue-50 text-blue-900 text-[10px] px-4 py-2 rounded-full border-2 border-blue-200 font-black tracking-[0.2em]">Live Records</span>
            </h3>
            
            <div className="space-y-16 relative before:content-[''] before:absolute before:left-[19px] before:top-4 before:bottom-0 before:w-[4px] before:bg-slate-100">
              {myActions.length === 0 ? (
                <div className="text-center py-60">
                  <p className="text-slate-200 font-black text-4xl uppercase tracking-tighter italic">No clinical entries found.</p>
                </div>
              ) : myActions.map(a => (
                <div key={a.id} className="relative pl-16">
                  <div className={`absolute left-0 top-2 w-10 h-10 rounded-full border-4 border-white shadow-2xl flex items-center justify-center z-10 ${a.status === ActionStatus.COMPLETED ? 'bg-emerald-700' : 'bg-amber-600'}`}>
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <div className="bg-slate-50 rounded-[2.5rem] p-10 border-4 border-slate-100 shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all group">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                       <span className={`text-[10px] font-black px-4 py-2 rounded-xl border-2 uppercase tracking-[0.2em] ${a.type === ActionType.TEST ? 'bg-purple-100 text-purple-900 border-purple-200' : a.type === ActionType.MEDICINE ? 'bg-blue-100 text-blue-900 border-blue-200' : 'bg-slate-200 text-slate-950 border-slate-300'}`}>
                        {a.type}
                      </span>
                      <span className="text-xs text-slate-400 font-black uppercase tracking-[0.2em]">{new Date(a.timestamp).toLocaleDateString()}</span>
                    </div>
                    
                    <p className="font-black text-slate-950 text-3xl mb-8 leading-tight tracking-tighter group-hover:text-blue-900 transition-colors">"{a.description}"</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                      {a.timings && (
                        <div className="bg-white p-6 rounded-[2rem] border-4 border-slate-100 shadow-sm flex items-center gap-6">
                          <div className="bg-blue-100 p-4 rounded-2xl text-blue-900">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          </div>
                          <div>
                            <span className="text-[10px] font-black text-slate-400 uppercase block tracking-[0.2em] mb-1">Instruction</span>
                            <span className="text-sm font-black text-slate-950">{a.timings}</span>
                          </div>
                        </div>
                      )}

                      {a.location && (
                        <div className="bg-white p-6 rounded-[2rem] border-4 border-slate-100 shadow-sm flex items-center gap-6">
                          <div className="bg-red-50 p-4 rounded-2xl text-red-800">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                          </div>
                          <div>
                            <span className="text-[10px] font-black text-slate-400 uppercase block tracking-[0.2em] mb-1">Clinic Zone</span>
                            <span className="text-sm font-black text-slate-950">{a.location}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-12 pt-8 border-t-4 border-slate-100 flex flex-wrap justify-between items-center gap-6">
                      <span className={`px-6 py-2 rounded-full border-4 text-[10px] font-black uppercase tracking-[0.2em] ${a.status === ActionStatus.COMPLETED ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-amber-100 text-amber-900 border-amber-300'}`}>
                        {a.status}
                      </span>
                      {a.billAmount && (
                        <span className="text-slate-950 font-black bg-white px-6 py-3 rounded-2xl border-4 border-slate-100 shadow-sm tracking-tighter">
                          Cost: <span className="text-blue-900 text-xl ml-2">${a.billAmount.toFixed(2)}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ChatBot patientId={patientUser.id} />

      {showBooking && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 z-[110]">
          <div className="bg-white rounded-[3rem] p-12 max-w-md w-full border-8 border-slate-900 shadow-2xl">
            <h3 className="text-3xl font-black mb-10 text-slate-950 tracking-tighter uppercase">Consultation Request</h3>
            <form onSubmit={handleBook} className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-[0.2em]">Medical Officer</label>
                <select required className="w-full border-4 border-slate-100 rounded-[1.5rem] p-5 bg-slate-50 text-slate-950 font-black focus:border-blue-900 outline-none uppercase transition-all" value={bookingData.doctorId} onChange={e => setBookingData({...bookingData, doctorId: e.target.value})}>
                  <option value="">Select Dr...</option>
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>DR. {d.name.toUpperCase()}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-[0.2em]">Preferred Date</label>
                  <input required type="date" className="w-full border-4 border-slate-100 rounded-[1.5rem] p-5 bg-slate-50 text-slate-950 font-black focus:border-blue-900 outline-none" value={bookingData.date} onChange={e => setBookingData({...bookingData, date: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-[0.2em]">Preferred Time</label>
                  <input required type="time" className="w-full border-4 border-slate-100 rounded-[1.5rem] p-5 bg-slate-50 text-slate-950 font-black focus:border-blue-900 outline-none" value={bookingData.time} onChange={e => setBookingData({...bookingData, time: e.target.value})} />
                </div>
              </div>
              <div className="flex gap-4 pt-10">
                <button type="button" onClick={() => setShowBooking(false)} className="flex-1 bg-slate-100 text-slate-400 py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-widest hover:bg-slate-200">Abort</button>
                <button type="submit" className="flex-1 bg-blue-900 text-white py-5 rounded-[1.5rem] font-black shadow-2xl hover:bg-black transition-all uppercase text-xs tracking-[0.2em] border-4 border-black">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
