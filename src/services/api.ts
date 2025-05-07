// Configuración de la API
const BASE_URL = 'http://localhost:4000';

/**
 * Función genérica para realizar peticiones a la API
 * @param endpoint - Endpoint de la API
 * @param options - Opciones de la petición
 * @returns Datos de la respuesta
 */
export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Error en la solicitud');
  }

  return res.json();
}

/**
 * Endpoints de la API
 */
export const API_ENDPOINTS = {
  // Endpoints de solicitudes de gastos
  EXPENSE_REQUESTS: {
    BASE: '/expense-requests',
    APPROVE: (id: string) => `/expense-requests/${id}/approve`,
    REJECT: (id: string) => `/expense-requests/${id}/reject`,
  },
  // Otros endpoints pueden ser agregados aquí
};
