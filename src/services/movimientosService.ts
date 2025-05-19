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
  idViatico: string,
): Promise<ApiResponse<Movimiento[]>> => {
  try {
    const response = await apiFetch(
      `/movimientos/viatico?idViatico=${idViatico}`,
    );
    return response;
  } catch (error) {
    return {
      status: 'error',
      message: 'Error al obtener los movimientos',
      error: error instanceof Error ? error.message : 'Error desconocido',
      timestamp: new Date().toISOString(),
    };
  }
};
