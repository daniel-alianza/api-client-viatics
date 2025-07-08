import { ViaticoResponse } from '@/interfaces/applicationInterface';
import { api } from './api';
import { AxiosError } from 'axios';

export const solicitudesService = {
  async getViaticosPorEmail(email: string): Promise<ViaticoResponse> {
    try {
      console.log('Llamando a la API con email:', email);

      const response = await api.get(`/expense-requests/dispersed/by-email`, {
        params: { email },
      });

      console.log('Respuesta de la API:', response.data);

      return {
        status: 'success',
        message: 'Datos obtenidos exitosamente',
        data: response.data,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;

      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Error al obtener viáticos';

      console.error('Error al obtener viáticos:', errorMessage);
      throw new Error(errorMessage);
    }
  },
};
