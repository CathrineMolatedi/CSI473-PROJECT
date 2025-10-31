// lib/auth-context.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, SecurityOfficer, Resident, Administrator, UserStatus } from './types';

interface AuthContextType {
  user: User | null;
  userType: 'officer' | 'resident' | 'admin' | null;
  isAuthenticated: boolean;
  require2FA: boolean;
  pendingUser: any;
  login: (email: string, password: string, userType: string) => Promise<void>;
  logout: () => void;
  verify2FA: (code: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<'officer' | 'resident' | 'admin' | null>(null);
  const [require2FA, setRequire2FA] = useState(false);
  const [pendingUser, setPendingUser] = useState<any>(null);

  useEffect(() => {
    // Check for stored authentication
    const storedUser = localStorage.getItem('currentUser');
    const storedUserType = localStorage.getItem('userType');
    
    if (storedUser && storedUserType) {
      setUser(JSON.parse(storedUser));
      setUserType(storedUserType as any);
    }
  }, []);

  const login = async (email: string, password: string, type: string) => {
    // Simulate API call
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password && u.userType === type);
    
    if (foundUser) {
      if (foundUser.status === UserStatus.PENDING) {
        throw new Error('Your account is pending approval. Please contact administrator.');
      }
      
      if (foundUser.status === UserStatus.SUSPENDED) {
        throw new Error('Your account has been suspended. Please contact administrator.');
      }

      if (type === 'admin') {
        setPendingUser(foundUser);
        setRequire2FA(true);
        localStorage.setItem('pendingUser', JSON.stringify(foundUser));
      } else {
        setUser(foundUser);
        setUserType(type as any);
        localStorage.setItem('currentUser', JSON.stringify(foundUser));
        localStorage.setItem('userType', type);
      }
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const verify2FA = async (code: string): Promise<boolean> => {
    const storedCode = localStorage.getItem('2fa_code');
    if (code === storedCode && pendingUser) {
      setUser(pendingUser);
      setUserType('admin');
      setRequire2FA(false);
      localStorage.setItem('currentUser', JSON.stringify(pendingUser));
      localStorage.setItem('userType', 'admin');
      localStorage.removeItem('pendingUser');
      return true;
    }
    return false;
  };

  const register = async (userData: any): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user already exists
    if (users.find((u: any) => u.email === userData.email)) {
      throw new Error('User with this email already exists');
    }

    const newUser = {
      id: Date.now().toString(),
      ...userData,
      status: userData.userType === 'resident' ? UserStatus.ACTIVE : UserStatus.PENDING,
      createdAt: new Date(),
      lastLogin: new Date()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Notify admin for approval if needed
    if (userData.userType !== 'resident') {
      const pendingApprovals = JSON.parse(localStorage.getItem('pendingApprovals') || '[]');
      pendingApprovals.push(newUser);
      localStorage.setItem('pendingApprovals', JSON.stringify(pendingApprovals));
    }

    return true;
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
    setRequire2FA(false);
    setPendingUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userType');
    localStorage.removeItem('pendingUser');
  };

  return (
    <AuthContext.Provider value={{
      user,
      userType,
      isAuthenticated: !!user,
      require2FA,
      pendingUser,
      login,
      logout,
      verify2FA,
      register
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}