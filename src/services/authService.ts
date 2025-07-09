import { api } from './api';
import { LoginUserData, RegisterUserData } from '@/interfaces/authInterface';

export async function loginUser(data: LoginUserData) {
  const res = await api.post('/auth/login', data);
  return res.data;
}

export async function registerUser(data: RegisterUserData) {
  const res = await api.post('/auth/register', data);
  return res.data;
}
