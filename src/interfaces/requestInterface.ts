export interface UserData {
  id: number;
  name: string;
  email: string;
  token: string;
  companyId: number;
  branchId: number;
  areaId: number;
  roleId: number;
  managerId: number;
  company: {
    id: number;
    name: string;
  };
  branch: {
    id: number;
    name: string;
    companyId: number;
  };
  area: {
    id: number;
    name: string;
    branchId: number;
  };
  role: {
    id: number;
    name: string;
  };
  cards: Array<{
    id: number;
    cardNumber: string;
    userId: number;
    isActive: boolean;
    assignedAt: string;
    limite: string;
    company: {
      id: number;
      name: string;
    };
  }>;
}
