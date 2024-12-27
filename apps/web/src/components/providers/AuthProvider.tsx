'use client';

import type { SessionUser } from '@repo/validation/user';
import { createContext, use, useContext, useEffect, useState } from 'react';

interface AuthProviderProps {
  children: React.ReactNode;
  userPromise: Promise<SessionUser | null>;
}

interface AuthContextProps {
  user: SessionUser | null;
  setUser: (user: SessionUser | null) => void;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const useUser = () => {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error('useAuth must be used within a UserProvider');
  }

  return context;
};

export const AuthProvider = ({ children, userPromise }: AuthProviderProps) => {
  const initialUser = use(userPromise || null);
  const [user, setUser] = useState<SessionUser | null>(initialUser);

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  return <AuthContext value={{ user, setUser }}>{children}</AuthContext>;
};
