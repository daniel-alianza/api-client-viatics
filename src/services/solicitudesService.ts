export interface Detail {
  id: number;
  expenseRequestId: number;
  concept: string;
  amount: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  companyId: number;
  branchId: number;
  areaId: number;
  roleId: number;
  managerId: number;
  company: {
    id: number;
    name: string;
  };
  branch: {
    id: number;
    name: string;
    companyId: number;
  };
  area: {
    id: number;
    name: string;
    branchId: number;
  };
  role: {
    id: number;
    name: string;
  };
}

export interface Viatico {
  id: number;
  userId: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  travelReason: string;
  departureDate: string;
  returnDate: string;
  disbursementDate: string;
  travelObjectives: string;
  approverId: number;
  comment: string | null;
  user: User;
  details: Detail[];
}

export interface ViaticoResponse {
  status: 'success' | 'error';
  message: string;
  data?: Viatico[];
  error?: string;
  timestamp: string;
}

export const solicitudesService = {
  async getViaticosPorEmail(email: string): Promise<ViaticoResponse> {
    try {
      console.log('Llamando a la API con email:', email);
      const response = await fetch(
        `http://localhost:4000/expense-requests/dispersed/by-email?email=${encodeURIComponent(
          email,
        )}`,
      );

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('Respuesta de la API:', data);
      return {
        status: 'success',
        message: 'Datos obtenidos exitosamente',
        data: data,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error al obtener viáticos:', error);
      throw error;
    }
  },
};
