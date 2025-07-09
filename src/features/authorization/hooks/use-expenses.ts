import { useState, useEffect } from 'react';
import type { Expense } from '@/features/authorization/interfaces/expense';
import {
  getExpenseRequests,
  updateExpenseStatus,
} from '@/services/expenseService';
import { useAuth } from '@/context/AuthContext';
import { getSubordinates } from '@/services/usersService';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const allExpenseData = await getExpenseRequests();

      // Filtrar las solicitudes según el rol del usuario
      let filteredExpenses = allExpenseData;

      if (user) {
        switch (user.roleId) {
          case 1: // Admin - ve todas las solicitudes
            filteredExpenses = allExpenseData;
            break;
          case 2: // Gerente
          case 3: // Líder
            // Obtener subordinados y filtrar solo sus solicitudes
            const subordinates = await getSubordinates(user.id);
            const subordinateIds = subordinates.map((sub: any) => sub.id);

            filteredExpenses = allExpenseData.filter(expense => {
              const expenseUserId = parseInt(expense.userId);
              // Solo incluir solicitudes de subordinados
              return subordinateIds.includes(expenseUserId);
            });
            break;
          case 4: // Colaborador - ve solo sus propias solicitudes
            filteredExpenses = allExpenseData.filter(expense => {
              const expenseUserId = parseInt(expense.userId);
              return expenseUserId === user.id;
            });
            break;
          default:
            filteredExpenses = [];
        }
      }

      setExpenses(filteredExpenses);
      setError(null);
    } catch (err) {
      setError('Error al cargar las solicitudes de gastos');
      console.error('Error fetching expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  const approveExpense = async (
    expenseId: string,
    approved: boolean,
    comment: string,
  ) => {
    try {
      const user = JSON.parse(sessionStorage.getItem('user') || '{}');
      const approverId = user.id;
      const updatedExpense = await updateExpenseStatus(
        expenseId,
        approved,
        approverId,
        comment,
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
