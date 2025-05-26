export interface TravelExpenses {
  transportation: number;
  tolls: number;
  lodging: number;
  food: number;
  freight: number;
  tools: number;
  shipping: number;
  miscellaneous: number;
}

export interface TravelExpenseFormData {
  userId: string;
  totalAmount: number;
  departureDate?: Date;
  returnDate?: Date;
  distributionDate?: Date;
  travelReason: string;
  travelObjectives: string;
  expenses: TravelExpenses;
}

export interface CreateExpenseRequestDto {
  userId: number;
  totalAmount: number;
  travelReason: string;
  departureDate: string;
  returnDate: string;
  disbursementDate: string;
  travelObjectives: string;
  details: {
    concept: string;
    amount: number;
  }[];
}
