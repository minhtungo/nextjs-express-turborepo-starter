'use client';

import { ApiResponse } from '@repo/validation/api';
import type { SessionUser } from '@repo/validation/user';
import { createContext, use, useContext, useEffect, useState } from 'react';

interface AuthProviderProps {
  children: React.ReactNode;
  userPromise: Promise<ApiResponse<SessionUser | null>>;
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
  const result = use(userPromise || null);
  const [user, setUser] = useState<SessionUser | null>(result.data);

  useEffect(() => {
    setUser(result.data);
    console.log('initialUser', result.data);
  }, [result.data]);

  return <AuthContext value={{ user, setUser }}>{children}</AuthContext>;
};
