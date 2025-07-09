export interface RegisterUserData {
  name: string;
  email: string;
  password: string;
  companyId?: number;
  branchId?: number;
  areaId?: number;
  managerId?: number;
}

export interface LoginUserData {
  email: string;
  password: string;
}
