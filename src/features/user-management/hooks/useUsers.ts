import { useState, useEffect } from 'react';
import type { User, UserFormData } from '../interfaces/User';
import * as usersService from '../../../services/usersService';

// Función para obtener solo los campos que han cambiado
function getChangedFields(original: any, updated: any) {
  const changed: any = {};
  Object.keys(updated).forEach(key => {
    if (updated[key] !== undefined && updated[key] !== original[key]) {
      changed[key] = updated[key];
    }
  });
  return changed;
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const data = await usersService.getAllUsers();
        // Mantener todos los campos del backend y asegurar roleId
        const mapped = data.map((u: any) => ({
          ...u,
          id: u.id.toString(),
          roleId: u.roleId || (u.role && u.role.id) || undefined,
        }));
        setUsers(mapped);
      } catch (error) {
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const addUser = (userData: UserFormData) => {
    const newUser: User = {
      id: Date.now().toString(),
      ...userData,
      company: { id: userData.companyId, name: '' },
      branch: {
        id: userData.branchId,
        name: '',
        companyId: userData.companyId,
      },
      area: { id: userData.areaId, name: '', branchId: userData.branchId },
      role: { id: userData.roleId, name: '' },
      manager: null,
      cards: [],
      status: 'active',
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = async (id: string, userData: Partial<UserFormData>) => {
    try {
      const originalUser = users.find(u => u.id === id);
      if (!originalUser) return;
      const changedFields = getChangedFields(originalUser, userData);
      if (Object.keys(changedFields).length === 0) return; // No hay cambios
      await usersService.updateUser(Number(id), changedFields);
      setUsers(prev =>
        prev.map(user =>
          user.id === id ? { ...user, ...changedFields } : user,
        ),
      );
    } catch (error) {
      console.error('Error actualizando usuario:', error);
    }
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  return {
    users,
    isLoading,
    addUser,
    updateUser,
    deleteUser,
  };
};
