import { api } from './api';

export interface TicketPayload {
  empresa: string;
  cardNumber: string;
  category: string;
  taxIndicator: string;
  distributionRule: string;
  responsable: string;
  motivo: string;
  descripcion: string;
  importe: number;
  comment?: string;
  comprobacionId: number;
  approverId: number;
  accountCode?: string;
}

export async function authorizeTicket(payload: TicketPayload) {
  try {
    const response = await api.post(
      '/generate-fact-prov/ticket-to-factura-proveedor',
      payload,
    );
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error al autorizar el ticket',
      error: error.message,
    };
  }
}
