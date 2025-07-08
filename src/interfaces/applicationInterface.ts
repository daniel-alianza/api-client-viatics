export interface Detail {
  id: number;
  expenseRequestId: number;
  concept: string;
  amount: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
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
}

export interface Viatico {
  id: number;
  userId: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  travelReason: string;
  departureDate: string;
  returnDate: string;
  disbursementDate: string;
  travelObjectives: string;
  approverId: number;
  comment: string | null;
  user: User;
  details: Detail[];
  accountCode?: string;
  totalExtractos?: number;
  faltantes?: number;
  comprobados?: number;
  daysRemaining?: number;
}

export interface ViaticoResponse {
  status: 'success' | 'error';
  message: string;
  data?: Viatico[];
  error?: string;
  timestamp: string;
}
