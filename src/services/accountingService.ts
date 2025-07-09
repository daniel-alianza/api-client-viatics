import { api } from './api';
import type { Assignment } from '@/features/accounting-authorization/interfaces/assignment';
import { Card, ApiResponse } from '@/interfaces/accountingInterface';

/**
 * Obtiene la tarjeta activa de un usuario por su ID
 */
export async function getUserCard(userId: number) {
  try {
    const { data } = await api.get<ApiResponse>(`/users/${userId}`);
    const activeCard = data.cards?.find((card: Card) => card.isActive);
    return activeCard || null;
  } catch (error) {
    console.error('Error al obtener la tarjeta del usuario:', error);
    return null;
  }
}

/**
 * Obtiene los gastos aprobados
 */
export async function getApprovedExpenses(): Promise<Assignment[]> {
  try {
    const { data } = await api.get<Assignment[]>('/expense-requests');
    if (!data || data.length === 0) {
      console.log('No hay datos de la API');
      return [];
    }
    return data.filter(expense => expense.status === 'Aprobada');
  } catch (error) {
    console.error('Error al obtener los gastos aprobados:', error);
    return [];
  }
}

const fileCounter: { [key: string]: number } = {};

const getFileNumber = (date: string): string => {
  const key = date.slice(4);
  fileCounter[key] = (fileCounter[key] || 0) + 1;
  return fileCounter[key].toString().padStart(2, '0');
};

const generateFileName = (
  date: string,
  groupNumber: string,
  consecutiveNumber: string,
): string => {
  const mmdd = date.slice(4, 8);
  const paddedGroupNumber = groupNumber.padEnd(9, '0');
  return `A${mmdd}${paddedGroupNumber}${consecutiveNumber}.CSV`;
};

const formatDateForCSV = (date?: string | null): string =>
  date ? date.slice(0, 10).replace(/-/g, '') : '';

const limitString = (str: string, maxLength: number): string =>
  str.slice(0, maxLength);

export async function downloadAssignmentsCSV(
  assignments: Assignment[],
  clientNumber: string,
  groupNumber: string,
) {
  try {
    const today = new Date();
    const fileDate = today.toISOString().slice(0, 10).replace(/-/g, '');
    const fileNumber = getFileNumber(fileDate);

    const totalAmount = assignments.reduce(
      (sum, assignment) => sum + assignment.limit,
      0,
    );

    const headers = [
      'Numero de tarjeta',
      'Asignada a',
      'Alias',
      'Descripcion',
      'Limite',
      'Fecha de Inicio',
      'Fecha de Fin',
    ].join(',');

    const dataRows = assignments.map(assignment => {
      const cardNumber = "'" + assignment.cardNumber.replace(/[^\d]/g, '');
      const assignedTo = limitString(assignment.assignedTo, 24);
      const alias = limitString(assignment.alias, 15);
      const description = limitString(assignment.description, 40);
      const limit = assignment.limit.toFixed(2).padStart(11, '0');
      const exitDate = formatDateForCSV(assignment.exitDate);
      const returnDate = formatDateForCSV(assignment.returnDate);

      return [
        cardNumber,
        assignedTo,
        alias,
        description,
        limit,
        exitDate,
        returnDate,
        '',
        '',
      ].join(',');
    });

    const cleanClientNumber = clientNumber.replace(/[^0-9]/g, '');
    const controlRow = [
      cleanClientNumber,
      fileNumber,
      fileDate,
      assignments.length.toString(),
      totalAmount.toFixed(2),
      '',
      '',
    ].join(',');

    const csvContent = [headers, ...dataRows, controlRow].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const fileName = generateFileName(fileDate, groupNumber, fileNumber);

    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error generating CSV:', error);
    throw error;
  }
}
export async function updateCardAndExpense(
  userId: number,
  cardNumber: string,
  newLimit: number,
  expenseId: number,
): Promise<void> {
  try {
    const { data: userData } = await api.get<ApiResponse>(`/users/${userId}`);
    const card = userData.cards?.find(c => c.cardNumber === cardNumber);

    if (!card) {
      throw new Error('No se encontró la tarjeta del usuario');
    }

    const { data: cardData } = await api.patch(`/users/cards/${card.id}`, {
      limite: newLimit,
    });

    const { data: expenseData } = await api.patch(
      `/expense-requests/${expenseId}/disburse`,
      {
        status: 'Dispersada',
      },
    );

    if (!cardData || !expenseData) {
      throw new Error('Error en la respuesta del servidor');
    }

    console.log('Actualización exitosa:', {
      card: cardData,
      expense: expenseData,
    });
  } catch (error) {
    console.error('Error en updateCardAndExpense:', error);
    throw error;
  }
}
