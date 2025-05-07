import { useState, useEffect } from 'react';
import type { Expense } from '@/features/authorization/interfaces/expense';
import {
  getExpenseRequests,
  updateExpenseStatus,
} from '@/services/expenseService';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const expenseData = await getExpenseRequests();
      setExpenses(expenseData);
      setError(null);
    } catch (err) {
      setError('Error al cargar las solicitudes de gastos');
      console.error('Error fetching expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  const approveExpense = async (expenseId: string, approved: boolean) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const approverId = user.id;
      const updatedExpense = await updateExpenseStatus(
        expenseId,
        approved,
        approverId,
      );
      setExpenses(prevExpenses =>
        prevExpenses.map(expense =>
          expense.id === expenseId ? updatedExpense : expense,
        ),
      );
      return {
        success: true,
        message: `Solicitud ${approved ? 'aprobada' : 'rechazada'} con éxito.`,
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Error al actualizar el estado de la solicitud';
      setError(errorMessage);
      console.error('Error updating expense:', err);
      return { success: false, message: errorMessage };
    }
  };

  const getExpenseById = (id: string) => {
    return expenses.find(expense => expense.id === id);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return {
    expenses,
    loading,
    error,
    approveExpense,
    getExpenseById,
    refreshExpenses: fetchExpenses,
  };
};
