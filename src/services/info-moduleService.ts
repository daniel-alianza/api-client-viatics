import { Area, Branch, Company, User } from '@/interfaces/infoInterface';
import { api } from './api';

export const getAllUsers = async () => {
  const res = await api.get<User[]>('/users');
  return res.data;
};

export const getCompanies = async () => {
  const res = await api.get<Company[]>('/companies');
  return res.data;
};

export const getBranchesByCompany = async (companyId: string) => {
  const res = await api.get<Branch[]>(`/branch/${companyId}`);
  return res.data;
};

export const getAreasByBranch = async (branchId: string) => {
  const res = await api.get<Area[]>(`/area/${branchId}`);
  return res.data;
};
