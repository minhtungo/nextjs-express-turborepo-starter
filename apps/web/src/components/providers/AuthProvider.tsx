'use client';

import { Session } from '@/lib/auth';
import { createContext, use, useContext, useEffect, useState } from 'react';

interface AuthProviderProps {
  children: React.ReactNode;
  sessionPromise: Promise<Session | null>;
}

interface AuthContextProps {
  user: Session | null;
  setUser: (user: Session | null) => void;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error('useAuth must be used within a UserProvider');
  }

  return context;
};

export const AuthProvider = ({ children, sessionPromise }: AuthProviderProps) => {
  let initialUser = use(sessionPromise);
  const [user, setUser] = useState<Session | null>(initialUser);

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  return <AuthContext value={{ user, setUser }}>{children}</AuthContext>;
};
