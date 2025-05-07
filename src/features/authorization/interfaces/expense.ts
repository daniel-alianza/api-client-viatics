export type ExpenseStatus =
  | 'Pending'
  | 'Approved'
  | 'Rejected'
  | 'Pendiente'
  | string;

export interface ExpenseExpenses {
  Transport: number;
  Tolls: number;
  Lodging: number;
  Food: number;
  Freight: number;
  Tools: number;
  Shipping: number;
  Miscellaneous: number;
}

export interface ExpenseDetail {
  id: string;
  concept: string;
  amount: number;
}

export interface Expense {
  id: string;
  userId: string;
  requestor: string;
  userName: string;
  company: string;
  branch: string;
  area: string;
  departureDate: string;
  returnDate: string;
  totalAmount: number;
  amount: number; // Para compatibilidad con código existente
  status: ExpenseStatus;
  expenses: ExpenseExpenses;
  reason: string;
  objectives: string;
  details: ExpenseDetail[];
  createdAt: string;
}
