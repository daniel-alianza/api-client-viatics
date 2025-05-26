import { apiFetch } from './api';

export interface Movimiento {
  Sequence: number;
  DueDate: Date;
  Memo: string;
  DebAmount: number;
  AcctName: string;
  Ref: string;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

export const getMovimientosByViatico = async (
  cardNumber: string,
  startDate: string,
  endDate: string,
): Promise<ApiResponse<Movimiento[]>> => {
  try {
    const response = await apiFetch(
      `/checks/movements?cardNumber=${cardNumber}&startDate=${startDate}&endDate=${endDate}`,
    );
    return response as ApiResponse<Movimiento[]>;
  } catch (error) {
    return {
      status: 'error',
      message: 'Error al obtener los movimientos',
      error: error instanceof Error ? error.message : 'Error desconocido',
      timestamp: new Date().toISOString(),
    };
  }
};

export async function getMovimientos(): Promise<ApiResponse<Movimiento[]>> {
  try {
    const response = await apiFetch('/movimientos');
    return response as ApiResponse<Movimiento[]>;
  } catch (error) {
    console.error('Error al obtener los movimientos:', error);
    throw error;
  }
}
