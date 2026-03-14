"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from '../lib/axios';
import { getMe } from '../services/authApi';
import { useRouter } from 'next/navigation';


interface User {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN' | 'SUB_ADMIN'; // from error.txt, role can be SUB_ADMIN
  isVerified: boolean;
  avatarUrl: string | null;
  verificationToken: string | null;
  firstName: string | null;
  lastName: string | null;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (data: { user: User; success?: boolean; [key: string]: any }) => void; // Updated login data type
  logout: () => void;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUserFromSession = async () => {
      try {
        const response = await getMe();
        // Ensure only the user object is set, not the entire response wrapper
        if (response && response.user) {
          setUser(response.user);
        } else if (response) { // If response exists but user is not nested, assume response itself is user
          setUser(response);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUserFromSession();
  }, []);

  const login = (data: { user: User; success?: boolean; [key: string]: any }) => { // Updated data type
    // Ensure only the user object is set, not the entire response wrapper
    const userToSet = data.user;
    setUser(userToSet);
    if (userToSet.role === 'ADMIN' || userToSet.role === 'SUPER_ADMIN') {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
  };


  const logout = async () => {
    try {
        await axios.post('/auth/logout');
    } catch (error) {
        console.error("Logout failed", error);
    }
    finally {
        setUser(null);
        router.push('/auth/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
