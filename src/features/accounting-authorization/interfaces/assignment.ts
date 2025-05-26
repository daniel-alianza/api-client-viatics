export interface Assignment {
  id: number;
  userId: number;
  cardNumber: string;
  assignedTo: string;
  alias: string;
  description: string;
  limit: number;
  exitDate: string;
  returnDate: string;
  status: string;
}
