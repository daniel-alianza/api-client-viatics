import { apiFetch } from './api';

export interface Area {
  id: string;
  name: string;
  branchId: string;
}

export interface Branch {
  id: string;
  name: string;
  companyId: string;
  companyName: string;
}

export interface Company {
  id: string;
  name: string;
}

export interface User {
  id: number;
  name: string;
  companyId: number;
  branchId: number;
  areaId: number;
  roleId: number;
}

export const getAllUsers = () => apiFetch<User[]>('/users');

export const getCompanies = () => apiFetch<Company[]>('/companies');

export const getBranchesByCompany = (companyId: string) =>
  apiFetch<Branch[]>(`/branch/${companyId}`);

export const getAreasByBranch = (branchId: string) =>
  apiFetch<Area[]>(`/area/${branchId}`);
