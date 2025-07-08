// Interfaz para la respuesta de la API
export interface ApiExpenseRequest {
  id: number;
  userId: number;
  user?: {
    name?: string;
    company?: { name?: string };
    branch?: { name?: string };
    area?: { name?: string };
  };
  departureDate: string;
  disbursementDate: string;
  returnDate: string;
  totalAmount: number | string;
  status?: string;
  travelReason?: string;
  travelObjectives?: string;
  details?: Array<{
    id: number;
    concept?: string;
    amount: number | string;
  }>;
  createdAt?: string;
}
