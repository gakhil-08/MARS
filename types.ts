
export enum UserRole {
  DOCTOR = 'DOCTOR',
  NURSE = 'NURSE',
  LAB = 'LAB',
  PHARMACY = 'PHARMACY',
  PATIENT = 'PATIENT',
  ADMIN = 'ADMIN'
}

export enum ActionType {
  TEST = 'TEST',
  MEDICINE = 'MEDICINE',
  INSTRUCTION = 'INSTRUCTION'
}

export enum ActionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isOnline: boolean;
  password?: string;
}

export interface Patient {
  id: string; 
  name: string;
  age: number;
  problem: string;
  weight: number;
  height: number;
  roomNo: string;
  password: string; 
  createdBy: string; 
  createdAt: number;
  hasInsurance: boolean;
  paymentStatus: 'DUE' | 'COMPLETED';
}

export interface PatientAction {
  id: string;
  patientId: string;
  type: ActionType;
  description: string;
  timings?: string; 
  location?: string; 
  createdBy: string; 
  assignedTo: UserRole; 
  status: ActionStatus;
  billAmount?: number;
  result?: string;
  timestamp: number;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

export interface Notification {
  id: string;
  userId: string;
  role: UserRole;
  message: string;
  timestamp: number;
  read: boolean;
}
