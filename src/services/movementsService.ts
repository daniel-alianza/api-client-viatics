import { api } from './api';
import {
  ApiResponse,
  GetMovementsParams,
} from '@/interfaces/movementInterface';

export const getMovementsByDateRange = async (
  params: GetMovementsParams,
): Promise<ApiResponse> => {
  const { accountCode, cardNumber, startDate, endDate } = params;

  const queryParams = new URLSearchParams({
    accountCode,
    cardNumber,
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  });

  const url = `/movements/by-date-range?${queryParams.toString()}`;

  try {
    const { data } = await api.get<ApiResponse>(url);

    if (!data.success) {
      console.error(
        '[MovementsService] Error en respuesta:',
        data.message,
        data.errors,
      );
      throw new Error(data.message || 'Error al obtener los movimientos');
    }

    return data;
  } catch (error) {
    console.error('[MovementsService] Error al llamar a la API:', error);
    throw error;
  }
};
