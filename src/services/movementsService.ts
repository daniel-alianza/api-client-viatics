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

export interface Movement {
  id: string;
  viaticoId: string;
  empresa: string;
  banco: string;
  movimiento: string;
  fecha: string;
  numeroTarjeta: string;
  gastoInicial: number;
  descripcion: string;
  categoria: string;
  indicadorImpuesto: string;
  normaReparto: string;
}

export const movementsService = {
  getMovements: async (): Promise<Movement[]> => {
    try {
      const { data } = await api.get<Movement[]>('/movements');
      return data;
    } catch (error) {
      console.error('Error al obtener movimientos:', error);
      throw error;
    }
  },

  updateMovement: async (
    id: string,
    movementData: Partial<Movement>,
  ): Promise<Movement> => {
    try {
      const { data } = await api.patch<Movement>(
        `/movements/${id}`,
        movementData,
      );
      return data;
    } catch (error) {
      console.error('Error al actualizar movimiento:', error);
      throw error;
    }
  },
};
