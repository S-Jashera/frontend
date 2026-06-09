'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from './supabase';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  authed: boolean;
  authLoading: boolean;
  role: string | null;
  setAuthed: (v: boolean) => void;
  setRole: (role: string | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  authed: false,
  authLoading: true,
  role: null,
  setAuthed: () => {},
  setRole: () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check localStorage for role on mount
    const savedRole = localStorage.getItem('role');
    if (savedRole) {
      setRole(savedRole);
    }

    supabase.auth.getSession().then(({ data }) => {
      setAuthed(!!data.session);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setAuthed(!!session);
      if (!session) {
        setRole(null);
        localStorage.removeItem('role');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setAuthed(false);
    setRole(null);
    localStorage.removeItem('role');
  };

  return (
    <AuthContext.Provider value={{ authed, authLoading, role, setAuthed, setRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
