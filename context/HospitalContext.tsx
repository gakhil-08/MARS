
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Patient, PatientAction, Appointment, User, UserRole, Notification } from '../types';

interface HospitalContextType {
  patients: Patient[];
  actions: PatientAction[];
  appointments: Appointment[];
  staff: User[];
  notifications: Notification[];
  addPatient: (patient: Patient) => void;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  addAction: (action: PatientAction) => void;
  deleteAction: (id: string) => void;
  updateActionStatus: (id: string, updates: Partial<PatientAction>) => void;
  addAppointment: (appointment: Appointment) => void;
  addNotification: (userId: string, role: UserRole, message: string) => void;
  clearNotifications: () => void;
  addStaff: (user: User) => void;
  deleteStaff: (id: string) => void;
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

export const HospitalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [actions, setActions] = useState<PatientAction[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [staff, setStaff] = useState<User[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const p = localStorage.getItem('h_patients');
    const a = localStorage.getItem('h_actions');
    const app = localStorage.getItem('h_appointments');
    const s = localStorage.getItem('h_staff_accounts');
    
    if (p) setPatients(JSON.parse(p));
    if (a) setActions(JSON.parse(a));
    if (app) setAppointments(JSON.parse(app));
    if (s) setStaff(JSON.parse(s));
  }, []);

  useEffect(() => {
    localStorage.setItem('h_patients', JSON.stringify(patients));
    localStorage.setItem('h_actions', JSON.stringify(actions));
    localStorage.setItem('h_appointments', JSON.stringify(appointments));
    localStorage.setItem('h_staff_accounts', JSON.stringify(staff));
  }, [patients, actions, appointments, staff]);

  const addPatient = (patient: Patient) => {
    setPatients(prev => [...prev, patient]);
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deletePatient = (id: string) => {
    setPatients(prev => prev.filter(p => p.id !== id));
    setActions(prev => prev.filter(a => a.patientId !== id));
  };

  const addAction = (action: PatientAction) => {
    setActions(prev => [...prev, action]);
    addNotification(action.assignedTo, action.assignedTo, `New ${action.type.toLowerCase()} assigned for Patient ID: ${action.patientId}`);
  };

  const deleteAction = (id: string) => {
    setActions(prev => prev.filter(a => a.id !== id));
  };

  const updateActionStatus = (id: string, updates: Partial<PatientAction>) => {
    setActions(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const addAppointment = (app: Appointment) => {
    setAppointments(prev => [...prev, app]);
  };

  const addNotification = (userId: string, role: UserRole, message: string) => {
    const newNote: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      role,
      message,
      timestamp: Date.now(),
      read: false
    };
    setNotifications(prev => [newNote, ...prev].slice(0, 10));
  };

  const clearNotifications = () => setNotifications([]);

  const addStaff = (user: User) => {
    setStaff(prev => {
      const exists = prev.find(s => s.email === user.email);
      if (exists) return prev; // Avoid duplicates
      return [...prev, user];
    });
  };

  const deleteStaff = (id: string) => {
    setStaff(prev => prev.filter(s => s.id !== id));
  };

  return (
    <HospitalContext.Provider value={{
      patients, actions, appointments, staff, notifications,
      addPatient, updatePatient, deletePatient, addAction, deleteAction, updateActionStatus, addAppointment, addNotification, clearNotifications, addStaff, deleteStaff
    }}>
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (context === undefined) throw new Error('useHospital must be used within a HospitalProvider');
  return context;
};
