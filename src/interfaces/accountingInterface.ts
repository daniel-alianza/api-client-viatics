export interface Card {
  id: number;
  cardNumber: string;
  isActive: boolean;
  limite: number;
}

export interface ApiResponse {
  cards?: Card[];
}
