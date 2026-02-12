
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import NurseDashboard from './dashboards/NurseDashboard';
import DoctorDashboard from './dashboards/DoctorDashboard';
import LabDashboard from './dashboards/LabDashboard';
import PharmacyDashboard from './dashboards/PharmacyDashboard';
import PatientDashboard from './dashboards/PatientDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case UserRole.NURSE:
      return <NurseDashboard />;
    case UserRole.DOCTOR:
      return <DoctorDashboard />;
    case UserRole.LAB:
      return <LabDashboard />;
    case UserRole.PHARMACY:
      return <PharmacyDashboard />;
    case UserRole.PATIENT:
      return <PatientDashboard />;
    default:
      return <div className="p-10 text-center">Unauthorized Role</div>;
  }
};

export default Dashboard;
