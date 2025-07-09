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
