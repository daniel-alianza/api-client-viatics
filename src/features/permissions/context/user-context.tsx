import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import type { User } from '../interfaces/types';
import { api } from '@/services/api';

interface UserContextType {
  users: User[];
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    api.get('/users').then(res => {
      setUsers(res.data);
    });
  }, []);

  return (
    <UserContext.Provider value={{ users, selectedUser, setSelectedUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
}
