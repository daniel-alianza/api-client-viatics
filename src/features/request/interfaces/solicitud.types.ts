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
  departureDate?: Date;
  returnDate?: Date;
  distributionDate?: Date;
  objectives: string[];
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
