import { api } from './api';

// Obtener todos los usuarios
export const getAllUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Obtener un usuario por ID
export const getUserById = async (id: number) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Obtener los subordinados de un usuario específico
export const getSubordinates = async (managerId: number) => {
  try {
    const response = await api.get(`/users/subordinates/${managerId}`);
    return response.data;
  } catch (error) {
    // Si el endpoint no existe, obtener todos los usuarios y filtrar
    console.warn(
      'Endpoint de subordinados no disponible, filtrando localmente',
    );
    const allUsers = await getAllUsers();
    return allUsers.filter((user: any) => user.managerId === managerId);
  }
};

// Obtener todos los roles
export const getRoles = async () => {
  try {
    const response = await api.get('/roles');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Editar un usuario
export const updateUser = async (id: number, userData: any) => {
  try {
    const response = await api.patch(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Eliminar un usuario
export const deleteUser = async (id: number) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
