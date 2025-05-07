import { apiFetch } from './api';

interface RegisterUserData {
  name: string;
  email: string;
  password: string;
  companyId?: number;
  branchId?: number;
  areaId?: number;
  managerId?: number;
}

interface LoginUserData {
  email: string;
  password: string;
}

export async function loginUser(data: LoginUserData) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function registerUser(data: RegisterUserData) {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
