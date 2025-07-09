import React, { createContext, useContext, useState } from 'react';
import type { UserData } from '@/interfaces/requestInterface';

interface AuthContextType {
  user: UserData | null;
  setUser: (user: UserData | null) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserData | null>(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        sessionStorage.removeItem('user');
        return null;
      }
    }
    return null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!sessionStorage.getItem('user');
  });

  const handleSetUser = (newUser: UserData | null) => {
    setUser(newUser);
    setIsAuthenticated(!!newUser);
    if (newUser) {
      sessionStorage.setItem('user', JSON.stringify(newUser));
    } else {
      sessionStorage.removeItem('user');
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser: handleSetUser, isAuthenticated }}
    >
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
