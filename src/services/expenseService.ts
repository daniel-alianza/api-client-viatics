import type { Expense } from '@/features/authorization/interfaces/expense';
import { api, API_ENDPOINTS } from './api';
import { ApiExpenseRequest } from '@/interfaces/expenseInterface';

/**
 * Obtiene todas las solicitudes de gastos
 * @returns Lista de solicitudes de gastos
 */
export const getExpenseRequests = async (): Promise<Expense[]> => {
  try {
    const response = await api.get<ApiExpenseRequest[]>(
      API_ENDPOINTS.EXPENSE_REQUESTS.BASE,
    );

    return response.data.map(request => ({
      id: request.id ? request.id.toString() : '',
      userId: request.userId ? request.userId.toString() : '',
      requestor: request.user?.name || 'N/A',
      userName: request.user?.name || 'N/A',
      company: request.user?.company?.name || 'N/A',
      branch: request.user?.branch?.name || 'N/A',
      area: request.user?.area?.name || 'N/A',
      departureDate: request.departureDate,
      returnDate: request.returnDate,
      totalAmount: request.totalAmount
        ? parseFloat(request.totalAmount.toString()) || 0
        : 0,
      amount: request.totalAmount
        ? parseFloat(request.totalAmount.toString()) || 0
        : 0,
      status: request.status || 'Pending',
      reason: request.travelReason || 'N/A',
      objectives: request.travelObjectives || 'N/A',
      details:
        request.details?.map(detail => ({
          id: detail.id ? detail.id.toString() : '',
          concept: detail.concept || 'N/A',
          amount: detail.amount ? parseFloat(detail.amount.toString()) || 0 : 0,
        })) || [],
      createdAt: request.createdAt || new Date().toISOString(),
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

    const response = await api.post<ApiExpenseRequest>(endpoint);

    const request = response.data;

    return {
      id: request.id ? request.id.toString() : '',
      userId: request.userId ? request.userId.toString() : '',
      requestor: request.user?.name || 'N/A',
      userName: request.user?.name || 'N/A',
      company: request.user?.company?.name || 'N/A',
      branch: request.user?.branch?.name || 'N/A',
      area: request.user?.area?.name || 'N/A',
      departureDate: request.departureDate,
      returnDate: request.returnDate,
      totalAmount: request.totalAmount
        ? parseFloat(request.totalAmount.toString()) || 0
        : 0,
      amount: request.totalAmount
        ? parseFloat(request.totalAmount.toString()) || 0
        : 0,
      status: request.status || 'Pending',
      reason: request.travelReason || 'N/A',
      objectives: request.travelObjectives || 'N/A',
      details:
        request.details?.map(detail => ({
          id: detail.id ? detail.id.toString() : '',
          concept: detail.concept || 'N/A',
          amount: detail.amount ? parseFloat(detail.amount.toString()) || 0 : 0,
        })) || [],
      createdAt: request.createdAt || new Date().toISOString(),
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
