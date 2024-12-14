'use client';

import { SessionUser } from '@repo/types/user';
import { createContext, use, useContext, useEffect, useState } from 'react';

interface AuthProviderProps {
  children: React.ReactNode;
  userPromise: Promise<SessionUser>;
}

interface AuthContextProps {
  user: SessionUser;
  setUser: (user: SessionUser) => void;
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
  let initialUser = use(userPromise);
  const [user, setUser] = useState<SessionUser>(initialUser);

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  return <AuthContext value={{ user, setUser }}>{children}</AuthContext>;
};
