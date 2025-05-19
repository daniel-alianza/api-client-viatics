import { apiFetch } from './api';

interface MovementsResponse {
  status: string;
  message: string;
  data: {
    TotalExtractos: number;
    TotalComprobacionesFaltantes: number;
    TotalComprobacionesRealizadas: number;
    DiasRestantesParaComprobar: number;
  };
  timestamp: string;
}

export const getMovements = async (
  cardNumber: string,
  startDate: string,
  endDate: string,
): Promise<MovementsResponse> => {
  const queryParams = new URLSearchParams({
    cardNumber,
    startDate,
    endDate,
  });

  return apiFetch<MovementsResponse>(`/movements?${queryParams.toString()}`);
};
