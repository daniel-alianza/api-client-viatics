import { apiFetch } from './api';
import type { Assignment } from '@/features/accounting-authorization/interfaces/assignment';

interface Card {
  id: number;
  cardNumber: string;
  isActive: boolean;
  limite: number;
}

/**
 * Obtiene la tarjeta activa de un usuario por su ID
 */
export async function getUserCard(userId: number) {
  try {
    const response = await apiFetch(`/users/${userId}`);

    // Buscar la tarjeta activa del usuario
    const activeCard = response.cards?.find((card: Card) => card.isActive);

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
    const response = await fetch('http://localhost:4000/expense-requests');
    if (!response.ok) {
      console.log('API no disponible');
      return [];
    }
    const data = await response.json();
    // Si no hay datos de la API, retornar array vacío
    if (!data || data.length === 0) {
      console.log('No hay datos de la API');
      return [];
    }
    // Filtrar solo las solicitudes aprobadas
    const approvedExpenses = data.filter(
      (expense: Assignment) => expense.status === 'Aprobada',
    );
    return approvedExpenses;
  } catch (error) {
    console.error('Error al obtener los gastos aprobados:', error);
    console.log('Error en la API');
    return [];
  }
}

// Variable para mantener el contador de archivos por día
const fileCounter: { [key: string]: number } = {};

/**
 * Obtiene el número consecutivo del archivo para la fecha actual (formato "01", "02", etc.)
 */
const getFileNumber = (date: string): string => {
  const key = date.slice(4); // Usar solo MMDD como clave
  if (!fileCounter[key]) {
    fileCounter[key] = 1;
  } else {
    fileCounter[key]++;
  }
  return fileCounter[key].toString().padStart(2, '0');
};

/**
 * Genera el nombre del archivo según el formato requerido
 * AMMDDNNNNNNNNNCC.CSV
 */
const generateFileName = (
  date: string,
  groupNumber: string,
  consecutiveNumber: string,
): string => {
  const mmdd = date.slice(4, 8); // Extraer mes y día
  const paddedGroupNumber = groupNumber.padEnd(9, '0'); // Rellenar con ceros a la derecha
  return `A${mmdd}${paddedGroupNumber}${consecutiveNumber}.CSV`;
};

/**
 * Formatea una fecha para el archivo CSV (YYYYMMDD)
 */
const formatDateForCSV = (date: string | undefined | null): string => {
  if (!date) return '';
  return date.slice(0, 10).replace(/-/g, '');
};

/**
 * Limita una cadena a un número máximo de caracteres
 */
const limitString = (str: string, maxLength: number): string => {
  return str.slice(0, maxLength);
};

export async function downloadAssignmentsCSV(
  assignments: Assignment[],
  clientNumber: string,
  groupNumber: string,
) {
  try {
    // Obtener la fecha actual en formato YYYYMMDD
    const today = new Date();
    const fileDate = today.toISOString().slice(0, 10).replace(/-/g, '');

    // Obtener el número consecutivo del archivo
    const fileNumber = getFileNumber(fileDate);

    // Calcular el monto total
    const totalAmount = assignments.reduce(
      (sum, assignment) => sum + assignment.limit,
      0,
    );

    // Crear el contenido del CSV
    const headers = [
      'Numero de tarjeta',
      'Asignada a',
      'Alias',
      'Descripcion',
      'Limite',
      'Fecha de Inicio',
      'Fecha de Fin',
    ].join(',');

    // Crear las filas de datos
    const dataRows = assignments.map(assignment => {
      const cardNumber = `="${assignment.cardNumber.replace(/[^\d]/g, '')}"`; // Forzar formato texto para todas las tarjetas
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
        '', // Columna 6 vacía
        '', // Columna 7 vacía
      ].join(',');
    });

    // Crear la fila de control
    const controlRow = [
      clientNumber.padStart(10, '0'), // Número de cliente (10 dígitos)
      fileNumber, // Número de archivo
      fileDate, // Fecha de envío
      assignments.length.toString(), // Cantidad de registros
      totalAmount.toFixed(2), // Monto total
      '', // Columna 6 vacía
      '', // Columna 7 vacía
    ].join(',');

    // Unir todo el contenido
    const csvContent = [headers, ...dataRows, controlRow].join('\n');

    // Crear el blob y descargar
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    // Generar el nombre del archivo según el formato requerido
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

interface UpdateCardAndExpenseResponse {
  success: boolean;
  message?: string;
}

export async function updateCardAndExpense(
  userId: number,
  cardNumber: string,
  newLimit: number,
  expenseId: number,
): Promise<void> {
  try {
    // Primero obtenemos los datos del usuario para encontrar el ID de la tarjeta
    const userResponse = await fetch(`http://localhost:4000/users/${userId}`);
    if (!userResponse.ok) {
      throw new Error('Error al obtener los datos del usuario');
    }

    const userData = await userResponse.json();
    const card = userData.cards?.find(
      (c: { cardNumber: string }) => c.cardNumber === cardNumber,
    );

    if (!card) {
      throw new Error('No se encontró la tarjeta del usuario');
    }

    // Actualizamos el límite de la tarjeta usando el ID de la tarjeta
    const updateCardResponse = await fetch(
      `http://localhost:4000/users/cards/${card.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          limite: newLimit,
        }),
      },
    );

    if (!updateCardResponse.ok) {
      const errorData = await updateCardResponse.json();
      throw new Error(
        `Error al actualizar el límite de la tarjeta: ${
          errorData.message || 'Error desconocido'
        }`,
      );
    }

    // Luego actualizamos el status del gasto usando el endpoint correcto
    const updateExpenseResponse = await fetch(
      `http://localhost:4000/expense-requests/${expenseId}/disburse`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'Dispersada',
        }),
      },
    );

    if (!updateExpenseResponse.ok) {
      const errorData = await updateExpenseResponse.json();
      throw new Error(
        `Error al actualizar el status del gasto: ${
          errorData.message || 'Error desconocido'
        }`,
      );
    }

    const cardData = await updateCardResponse.json();
    const expenseData = await updateExpenseResponse.json();

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
