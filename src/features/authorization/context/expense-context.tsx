import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Expense } from '@/features/authorization/interfaces/expense';
import { mockExpenses } from '@/features/authorization//data/mock-expenses';

interface ExpenseContextType {
  expenses: Expense[];
  getExpenseById: (id: string) => Expense | undefined;
  approveExpense: (id: string, isApproved: boolean) => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);

  const getExpenseById = (id: string) => {
    return expenses.find(expense => expense.id === id);
  };

  const approveExpense = (id: string, isApproved: boolean) => {
    setExpenses(prevExpenses =>
      prevExpenses.map(expense =>
        expense.id === id
          ? { ...expense, status: isApproved ? 'Aprobada' : 'Rechazada' }
          : expense,
      ),
    );
  };

  return (
    <ExpenseContext.Provider
      value={{ expenses, getExpenseById, approveExpense }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export const useExpenseContext = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpenseContext must be used within an ExpenseProvider');
  }
  return context;
};
