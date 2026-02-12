
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  patientUser: { id: string, name: string } | null;
  login: (userData: any) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [patientUser, setPatientUser] = useState<{ id: string, name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('hospice_user');
    const savedPatient = localStorage.getItem('hospice_patient');
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedPatient) setPatientUser(JSON.parse(savedPatient));
    setIsLoading(false);
  }, []);

  const login = (data: any) => {
    if (data.role === UserRole.PATIENT) {
      setPatientUser(data);
      localStorage.setItem('hospice_patient', JSON.stringify(data));
      setUser({
        id: data.id,
        name: data.name,
        email: 'patient@hospital.com',
        role: UserRole.PATIENT,
        isOnline: true
      });
    } else {
      setUser(data);
      localStorage.setItem('hospice_user', JSON.stringify(data));
    }
  };

  const logout = () => {
    setUser(null);
    setPatientUser(null);
    localStorage.removeItem('hospice_user');
    localStorage.removeItem('hospice_patient');
    // Clear any potential session leaks
    sessionStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, patientUser, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
