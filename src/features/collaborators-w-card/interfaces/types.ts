export interface Card {
  id: number;
  cardNumber: string;
  isActive: boolean;
  assignedAt: string;
}

export interface Area {
  id: number;
  name: string;
}

export interface Collaborator {
  id: number;
  name: string;
  email: string;
  department?: string;
  companyId?: number;
  branchId?: number;
  areaId?: number;
  area?: Area;
  roleId: number;
  cards: Card[];
  hasCard: boolean; // Propiedad calculada para facilitar el filtrado
}
