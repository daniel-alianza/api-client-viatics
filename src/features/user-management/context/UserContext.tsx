import type React from 'react';
import { createContext, useContext, useState } from 'react';
import type { User, UserContextType } from '../interfaces/User';
import { useUsers } from '../hooks/useUsers';

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { users, isLoading, addUser, updateUser, deleteUser } = useUsers();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');

  const selectUser = (user: User | null) => {
    setSelectedUser(user);
  };

  const setModalOpen = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setSelectedUser(null);
    }
  };

  return (
    <UserContext.Provider
      value={{
        users,
        selectedUser,
        isLoading,
        isModalOpen,
        searchTerm,
        filterRole,
        addUser,
        updateUser,
        deleteUser,
        selectUser,
        setModalOpen,
        setSearchTerm,
        setFilterRole,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
