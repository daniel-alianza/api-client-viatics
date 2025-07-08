import { Variants } from 'framer-motion';

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

export interface TripPurposeProps {
  expense: Expense;
}

export interface ApplicantInfoProps {
  expense: Expense;
  variants: Variants;
}

export interface TripInfoProps {
  expense: Expense;
  tripDuration: number;
}

export interface ExpenseDetail {
  concept: string;
  amount: number;
}

export interface FinancialInfoProps {
  expense: Expense;
}
