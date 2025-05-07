export interface CardAssignment {
  id: number;
  userId: number;
  cardNumber: string;
  description: string;
  sign: string;
  requestedAmount: number; // Viáticos solicitados
  limit: number; // Límite actual de la tarjeta
  amountToAdjust: number; // Monto a ajustar
  startDate: string;
  endDate: string;
  status: 'APROBADA' | 'DISPERSADA';
  travelReason?: string;
  totalAmount?: number;
  departureDate?: string;
  returnDate?: string;
}

export interface ExportConfig {
  groupNumber: string; // Número de grupo proporcionado por el ejecutivo
}

export interface UserCard {
  id: number;
  cardNumber: string;
  isActive: boolean;
  limite: number;
}

export interface CardNumberCache {
  [userId: number]: string;
}
