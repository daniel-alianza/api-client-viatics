/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserData } from '@/interfaces/requestInterface';
import { api } from './api';

let userData: UserData | null = null;

export const setUserData = (data: UserData) => {
  userData = data;
};

export const getUserData = (): UserData | null => {
  return userData;
};

export const fetchUserSpecificData = async () => {
  if (!userData) {
    throw new Error('User is not logged in');
  }

  try {
    const response = await api.get('/user-data', {
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching user-specific data:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to fetch user-specific data',
    );
  }
};

export const createTravelExpense = async (data: any, token: string) => {
  try {
    const response = await api.post('/expense-requests', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error creating travel expense:', error);
    throw new Error(
      error.response?.data?.message || 'Error al crear la solicitud',
    );
  }
};
