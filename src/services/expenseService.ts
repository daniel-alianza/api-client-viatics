import type { Expense } from '@/features/authorization/interfaces/expense';
import { apiFetch, API_ENDPOINTS } from './api';

// Interfaz para la respuesta de la API
interface ApiExpenseRequest {
  id: number;
  userId: number;
  user?: {
    name?: string;
    company?: { name?: string };
    branch?: { name?: string };
    area?: { name?: string };
  };
  departureDate: string;
  returnDate: string;
  totalAmount: number | string;
  status?: string;
  travelReason?: string;
  travelObjectives?: string;
  details?: Array<{
    id: number;
    concept?: string;
    amount: number | string;
  }>;
  createdAt?: string;
}

/**
 * Obtiene todas las solicitudes de gastos
 * @returns Lista de solicitudes de gastos
 */
export const getExpenseRequests = async (): Promise<Expense[]> => {
  try {
    const response = await apiFetch<ApiExpenseRequest[]>(
      API_ENDPOINTS.EXPENSE_REQUESTS.BASE,
    );

    // Transformar los datos para que coincidan con la interfaz Expense
    return response.map(request => ({
      id: request.id.toString(),
      userId: request.userId.toString(),
      requestor: request.user?.name || 'N/A',
      userName: request.user?.name || 'N/A',
      company: request.user?.company?.name || 'N/A',
      branch: request.user?.branch?.name || 'N/A',
      area: request.user?.area?.name || 'N/A',
      departureDate: request.departureDate,
      returnDate: request.returnDate,
      totalAmount: parseFloat(request.totalAmount.toString()) || 0,
      amount: parseFloat(request.totalAmount.toString()) || 0, // Para compatibilidad
      status: request.status || 'Pending',
      reason: request.travelReason || 'N/A',
      objectives: request.travelObjectives || 'N/A',
      details:
        request.details?.map(detail => ({
          id: detail.id.toString(),
          concept: detail.concept || 'N/A',
          amount: parseFloat(detail.amount.toString()) || 0,
        })) || [],
      createdAt: request.createdAt || new Date().toISOString(),
      // Mantener la estructura de expenses para compatibilidad
      expenses: {
        Transport: 0,
        Tolls: 0,
        Lodging: 0,
        Food: 0,
        Freight: 0,
        Tools: 0,
        Shipping: 0,
        Miscellaneous: 0,
      },
    }));
  } catch (error) {
    console.error('Error fetching expense requests:', error);
    throw error;
  }
};

/**
 * Aprueba o rechaza una solicitud de gastos
 * @param expenseId - ID de la solicitud de gastos
 * @param approved - Si es true, aprueba la solicitud; si es false, la rechaza
 * @param approverId - ID del aprobador
 * @returns Solicitud de gastos actualizada
 */
export const updateExpenseStatus = async (
  expenseId: string,
  approved: boolean,
  approverId: string,
): Promise<Expense> => {
  try {
    const endpoint = approved
      ? `${API_ENDPOINTS.EXPENSE_REQUESTS.APPROVE(
          expenseId,
        )}?approverId=${approverId}`
      : `${API_ENDPOINTS.EXPENSE_REQUESTS.REJECT(
          expenseId,
        )}?approverId=${approverId}`;

    const response = await apiFetch<ApiExpenseRequest>(endpoint);

    // Transformar la respuesta de la misma manera que en getExpenseRequests
    return {
      id: response.id.toString(),
      userId: response.userId.toString(),
      requestor: response.user?.name || 'N/A',
      userName: response.user?.name || 'N/A',
      company: response.user?.company?.name || 'N/A',
      branch: response.user?.branch?.name || 'N/A',
      area: response.user?.area?.name || 'N/A',
      departureDate: response.departureDate,
      returnDate: response.returnDate,
      totalAmount: parseFloat(response.totalAmount.toString()) || 0,
      amount: parseFloat(response.totalAmount.toString()) || 0,
      status: response.status || 'Pending',
      reason: response.travelReason || 'N/A',
      objectives: response.travelObjectives || 'N/A',
      details:
        response.details?.map(detail => ({
          id: detail.id.toString(),
          concept: detail.concept || 'N/A',
          amount: parseFloat(detail.amount.toString()) || 0,
        })) || [],
      createdAt: response.createdAt || new Date().toISOString(),
      expenses: {
        Transport: 0,
        Tolls: 0,
        Lodging: 0,
        Food: 0,
        Freight: 0,
        Tools: 0,
        Shipping: 0,
        Miscellaneous: 0,
      },
    };
  } catch (error) {
    console.error('Error updating expense status:', error);
    throw error;
  }
};
