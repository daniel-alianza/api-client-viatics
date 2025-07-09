import axios from 'axios';
import { showErrorModal } from '../hooks/useErrorServer';

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error('La variable de entorno VITE_API_URL no está definida');
}

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores de red
api.interceptors.response.use(
  response => response,
  error => {
    if (!error.response) {
      // Error de red (por ejemplo: ECONNREFUSED)
      console.error('[Axios] Error de conexión al servidor:', error);
      showErrorModal();
    } else {
      console.error('[Axios] Error de respuesta:', error.response);
    }

    // Siempre rechazamos el error para que los llamados lo manejen
    return Promise.reject(error);
  },
);

export const API_ENDPOINTS = {
  EXPENSE_REQUESTS: {
    BASE: '/expense-requests',
    APPROVE: (id: string) => `/expense-requests/${id}/approve`,
    REJECT: (id: string) => `/expense-requests/${id}/reject`,
  },
};
